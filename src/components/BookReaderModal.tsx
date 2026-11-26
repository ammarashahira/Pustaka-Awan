import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  List,
  BookOpen,
  CheckCircle2,
  NotebookPen,
} from 'lucide-react';
import {
  Book,
  LoanRecord,
  ReaderFontSize,
  ReaderTheme,
} from '../types/library';
import { formatIndonesianDate, getDueStatusInfo } from '../utils/dateAndReminder';

interface BookReaderModalProps {
  book: Book | null;
  loan: LoanRecord | null;
  referenceNow: Date;
  onClose: () => void;
  onUpdateProgress: (loanId: string, chapterIndex: number) => void;
  onToggleBookmark: (loanId: string, chapterIndex: number) => void;
  onSaveNote: (loanId: string, note: string) => void;
  onMarkCompleted: (loanId: string) => void;
  onRequestBorrow: (book: Book) => void;
}

const THEME_STYLES: Record<
  ReaderTheme,
  {
    label: string;
    wrapper: string;
    toolbar: string;
    prose: string;
    muted: string;
    border: string;
    card: string;
    swatch: string;
  }
> = {
  cloud: {
    label: 'Awan',
    wrapper: 'bg-[#FFFDFE] text-[#24324A]',
    toolbar: 'bg-[#FAFBFD]/95 border-[#E3EDF7] text-[#24324A]',
    prose: 'text-[#24324A]',
    muted: 'text-[#5B6B84]',
    border: 'border-[#E3EDF7]',
    card: 'bg-[#F5F9FD] border-[#DCE8F5]',
    swatch: 'bg-[#FFFDFE] border-[#CBD9E8]',
  },
  sky: {
    label: 'Biru Pagi',
    wrapper: 'bg-[#EDF5FC] text-[#1D3048]',
    toolbar: 'bg-[#E5F0FA]/95 border-[#CDE1F4] text-[#1D3048]',
    prose: 'text-[#1D3048]',
    muted: 'text-[#4B6687]',
    border: 'border-[#CDE1F4]',
    card: 'bg-white/75 border-[#C5DCF2]',
    swatch: 'bg-[#DCEEFB] border-[#8AB8E6]',
  },
  petal: {
    label: 'Kelopak',
    wrapper: 'bg-[#FDF1F5] text-[#3B2430]',
    toolbar: 'bg-[#FBE9EF]/95 border-[#F2D2DE] text-[#3B2430]',
    prose: 'text-[#3B2430]',
    muted: 'text-[#735162]',
    border: 'border-[#F2D2DE]',
    card: 'bg-white/75 border-[#EFC9D7]',
    swatch: 'bg-[#FADCE6] border-[#DF8CA9]',
  },
  night: {
    label: 'Malam',
    wrapper: 'bg-[#1B2436] text-[#E6EEF8]',
    toolbar: 'bg-[#171F2F]/95 border-[#2C3952] text-[#E6EEF8]',
    prose: 'text-[#E6EEF8]',
    muted: 'text-[#9EB0C9]',
    border: 'border-[#2C3952]',
    card: 'bg-[#222D42] border-[#31405C]',
    swatch: 'bg-[#1B2436] border-[#4D638B]',
  },
};

const FONT_SIZE_CLASSES: Record<ReaderFontSize, string> = {
  sm: 'text-[16px] leading-[1.8]',
  md: 'text-[18px] leading-[1.85]',
  lg: 'text-[20px] leading-[1.9]',
};

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  loan,
  referenceNow,
  onClose,
  onUpdateProgress,
  onToggleBookmark,
  onSaveNote,
  onMarkCompleted,
  onRequestBorrow,
}) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [theme, setTheme] = useState<ReaderTheme>('cloud');
  const [fontSize, setFontSize] = useState<ReaderFontSize>('md');
  const [showToc, setShowToc] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    if (book) {
      const startIdx = loan
        ? Math.min(loan.currentChapterIndex, book.chapters.length - 1)
        : 0;
      setChapterIndex(startIdx);
      setNoteDraft(loan?.personalNote ?? '');
      setShowToc(false);
    }
  }, [book?.id]);

  if (!book) return null;

  const isPreviewOnly = !loan;
  const activeTheme = THEME_STYLES[theme];
  const currentChapter = book.chapters[chapterIndex] ?? book.chapters[0];
  const isLockedPreviewChapter = isPreviewOnly && chapterIndex > 0;
  const isBookmarked =
    loan !== null && loan.bookmarkedChapterIndex === chapterIndex;
  const progressPercent = Math.round(
    ((chapterIndex + 1) / book.chapters.length) * 100,
  );

  const dueInfo = loan ? getDueStatusInfo(loan.dueAt, referenceNow) : null;

  const goToChapter = (idx: number) => {
    const clamped = Math.max(0, Math.min(book.chapters.length - 1, idx));
    setChapterIndex(clamped);
    setShowToc(false);
    if (loan) {
      onUpdateProgress(loan.id, clamped);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col ${activeTheme.wrapper} transition-colors duration-200`}
      role="dialog"
      aria-modal="true"
      aria-label={`Ruang baca ${book.title}`}
    >
      {/* Top Reader Toolbar */}
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur-md ${activeTheme.toolbar}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className={`min-h-[40px] px-3 rounded-xl border ${activeTheme.border} inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap shrink-0`}
            >
              <X className="w-4 h-4" />
              <span>Tutup Bacaan</span>
            </button>
            <div className="hidden sm:block min-w-0">
              <p className="font-display text-sm font-semibold truncate">
                {book.title}
              </p>
              <p className={`text-xs truncate ${activeTheme.muted}`}>
                {book.author} · Bab {currentChapter.number} dari {book.chapters.length}
                {isPreviewOnly ? ' · Pratinjau Gratis' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Swatches */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-xl border border-black/5"
              role="group"
              aria-label="Pilih tema kertas baca"
            >
              {(Object.keys(THEME_STYLES) as ReaderTheme[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  title={`Tema ${THEME_STYLES[key].label}`}
                  aria-label={`Tema kertas ${THEME_STYLES[key].label}`}
                  className={`w-7 h-7 rounded-lg border transition-transform ${
                    THEME_STYLES[key].swatch
                  } ${
                    theme === key
                      ? 'ring-2 ring-[#4C82B8] scale-105'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                />
              ))}
            </div>

            {/* Font Size */}
            <div
              className={`flex items-center rounded-xl border ${activeTheme.border} p-0.5`}
              role="group"
              aria-label="Ukuran huruf"
            >
              {(['sm', 'md', 'lg'] as ReaderFontSize[]).map((size, idx) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`min-w-[34px] min-h-[34px] px-2 rounded-lg text-xs font-semibold transition-colors ${
                    fontSize === size
                      ? 'bg-[#4C82B8] text-white'
                      : `${activeTheme.muted} hover:opacity-80`
                  }`}
                >
                  {idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+'}
                </button>
              ))}
            </div>

            {loan && (
              <button
                type="button"
                onClick={() => onToggleBookmark(loan.id, chapterIndex)}
                aria-label={
                  isBookmarked ? 'Hapus pembatas buku' : 'Pasang pembatas buku di bab ini'
                }
                className={`min-w-[40px] min-h-[40px] px-3 rounded-xl border ${activeTheme.border} inline-flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap`}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-[#C95B7F]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="hidden lg:inline">
                  {isBookmarked ? 'Ditandai' : 'Tandai Bab'}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowToc((prev) => !prev)}
              className={`min-h-[40px] px-3 rounded-xl border ${activeTheme.border} inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Bab</span>
            </button>
          </div>
        </div>

        {/* Reading Depth Progress Line */}
        <div className="h-1 w-full bg-black/5">
          <div
            className="h-full bg-gradient-to-r from-[#7AAAD8] to-[#D97A9B] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Scrollable Reading Canvas */}
      <div className="relative flex-1 overflow-y-auto">
        {/* Optional Slide-Down Chapter Drawer */}
        {showToc && (
          <div
            className={`border-b ${activeTheme.border} ${activeTheme.card} py-5 px-4 sm:px-6`}
          >
            <div className="mx-auto max-w-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold">
                  Daftar Isi — {book.title}
                </h3>
                <span className={`text-xs tabular-nums ${activeTheme.muted}`}>
                  Kemajuan: {progressPercent}%
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {book.chapters.map((chap, idx) => {
                  const active = idx === chapterIndex;
                  const bookmarked = loan?.bookmarkedChapterIndex === idx;
                  return (
                    <button
                      key={chap.id}
                      type="button"
                      onClick={() => goToChapter(idx)}
                      className={`text-left p-3 rounded-xl border transition-colors ${
                        active
                          ? 'border-[#4C82B8] bg-[#4C82B8]/10'
                          : `${activeTheme.border} hover:border-[#8AB8E6]`
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={activeTheme.muted}>
                          Bab 0{chap.number}
                        </span>
                        {bookmarked && (
                          <BookmarkCheck
                            className="w-3.5 h-3.5 text-[#C95B7F]"
                            aria-label="Ditandai"
                          />
                        )}
                      </div>
                      <p className="text-sm font-medium mt-1 line-clamp-1">
                        {chap.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Theme Selector */}
              <div className="flex md:hidden items-center justify-between pt-2">
                <span className={`text-xs ${activeTheme.muted}`}>Tema Kertas:</span>
                <div className="flex items-center gap-2">
                  {(Object.keys(THEME_STYLES) as ReaderTheme[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key)}
                      className={`px-2.5 py-1 rounded-lg text-xs border ${
                        theme === key
                          ? 'border-[#4C82B8] font-semibold'
                          : activeTheme.border
                      }`}
                    >
                      {THEME_STYLES[key].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center Editorial Column */}
        <main className="mx-auto max-w-2xl px-5 sm:px-8 py-10 sm:py-14">
          {loan && dueInfo && (
            <div
              className={`mb-8 rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs ${activeTheme.card}`}
            >
              <span className={activeTheme.muted}>
                Pinjaman aktif · Kembali {formatIndonesianDate(loan.dueAt)}
              </span>
              <span className="font-semibold tabular-nums">
                {dueInfo.label}
              </span>
            </div>
          )}

          <div className="space-y-3 pb-6 border-b border-current/10">
            <p className={`text-xs uppercase tracking-[0.18em] ${activeTheme.muted}`}>
              Bab {currentChapter.number} · {book.category}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight text-balance">
              {currentChapter.title}
            </h1>
            <p className={`text-sm italic font-reading ${activeTheme.muted}`}>
              {currentChapter.subtitle}
            </p>
          </div>

          {isLockedPreviewChapter ? (
            <div
              className={`my-10 rounded-2xl border p-7 text-center space-y-4 ${activeTheme.card}`}
            >
              <BookOpen
                className="w-8 h-8 mx-auto text-[#C95B7F]"
                aria-hidden="true"
              />
              <h2 className="font-display text-2xl font-semibold">
                Pratinjau Bab 1 Selesai
              </h2>
              <p className={`text-sm max-w-md mx-auto leading-relaxed ${activeTheme.muted}`}>
                Untuk melanjutkan membaca Bab {currentChapter.number} dan menyimpan pembatas buku beserta catatan pribadimu, pinjam buku ini secara online gratis.
              </p>
              <button
                type="button"
                onClick={() => onRequestBorrow(book)}
                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#C95B7F] hover:bg-[#B54B6E] text-white text-sm font-semibold transition-colors"
              >
                Pinjam Buku Ini Sekarang
              </button>
            </div>
          ) : (
            <article className={`pt-8 space-y-6 font-reading ${FONT_SIZE_CLASSES[fontSize]} ${activeTheme.prose}`}>
              {currentChapter.paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? 'first-letter:text-5xl first-letter:font-display first-letter:font-semibold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'
                      : ''
                  }
                >
                  {para}
                </p>
              ))}

              {currentChapter.pullQuote && (
                <blockquote className="my-8 py-6 border-y border-current/15 text-center font-display italic text-xl sm:text-2xl leading-relaxed opacity-90">
                  “{currentChapter.pullQuote}”
                </blockquote>
              )}
            </article>
          )}

          {/* Personal Note for Borrowed Books */}
          {loan && !isLockedPreviewChapter && (
            <section
              className={`mt-12 rounded-2xl border p-5 space-y-3 ${activeTheme.card}`}
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="reader-personal-note"
                  className="inline-flex items-center gap-2 text-sm font-semibold"
                >
                  <NotebookPen className="w-4 h-4 text-[#4C82B8]" aria-hidden="true" />
                  <span>Catatan Pinggir Pribadi</span>
                </label>
                <span className={`text-xs ${activeTheme.muted}`}>
                  Tersimpan di rak pinjamanmu
                </span>
              </div>
              <textarea
                id="reader-personal-note"
                rows={2}
                value={noteDraft}
                onChange={(e) => {
                  setNoteDraft(e.target.value);
                  onSaveNote(loan.id, e.target.value);
                }}
                placeholder="Tulis kutipan favorit atau kesanmu tentang bab ini..."
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-[#4C82B8]/40 ${activeTheme.border}`}
              />
            </section>
          )}

          {/* Chapter Navigation Footer */}
          <nav
            aria-label="Navigasi antar bab"
            className="mt-10 pt-6 border-t border-current/15 flex flex-wrap items-center justify-between gap-3"
          >
            <button
              type="button"
              disabled={chapterIndex === 0}
              onClick={() => goToChapter(chapterIndex - 1)}
              className={`min-h-[44px] px-4 py-2 rounded-xl border ${activeTheme.border} inline-flex items-center gap-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80 transition-opacity`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bab Sebelumnya</span>
            </button>

            <span className={`text-xs tabular-nums ${activeTheme.muted}`}>
              Bab {chapterIndex + 1} / {book.chapters.length} ({progressPercent}%)
            </span>

            {chapterIndex < book.chapters.length - 1 ? (
              <button
                type="button"
                onClick={() => goToChapter(chapterIndex + 1)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] text-white inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <span>Bab Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : loan ? (
              <button
                type="button"
                onClick={() => {
                  onMarkCompleted(loan.id);
                  onClose();
                }}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#C95B7F] hover:bg-[#B54B6E] text-white inline-flex items-center gap-2 text-sm font-medium transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Tandai Selesai Dibaca</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRequestBorrow(book)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#C95B7F] hover:bg-[#B54B6E] text-white text-sm font-medium transition-colors"
              >
                Pinjam Buku Ini
              </button>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
};
