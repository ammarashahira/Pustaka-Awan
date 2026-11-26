import React from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  BellRing,
  FastForward,
  RotateCcw,
  AlertCircle,
} from 'lucide-react';
import {
  Book,
  LoanRecord,
  ReminderNotification,
  ReminderPreferences,
} from '../types/library';
import {
  formatIndonesianDate,
  getDueStatusInfo,
} from '../utils/dateAndReminder';
import { BookCover } from './BookCover';

interface LoansAndRemindersSectionProps {
  loans: LoanRecord[];
  books: Book[];
  notifications: ReminderNotification[];
  preferences: ReminderPreferences;
  referenceNow: Date;
  dayOffset: number;
  returnedOnTimeCount: number;
  browserPermission: NotificationPermission | 'unsupported';
  onOpenReader: (book: Book) => void;
  onExtendLoan: (loanId: string) => void;
  onReturnLoan: (loanId: string) => void;
  onMarkRead: (id: string) => void;
  onAdvanceDay: (delta: number) => void;
  onResetTime: () => void;
  onRequestBrowserPermission: () => void;
  onOpenOrganizerDrawer: () => void;
}

export const LoansAndRemindersSection: React.FC<
  LoansAndRemindersSectionProps
> = ({
  loans,
  books,
  notifications,
  referenceNow,
  dayOffset,
  returnedOnTimeCount,
  browserPermission,
  onOpenReader,
  onExtendLoan,
  onReturnLoan,
  onMarkRead,
  onAdvanceDay,
  onResetTime,
  onRequestBrowserPermission,
  onOpenOrganizerDrawer,
}) => {
  const sortedLoans = [...loans].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );
  const recentNotifications = notifications.slice(0, 4);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <section
      id="rak-pinjaman"
      className="py-14 border-t border-[#E6EFF8] bg-gradient-to-b from-[#F4F9FE] to-[#FDF5F8]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-10">
        {/* Section Heading & Organizer Summary Strip */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4C82B8]">
              Rak Pinjaman & Pengingat Otomatis
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#24324A] text-balance">
              Semua bacaan aktif & jadwal pengembalianmu tertata rapi
            </h2>
            <p className="text-sm sm:text-base text-[#4D5E78] leading-relaxed">
              Setiap peminjaman langsung dijadwalkan pengingat otomatis H-2, H-1, dan pada hari jatuh tempo agar kamu tidak pernah lupa mengembalikan buku.
            </p>
          </div>

          {/* 3 Clean Tabular Organizer Metrics */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 rounded-2xl bg-white border border-[#DCE8F5] px-5 py-4 shrink-0">
            <div>
              <p className="text-xs text-[#5B6B84]">Dipinjam</p>
              <p className="font-display text-2xl font-semibold text-[#24324A] tabular-nums mt-0.5">
                {loans.length}/5
              </p>
            </div>
            <div className="border-l border-[#E6EFF8] pl-4 sm:pl-6">
              <p className="text-xs text-[#5B6B84]">Pengingat Baru</p>
              <p className="font-display text-2xl font-semibold text-[#C95B7F] tabular-nums mt-0.5">
                {unreadCount}
              </p>
            </div>
            <div className="border-l border-[#E6EFF8] pl-4 sm:pl-6">
              <p className="text-xs text-[#5B6B84]">Tepat Waktu</p>
              <p className="font-display text-2xl font-semibold text-[#4C82B8] tabular-nums mt-0.5">
                {returnedOnTimeCount}
              </p>
            </div>
          </div>
        </div>

        {/* Two-Column Workspace: Left = Active Borrowed Books, Right = Automated Reminder Organizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 columns: Borrowed Books Shelf */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-semibold text-[#24324A]">
                Buku di Rak Pinjamanmu
              </h3>
              <span className="text-xs text-[#5B6B84] tabular-nums">
                Diurutkan berdasarkan tenggat terdekat
              </span>
            </div>

            {sortedLoans.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#DCE8F5] p-8 text-center space-y-3">
                <BookOpen
                  className="w-8 h-8 mx-auto text-[#7AAAD8]"
                  aria-hidden="true"
                />
                <h4 className="font-display text-lg font-semibold text-[#24324A]">
                  Rak pinjamanmu sedang kosong
                </h4>
                <p className="text-sm text-[#5B6B84] max-w-md mx-auto">
                  Pilih buku dari katalog di atas, klik Pinjam Online, lalu mulai membaca langsung dari peramban.
                </p>
                <a
                  href="#katalog"
                  className="inline-flex items-center justify-center min-h-[42px] px-5 py-2 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] text-white text-sm font-medium transition-colors"
                >
                  Jelajahi Katalog Buku
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.bookId);
                  if (!book) return null;
                  const status = getDueStatusInfo(loan.dueAt, referenceNow);
                  const progress = Math.round(
                    ((loan.currentChapterIndex + 1) / book.chapters.length) *
                      100,
                  );

                  const isUrgent =
                    status.urgency === 'overdue' || status.urgency === 'urgent';

                  return (
                    <article
                      key={loan.id}
                      className="rounded-2xl bg-white border border-[#DCE8F5] p-5 flex flex-col sm:flex-row gap-5 transition-shadow hover:shadow-sm"
                    >
                      <div className="w-24 sm:w-28 shrink-0">
                        <BookCover book={book} />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-[#5B6B84]">
                              {book.category} · Bab {loan.currentChapterIndex + 1}/
                              {book.chapters.length}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 font-semibold tabular-nums ${
                                isUrgent
                                  ? 'text-[#B23A61]'
                                  : status.urgency === 'soon'
                                  ? 'text-[#3B6FA3]'
                                  : 'text-[#4D5E78]'
                              }`}
                            >
                              {isUrgent ? (
                                <AlertCircle
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Clock
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{status.label}</span>
                            </span>
                          </div>

                          <h4 className="font-display text-xl font-semibold text-[#24324A]">
                            {book.title}
                          </h4>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B6B84] tabular-nums">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar
                                className="w-3.5 h-3.5 text-[#7AAAD8]"
                                aria-hidden="true"
                              />
                              Kembali {formatIndonesianDate(loan.dueAt)}
                            </span>
                            <span>
                              Pengingat aktif H-{loan.reminderLeadDays}
                            </span>
                            {loan.completed && (
                              <span className="inline-flex items-center gap-1 font-medium text-[#3B6FA3]">
                                <CheckCircle2
                                  className="w-3.5 h-3.5"
                                  aria-hidden="true"
                                />
                                Selesai dibaca
                              </span>
                            )}
                          </div>

                          {loan.personalNote && (
                            <p className="text-xs italic text-[#5B6B84] pt-0.5 line-clamp-1">
                              Catatan: “{loan.personalNote}”
                            </p>
                          )}

                          {/* Reading Progress Bar */}
                          <div className="pt-1 space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#5B6B84] tabular-nums">
                              <span>Kemajuan membaca</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-[#EDF4FB] overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#7AAAD8] to-[#D97A9B] transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenReader(book)}
                            className="min-h-[40px] px-4 py-2 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                          >
                            <BookOpen className="w-4 h-4" aria-hidden="true" />
                            <span>Baca di Website</span>
                          </button>

                          {!loan.extendedOnce && (
                            <button
                              type="button"
                              onClick={() => onExtendLoan(loan.id)}
                              className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#F0C7D6] bg-[#FDF1F5] hover:bg-[#FAE3EB] text-[#8F3252] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                            >
                              Perpanjang +3 Hari
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onReturnLoan(loan.id)}
                            className="min-h-[40px] px-3.5 py-2 rounded-xl border border-[#DCE8F5] hover:bg-[#F4F8FC] text-[#4D5E78] text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                          >
                            Kembalikan
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right 5 columns: Automated Reminder Feed + Live Tester */}
          <aside
            id="pengingat"
            className="lg:col-span-5 rounded-2xl bg-white border border-[#EBDCE3] p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#24324A]">
                  <BellRing
                    className="w-4 h-4 text-[#C95B7F]"
                    aria-hidden="true"
                  />
                  <span>Pengingat Pengembalian Otomatis</span>
                </div>
                <p className="text-xs text-[#5B6B84] mt-1 tabular-nums">
                  Kalender aktif: {formatIndonesianDate(referenceNow)}
                  {dayOffset > 0 ? ` (+${dayOffset} hari simulasi)` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenOrganizerDrawer}
                className="text-xs font-semibold text-[#4C82B8] hover:underline whitespace-nowrap shrink-0 min-h-[32px]"
              >
                Lihat Semua
              </button>
            </div>

            {/* Quick Browser Permission & Time-Travel Simulation Bar */}
            <div className="rounded-xl bg-[#FDF4F7] border border-[#F2D2DE] p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#3B2430]">
                  Uji notifikasi otomatis:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdvanceDay(1)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-[#EBC7D4] hover:border-[#C95B7F] text-xs font-medium text-[#24324A] inline-flex items-center gap-1"
                  >
                    <FastForward className="w-3 h-3 text-[#C95B7F]" />
                    <span>+1 Hari</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdvanceDay(3)}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg bg-white border border-[#EBC7D4] hover:border-[#C95B7F] text-xs font-medium text-[#24324A] inline-flex items-center gap-1"
                  >
                    <FastForward className="w-3 h-3 text-[#C95B7F]" />
                    <span>+3 Hari</span>
                  </button>
                  {dayOffset > 0 && (
                    <button
                      type="button"
                      onClick={onResetTime}
                      aria-label="Reset simulasi hari"
                      className="min-h-[34px] px-2 py-1 rounded-lg text-xs text-[#5B6B84] hover:text-[#24324A] inline-flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset</span>
                    </button>
                  )}
                </div>
              </div>

              {browserPermission !== 'unsupported' && (
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F2D2DE]">
                  <span className="text-xs text-[#6E4F5E]">
                    Notifikasi sistem peramban:
                  </span>
                  <button
                    type="button"
                    onClick={onRequestBrowserPermission}
                    disabled={browserPermission === 'granted'}
                    className={`min-h-[32px] px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      browserPermission === 'granted'
                        ? 'bg-white text-[#3B6FA3] border border-[#DCE8F5]'
                        : 'bg-[#C95B7F] hover:bg-[#B54B6E] text-white'
                    }`}
                  >
                    {browserPermission === 'granted'
                      ? 'Aktif'
                      : browserPermission === 'denied'
                      ? 'Diblokir'
                      : 'Aktifkan'}
                  </button>
                </div>
              )}
            </div>

            {/* Latest 4 Automated Reminders */}
            {recentNotifications.length === 0 ? (
              <p className="text-sm text-[#5B6B84] py-4 text-center">
                Belum ada pengingat yang muncul. Coba majukan simulasi hari atau pinjam buku baru.
              </p>
            ) : (
              <ul className="divide-y divide-[#F0ECEF]">
                {recentNotifications.map((notif) => (
                  <li key={notif.id} className="py-3.5 first:pt-1 last:pb-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#24324A]">
                          {notif.title}
                          {!notif.read && (
                            <span className="ml-2 text-[#C95B7F] font-semibold">
                              · Baru
                            </span>
                          )}
                        </p>
                        <p className="text-xs sm:text-sm text-[#4D5E78] leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => onMarkRead(notif.id)}
                          className="shrink-0 text-xs font-medium text-[#4C82B8] hover:underline whitespace-nowrap"
                        >
                          Sudah dibaca
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
};
