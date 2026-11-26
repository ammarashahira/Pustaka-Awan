import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BellRing,
  BookOpen,
  CalendarCheck,
  Search,
  X,
  CheckCircle2,
} from 'lucide-react';
import { LIBRARY_BOOKS } from './data/books';
import {
  Book,
  BookCategory,
  LoanDuration,
  LoanRecord,
  ReminderNotification,
  ReminderPreferences,
} from './types/library';
import {
  addDaysToDate,
  evaluateLoanReminders,
  formatIndonesianDate,
  formatShortDayMonth,
  getDateKey,
  getDaysRemaining,
  getDueStatusInfo,
  getVirtualNow,
  playGentleBellChime,
} from './utils/dateAndReminder';
import { Header } from './components/Header';
import { BookCover } from './components/BookCover';
import { BorrowModal } from './components/BorrowModal';
import { BookReaderModal } from './components/BookReaderModal';
import { ReminderDrawer } from './components/ReminderDrawer';
import { LoansAndRemindersSection } from './components/LoansAndRemindersSection';

const STORAGE_KEYS = {
  loans: 'pustaka_awan_loans_v1',
  notifications: 'pustaka_awan_notifications_v1',
  preferences: 'pustaka_awan_prefs_v1',
  returnedCount: 'pustaka_awan_returned_count_v1',
};

const MAX_ACTIVE_LOANS = 5;

const CATEGORIES: ('Semua' | BookCategory)[] = [
  'Semua',
  'Dongeng & Fantasi',
  'Fiksi Hangat',
  'Sains & Alam',
  'Puisi & Esai',
];

const DEFAULT_PREFERENCES: ReminderPreferences = {
  autoRemindH2: true,
  autoRemindH1: true,
  autoRemindDueDay: true,
  browserNotifications: false,
  gentleChime: true,
};

function createInitialLoans(): LoanRecord[] {
  const now = new Date();
  return [
    {
      id: 'loan-seed-1',
      bookId: 'lentera-awan-pagi',
      borrowedAt: addDaysToDate(now, -6).toISOString(),
      dueAt: addDaysToDate(now, 1).toISOString(),
      durationDays: 7,
      reminderLeadDays: 2,
      extendedOnce: false,
      currentChapterIndex: 1,
      bookmarkedChapterIndex: 1,
      personalNote: 'Bab pelabuhan pita sangat menenangkan dibaca sebelum tidur.',
      completed: false,
    },
    {
      id: 'loan-seed-2',
      bookId: 'pondok-cangkir-lavender',
      borrowedAt: addDaysToDate(now, -1).toISOString(),
      dueAt: addDaysToDate(now, 6).toISOString(),
      durationDays: 7,
      reminderLeadDays: 2,
      extendedOnce: false,
      currentChapterIndex: 0,
      bookmarkedChapterIndex: null,
      personalNote: '',
      completed: false,
    },
  ];
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [loans, setLoans] = useState<LoanRecord[]>(() =>
    loadFromStorage<LoanRecord[]>(STORAGE_KEYS.loans, createInitialLoans()),
  );
  const [notifications, setNotifications] = useState<ReminderNotification[]>(
    () => loadFromStorage<ReminderNotification[]>(STORAGE_KEYS.notifications, []),
  );
  const [preferences, setPreferences] = useState<ReminderPreferences>(() =>
    loadFromStorage<ReminderPreferences>(
      STORAGE_KEYS.preferences,
      DEFAULT_PREFERENCES,
    ),
  );
  const [returnedOnTimeCount, setReturnedOnTimeCount] = useState<number>(() =>
    loadFromStorage<number>(STORAGE_KEYS.returnedCount, 4),
  );

  const [dayOffset, setDayOffset] = useState<number>(0);
  const [clockTick, setClockTick] = useState<number>(0);
  const referenceNow = useMemo(
    () => getVirtualNow(dayOffset),
    [dayOffset, clockTick],
  );

  // Catalog filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'Semua' | BookCategory
  >('Semua');
  const [availabilityFilter, setAvailabilityFilter] = useState<
    'semua' | 'tersedia' | 'dipinjam'
  >('semua');

  // Modals & Drawers
  const [borrowTargetBook, setBorrowTargetBook] = useState<Book | null>(null);
  const [readerBook, setReaderBook] = useState<Book | null>(null);
  const [organizerOpen, setOrganizerOpen] = useState(false);
  const [heroImageFailed, setHeroImageFailed] = useState(false);

  // Non-intrusive live toast for automated reminders or actions
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const userInteractedRef = useRef(false);

  const [browserPermission, setBrowserPermission] = useState<
    NotificationPermission | 'unsupported'
  >(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  });

  // Persist state
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.loans, JSON.stringify(loans));
    } catch {
      // Ignore storage quota errors
    }
  }, [loans]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.notifications,
        JSON.stringify(notifications),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [notifications]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.preferences,
        JSON.stringify(preferences),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [preferences]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.returnedCount,
        JSON.stringify(returnedOnTimeCount),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [returnedOnTimeCount]);

  // Periodic background tick (every 60s) to catch real-time day rollovers
  useEffect(() => {
    const timer = window.setInterval(() => {
      setClockTick((t) => t + 1);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Automated return reminder evaluator
  useEffect(() => {
    const newlyGenerated = evaluateLoanReminders(
      loans,
      LIBRARY_BOOKS,
      notifications,
      preferences,
      referenceNow,
    );

    if (newlyGenerated.length === 0) return;

    setNotifications((prev) => [...newlyGenerated, ...prev]);

    const latest = newlyGenerated[0];
    if (userInteractedRef.current) {
      setActiveToast({
        title: latest.title,
        message: latest.message,
      });

      if (preferences.gentleChime) {
        playGentleBellChime();
      }

      if (
        preferences.browserNotifications &&
        typeof window !== 'undefined' &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        try {
          new Notification(`Pustaka Awan — ${latest.title}`, {
            body: latest.message,
          });
        } catch {
          // Ignore browser notification errors in sandboxed iframes
        }
      }
    }
  }, [loans, preferences, referenceNow]);

  // Auto-dismiss toast after 6s
  useEffect(() => {
    if (!activeToast) return;
    const timer = window.setTimeout(() => setActiveToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [activeToast]);

  const activeLoanByBookId = useMemo(() => {
    const map = new Map<string, LoanRecord>();
    for (const loan of loans) {
      map.set(loan.bookId, loan);
    }
    return map;
  }, [loans]);

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return LIBRARY_BOOKS.filter((book) => {
      const matchesCategory =
        selectedCategory === 'Semua' || book.category === selectedCategory;
      const isBorrowed = activeLoanByBookId.has(book.id);
      const matchesAvailability =
        availabilityFilter === 'semua' ||
        (availabilityFilter === 'tersedia' && !isBorrowed) ||
        (availabilityFilter === 'dipinjam' && isBorrowed);
      const matchesQuery =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.synopsis.toLowerCase().includes(query);
      return matchesCategory && matchesAvailability && matchesQuery;
    });
  }, [searchQuery, selectedCategory, availabilityFilter, activeLoanByBookId]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const handleConfirmBorrow = (
    book: Book,
    durationDays: LoanDuration,
    reminderLeadDays: 1 | 2 | 3,
    personalNote: string,
  ) => {
    userInteractedRef.current = true;
    if (activeLoanByBookId.has(book.id) || loans.length >= MAX_ACTIVE_LOANS) {
      return;
    }

    const dueAt = addDaysToDate(referenceNow, durationDays);
    const newLoan: LoanRecord = {
      id: `loan-${book.id}-${Date.now()}`,
      bookId: book.id,
      borrowedAt: referenceNow.toISOString(),
      dueAt: dueAt.toISOString(),
      durationDays,
      reminderLeadDays,
      extendedOnce: false,
      currentChapterIndex: 0,
      bookmarkedChapterIndex: null,
      personalNote,
      completed: false,
    };

    const confirmNotif: ReminderNotification = {
      id: `notif-borrow-${Date.now()}`,
      loanId: newLoan.id,
      bookId: book.id,
      bookTitle: book.title,
      type: 'borrowed',
      triggerDateKey: `borrow-${newLoan.id}-${getDateKey(referenceNow)}`,
      title: 'Peminjaman Berhasil Dicatat',
      message: `"${book.title}" siap dibaca hingga ${formatIndonesianDate(dueAt)}. Pengingat otomatis disetel mulai H-${reminderLeadDays}.`,
      createdAt: referenceNow.toISOString(),
      read: false,
    };

    setLoans((prev) => [newLoan, ...prev]);
    setNotifications((prev) => [confirmNotif, ...prev]);
    setBorrowTargetBook(null);
    setReaderBook(book);
    setActiveToast({
      title: 'Buku Masuk ke Rak Pinjaman',
      message: `Selamat membaca "${book.title}". Tenggat kembali ${formatShortDayMonth(dueAt)}.`,
    });

    if (preferences.gentleChime) {
      playGentleBellChime();
    }
  };

  const handleExtendLoan = (loanId: string) => {
    userInteractedRef.current = true;
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== loanId || loan.extendedOnce) return loan;
        const nextDue = addDaysToDate(new Date(loan.dueAt), 3);
        const book = LIBRARY_BOOKS.find((b) => b.id === loan.bookId);

        if (book) {
          const notif: ReminderNotification = {
            id: `notif-extend-${Date.now()}`,
            loanId: loan.id,
            bookId: book.id,
            bookTitle: book.title,
            type: 'extended',
            triggerDateKey: `extend-${loan.id}-${Date.now()}`,
            title: 'Durasi Pinjaman Diperpanjang',
            message: `Tenggat "${book.title}" diperpanjang +3 hari hingga ${formatIndonesianDate(nextDue)}.`,
            createdAt: referenceNow.toISOString(),
            read: false,
          };
          setNotifications((nPrev) => [notif, ...nPrev]);
          setActiveToast({
            title: 'Perpanjangan +3 Hari Berhasil',
            message: `"${book.title}" kini jatuh tempo ${formatIndonesianDate(nextDue)}.`,
          });
        }

        return {
          ...loan,
          dueAt: nextDue.toISOString(),
          extendedOnce: true,
        };
      }),
    );
  };

  const handleReturnLoan = (loanId: string) => {
    userInteractedRef.current = true;
    const target = loans.find((l) => l.id === loanId);
    if (!target) return;

    const book = LIBRARY_BOOKS.find((b) => b.id === target.bookId);
    const daysLeft = getDaysRemaining(target.dueAt, referenceNow);
    if (daysLeft >= 0) {
      setReturnedOnTimeCount((c) => c + 1);
    }

    setLoans((prev) => prev.filter((l) => l.id !== loanId));

    if (book) {
      const returnNotif: ReminderNotification = {
        id: `notif-return-${Date.now()}`,
        loanId: target.id,
        bookId: book.id,
        bookTitle: book.title,
        type: 'returned',
        triggerDateKey: `return-${target.id}-${Date.now()}`,
        title: 'Buku Telah Dikembalikan',
        message: `Terima kasih sudah mengembalikan "${book.title}". Buku kini tersedia kembali untuk pembaca lain.`,
        createdAt: referenceNow.toISOString(),
        read: true,
      };
      setNotifications((prev) => [returnNotif, ...prev]);
      setActiveToast({
        title: 'Pengembalian Tercatat Rapi',
        message: `"${book.title}" berhasil dikembalikan ke rak perpustakaan.`,
      });
    }
  };

  const handleUpdateProgress = (loanId: string, chapterIndex: number) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              currentChapterIndex: Math.max(l.currentChapterIndex, chapterIndex),
            }
          : l,
      ),
    );
  };

  const handleToggleBookmark = (loanId: string, chapterIndex: number) => {
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              bookmarkedChapterIndex:
                l.bookmarkedChapterIndex === chapterIndex ? null : chapterIndex,
            }
          : l,
      ),
    );
  };

  const handleSaveNote = (loanId: string, note: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, personalNote: note } : l)),
    );
  };

  const handleMarkCompleted = (loanId: string) => {
    userInteractedRef.current = true;
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, completed: true } : l)),
    );
    setActiveToast({
      title: 'Bacaan Ditandai Selesai',
      message: 'Kamu bisa mengembalikan buku lebih awal dari Rak Pinjamanmu.',
    });
  };

  const handleRequestBrowserPermission = async () => {
    userInteractedRef.current = true;
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserPermission('unsupported');
      return;
    }
    try {
      const res = await Notification.requestPermission();
      setBrowserPermission(res);
      if (res === 'granted') {
        setPreferences((p) => ({ ...p, browserNotifications: true }));
        new Notification('Pustaka Awan', {
          body: 'Notifikasi pengingat pengembalian buku sudah aktif.',
        });
      }
    } catch {
      // Ignore permission rejection
    }
  };

  const handleAdvanceDay = (delta: number) => {
    userInteractedRef.current = true;
    setDayOffset((d) => d + delta);
  };

  const handleResetTime = () => {
    userInteractedRef.current = true;
    setDayOffset(0);
    setActiveToast({
      title: 'Kalender Kembali ke Hari Ini',
      message: `Tanggal aktif disetel ulang ke ${formatIndonesianDate(new Date())}.`,
    });
  };

  const activeReaderLoan = readerBook
    ? activeLoanByBookId.get(readerBook.id) ?? null
    : null;

  return (
    <div id="beranda" className="min-h-screen flex flex-col bg-[#FAFBFD] text-[#24324A]">
      <Header
        unreadCount={unreadCount}
        activeLoanCount={loans.length}
        onOpenOrganizer={() => setOrganizerOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Split Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F2F8FE] via-[#FAFBFD] to-[#FDF2F6] pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-[#E6EFF8]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Narrative Column */}
              <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4C82B8]">
                  Perpustakaan Digital Pastel · Koleksi Kurasi
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-[1.12] tracking-tight text-[#24324A] text-balance">
                  Ruang baca tenang di antara awan biru dan kelopak merah jambu
                </h1>
                <p className="text-base sm:text-lg text-[#4D5E78] leading-relaxed max-w-xl">
                  Pinjam buku favorit secara online dalam hitungan detik, nikmati bacaan langsung di peramban dengan tema kertas yang lembut, dan biarkan pengingat otomatis menjaga jadwal pengembalianmu tetap teratur.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="#katalog"
                    className="min-h-[44px] px-6 py-3 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4C82B8]"
                  >
                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                    <span>Jelajahi Katalog</span>
                  </a>
                  <a
                    href="#rak-pinjaman"
                    className="min-h-[44px] px-5 py-3 rounded-xl border border-[#E7C6D2] bg-white hover:bg-[#FDF2F6] text-[#8F3252] text-sm font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C95B7F]"
                  >
                    <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                    <span>Rak Pinjaman ({loans.length})</span>
                  </a>
                </div>
              </div>

              {/* Right Focal Illustration */}
              <div className="lg:col-span-6 flex">
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#DCE8F5] bg-[#EAF4FB] shadow-sm min-h-[280px] lg:min-h-[380px]">
                  {!heroImageFailed ? (
                    <img
                      src="/src/assets/images/hero_cloud_library_1795677567906.jpg"
                      alt="Ilustrasi perpustakaan dongeng Pustaka Awan bernuansa biru pastel dan merah jambu"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImageFailed(true)}
                      className="w-full h-full lg:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#E4F1FB] to-[#FCEBF1]">
                      <BookOpen className="w-12 h-12 text-[#4C82B8] mb-3" />
                      <p className="font-display text-xl font-semibold text-[#24324A]">
                        Paviliun Pustaka Awan
                      </p>
                      <p className="text-sm text-[#5B6B84] mt-1">
                        Pinjam online, baca langsung, dan tetap terorganisir.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4-Column Operational Utility Strip Below Hero Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl bg-white/85 border border-[#DCE8F5] px-4 py-3.5">
                <p className="text-xs text-[#5B6B84]">Koleksi Kurasi</p>
                <p className="text-sm font-semibold text-[#24324A] mt-0.5 tabular-nums">
                  {LIBRARY_BOOKS.length} Buku Siap Baca
                </p>
              </div>
              <div className="rounded-xl bg-white/85 border border-[#DCE8F5] px-4 py-3.5">
                <p className="text-xs text-[#5B6B84]">Ruang Baca Web</p>
                <p className="text-sm font-semibold text-[#24324A] mt-0.5">
                  4 Tema Kertas & Pembatas
                </p>
              </div>
              <div className="rounded-xl bg-white/85 border border-[#F0D5E0] px-4 py-3.5">
                <p className="text-xs text-[#5B6B84]">Durasi Pinjam Online</p>
                <p className="text-sm font-semibold text-[#24324A] mt-0.5">
                  3, 7, atau 14 Hari Fleksibel
                </p>
              </div>
              <div className="rounded-xl bg-white/85 border border-[#F0D5E0] px-4 py-3.5">
                <p className="text-xs text-[#5B6B84]">Pengingat Otomatis</p>
                <p className="text-sm font-semibold text-[#C95B7F] mt-0.5">
                  Notifikasi H-2, H-1 & Hari-H
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section */}
        <section id="katalog" className="py-14 bg-[#FAFBFD]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C95B7F]">
                  Katalog Perpustakaan
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#24324A]">
                  Pilih bacaan yang ingin kamu pinjam hari ini
                </h2>
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search
                  className="w-4 h-4 text-[#6B7B93] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul atau penulis..."
                  aria-label="Cari judul atau penulis buku"
                  className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-xl border border-[#DCE8F5] bg-white text-sm text-[#24324A] placeholder:text-[#8A99B0] focus:outline-none focus:border-[#4C82B8] focus:ring-2 focus:ring-[#4C82B8]/20"
                />
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#E6EFF8]">
              {/* Interactive Category Buttons */}
              <div
                className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#EEF5FC] border border-[#DCE8F5]"
                role="tablist"
                aria-label="Filter kategori buku"
              >
                {CATEGORIES.map((category) => {
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedCategory(category)}
                      className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-white text-[#24324A] shadow-xs'
                          : 'text-[#4D5E78] hover:text-[#24324A]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Availability Segmented Control */}
              <div
                className="flex items-center gap-1 p-1 rounded-xl bg-[#FDF1F5] border border-[#F2D5DF] self-start lg:self-auto"
                role="group"
                aria-label="Filter status ketersediaan"
              >
                {(
                  [
                    { id: 'semua', label: 'Semua Status' },
                    { id: 'tersedia', label: 'Siap Dipinjam' },
                    { id: 'dipinjam', label: 'Sedang Dipinjam' },
                  ] as const
                ).map((item) => {
                  const active = availabilityFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAvailabilityFilter(item.id)}
                      className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        active
                          ? 'bg-white text-[#8F3252] shadow-xs'
                          : 'text-[#6E4F5E] hover:text-[#24324A]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book Grid */}
            {filteredBooks.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#DCE8F5] p-10 text-center space-y-3">
                <p className="font-display text-xl font-semibold text-[#24324A]">
                  Belum ada buku yang cocok dengan pencarianmu
                </p>
                <p className="text-sm text-[#5B6B84]">
                  Coba ubah kata kunci atau pilih kategori Semua untuk melihat seluruh koleksi Pustaka Awan.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Semua');
                    setAvailabilityFilter('semua');
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl bg-[#4C82B8] text-white text-sm font-medium"
                >
                  Tampilkan Semua Buku
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  const activeLoan = activeLoanByBookId.get(book.id);
                  const dueStatus = activeLoan
                    ? getDueStatusInfo(activeLoan.dueAt, referenceNow)
                    : null;
                  const availableCopies = activeLoan
                    ? book.totalCopies - 1
                    : book.totalCopies;

                  return (
                    <article
                      key={book.id}
                      className="group rounded-2xl bg-white border border-[#DCE8F5] p-4 flex flex-col justify-between gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="space-y-3.5">
                        <button
                          type="button"
                          onClick={() => setReaderBook(book)}
                          className="w-full text-left block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-xl"
                          aria-label={`Buka pratinjau atau baca buku ${book.title}`}
                        >
                          <BookCover book={book} />
                        </button>

                        <div className="space-y-1.5">
                          {/* Clean Unboxed Metadata (Zero-Pill Rule) */}
                          <p className="text-xs text-[#5B6B84] truncate">
                            {book.category} · {book.pages} hlm ·{' '}
                            <span className="tabular-nums">
                              {availableCopies} salinan
                            </span>
                          </p>

                          <h3 className="font-display text-lg font-semibold leading-snug text-[#24324A] line-clamp-2">
                            {book.title}
                          </h3>

                          <p className="text-xs font-medium text-[#4D5E78]">
                            {book.author}
                          </p>

                          <p className="text-xs sm:text-sm text-[#5B6B84] leading-relaxed line-clamp-2 pt-0.5">
                            {book.synopsis}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#EFF4FA] space-y-2">
                        {activeLoan && dueStatus ? (
                          <>
                            <div className="flex items-center justify-between text-xs text-[#3B6FA3] font-medium tabular-nums">
                              <span className="inline-flex items-center gap-1">
                                <CheckCircle2
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                                Dipinjam
                              </span>
                              <span>{dueStatus.label}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setReaderBook(book)}
                              className="w-full min-h-[40px] px-4 py-2 rounded-xl bg-[#C95B7F] hover:bg-[#B54B6E] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                            >
                              <BookOpen className="w-4 h-4" aria-hidden="true" />
                              <span>Baca Sekarang</span>
                            </button>
                          </>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setBorrowTargetBook(book)}
                              className="min-h-[40px] px-3 py-2 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                            >
                              Pinjam
                            </button>
                            <button
                              type="button"
                              onClick={() => setReaderBook(book)}
                              className="min-h-[40px] px-3 py-2 rounded-xl border border-[#E7C6D2] bg-[#FDF4F7] hover:bg-[#FAE6ED] text-[#8F3252] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                            >
                              Pratinjau
                            </button>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Active Loans & Automated Return Reminders Workspace */}
        <LoansAndRemindersSection
          loans={loans}
          books={LIBRARY_BOOKS}
          notifications={notifications}
          preferences={preferences}
          referenceNow={referenceNow}
          dayOffset={dayOffset}
          returnedOnTimeCount={returnedOnTimeCount}
          browserPermission={browserPermission}
          onOpenReader={(book) => setReaderBook(book)}
          onExtendLoan={handleExtendLoan}
          onReturnLoan={handleReturnLoan}
          onMarkRead={(id) =>
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            )
          }
          onAdvanceDay={handleAdvanceDay}
          onResetTime={handleResetTime}
          onRequestBrowserPermission={handleRequestBrowserPermission}
          onOpenOrganizerDrawer={() => setOrganizerOpen(true)}
        />

        {/* How It Works Editorial Section */}
        <section id="cara-kerja" className="py-14 bg-[#FAFBFD] border-t border-[#E6EFF8]">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4C82B8]">
                Cara Kerja Perpustakaan
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#24324A] text-balance">
                Membaca tenang dan teratur dalam tiga langkah sederhana
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-[#F4F9FE] border border-[#DCE8F5] p-6 space-y-2.5">
                <p className="text-xs font-semibold text-[#4C82B8] tabular-nums">
                  01. Pinjam Online
                </p>
                <h3 className="font-display text-xl font-semibold text-[#24324A]">
                  Pilih durasi sesuai ritmemu
                </h3>
                <p className="text-sm text-[#4D5E78] leading-relaxed">
                  Tentukan masa pinjam 3, 7, atau 14 hari langsung dari katalog. Tanggal kembali dan jadwal pengingat otomatis langsung dihitung untukmu.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FDF4F7] border border-[#F0D5E0] p-6 space-y-2.5">
                <p className="text-xs font-semibold text-[#C95B7F] tabular-nums">
                  02. Baca di Website
                </p>
                <h3 className="font-display text-xl font-semibold text-[#24324A]">
                  Halaman nyaman tanpa instalasi
                </h3>
                <p className="text-sm text-[#4D5E78] leading-relaxed">
                  Ganti tema kertas awan, biru pagi, kelopak pink, atau malam tenang. Simpan pembatas bab dan catatan pinggir pribadimu kapan saja.
                </p>
              </div>

              <div className="rounded-2xl bg-[#F4F9FE] border border-[#DCE8F5] p-6 space-y-2.5">
                <p className="text-xs font-semibold text-[#4C82B8] tabular-nums">
                  03. Pengingat Otomatis
                </p>
                <h3 className="font-display text-xl font-semibold text-[#24324A]">
                  Selalu ingat sebelum jatuh tempo
                </h3>
                <p className="text-sm text-[#4D5E78] leading-relaxed">
                  Sistem memantau tenggatmu dan mengirim pengingat lembut di H-2, H-1, dan hari-H lengkap dengan tombol perpanjang atau kembalikan satu klik.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[#E6EFF8] bg-white py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5B6B84]">
          <p className="font-display text-sm font-semibold text-[#24324A]">
            Pustaka Awan
          </p>
          <p>
            Perpustakaan digital bernuansa pastel biru dan merah jambu untuk kebiasaan membaca yang terorganisir.
          </p>
          <div className="flex items-center gap-4">
            <a href="#katalog" className="hover:text-[#24324A]">
              Katalog
            </a>
            <a href="#rak-pinjaman" className="hover:text-[#24324A]">
              Rak Pinjaman
            </a>
            <button
              type="button"
              onClick={() => setOrganizerOpen(true)}
              className="hover:text-[#24324A]"
            >
              Kotak Pengingat
            </button>
          </div>
        </div>
      </footer>

      {/* Live Toast Banner (bottom-right, single toast at a time) */}
      {activeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl bg-white border border-[#E7C6D2] shadow-lg p-4 flex items-start gap-3"
        >
          <BellRing
            className="w-5 h-5 text-[#C95B7F] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-sm font-semibold text-[#24324A]">
              {activeToast.title}
            </p>
            <p className="text-xs text-[#4D5E78] leading-relaxed">
              {activeToast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveToast(null)}
            aria-label="Tutup pemberitahuan"
            className="text-[#6B7B93] hover:text-[#24324A] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <BorrowModal
        book={borrowTargetBook}
        referenceNow={referenceNow}
        activeLoanCount={loans.length}
        maxLoans={MAX_ACTIVE_LOANS}
        onClose={() => setBorrowTargetBook(null)}
        onConfirmBorrow={handleConfirmBorrow}
      />

      <BookReaderModal
        book={readerBook}
        loan={activeReaderLoan}
        referenceNow={referenceNow}
        onClose={() => setReaderBook(null)}
        onUpdateProgress={handleUpdateProgress}
        onToggleBookmark={handleToggleBookmark}
        onSaveNote={handleSaveNote}
        onMarkCompleted={handleMarkCompleted}
        onRequestBorrow={(book) => {
          setReaderBook(null);
          setBorrowTargetBook(book);
        }}
      />

      <ReminderDrawer
        isOpen={organizerOpen}
        onClose={() => setOrganizerOpen(false)}
        loans={loans}
        books={LIBRARY_BOOKS}
        notifications={notifications}
        preferences={preferences}
        referenceNow={referenceNow}
        dayOffset={dayOffset}
        browserPermission={browserPermission}
        onMarkRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
          )
        }
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onExtendLoan={handleExtendLoan}
        onReturnLoan={handleReturnLoan}
        onOpenReader={(book) => setReaderBook(book)}
        onAdvanceDay={handleAdvanceDay}
        onResetTime={handleResetTime}
        onUpdatePreferences={(patch) =>
          setPreferences((prev) => ({ ...prev, ...patch }))
        }
        onRequestBrowserPermission={handleRequestBrowserPermission}
      />
    </div>
  );
}
