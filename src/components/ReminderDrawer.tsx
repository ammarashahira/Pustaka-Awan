import React from 'react';
import {
  Bell,
  BellRing,
  CheckCheck,
  Clock,
  FastForward,
  RotateCcw,
  Volume2,
  X,
  BookOpen,
  CalendarClock,
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

interface ReminderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loans: LoanRecord[];
  books: Book[];
  notifications: ReminderNotification[];
  preferences: ReminderPreferences;
  referenceNow: Date;
  dayOffset: number;
  browserPermission: NotificationPermission | 'unsupported';
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onExtendLoan: (loanId: string) => void;
  onReturnLoan: (loanId: string) => void;
  onOpenReader: (book: Book) => void;
  onAdvanceDay: (delta: number) => void;
  onResetTime: () => void;
  onUpdatePreferences: (patch: Partial<ReminderPreferences>) => void;
  onRequestBrowserPermission: () => void;
}

export const ReminderDrawer: React.FC<ReminderDrawerProps> = ({
  isOpen,
  onClose,
  loans,
  books,
  notifications,
  preferences,
  referenceNow,
  dayOffset,
  browserPermission,
  onMarkRead,
  onMarkAllRead,
  onExtendLoan,
  onReturnLoan,
  onOpenReader,
  onAdvanceDay,
  onResetTime,
  onUpdatePreferences,
  onRequestBrowserPermission,
}) => {
  if (!isOpen) return null;

  const sortedLoans = [...loans].sort(
    (a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime(),
  );
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1E2B3E]/35 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="w-full max-w-lg bg-[#FFFDFE] h-full border-l border-[#DCE8F5] shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#EAF1F8] bg-gradient-to-r from-[#EEF6FC] to-[#FDF1F5] flex items-center justify-between gap-4">
          <div>
            <h2
              id="drawer-title"
              className="font-display text-xl font-semibold text-[#24324A]"
            >
              Pengingat & Jadwal Kembali
            </h2>
            <p className="text-xs text-[#5B6B84] tabular-nums mt-0.5">
              Tanggal aktif: {formatIndonesianDate(referenceNow)}
              {dayOffset > 0 ? ` (Simulasi +${dayOffset} hari)` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel pengingat"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl text-[#4D5E78] hover:text-[#24324A] hover:bg-white/75 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* Browser Notification & Simulation Controls */}
          <section className="rounded-2xl bg-[#F4F8FC] border border-[#DCE8F5] p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#24324A]">
                <BellRing className="w-4 h-4 text-[#C95B7F]" aria-hidden="true" />
                <span>Otomasi Pengingat</span>
              </div>
              {browserPermission !== 'unsupported' && (
                <button
                  type="button"
                  onClick={onRequestBrowserPermission}
                  disabled={browserPermission === 'granted'}
                  className={`min-h-[36px] px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                    browserPermission === 'granted'
                      ? 'bg-[#E2F0FA] text-[#2F5D8A]'
                      : 'bg-[#4C82B8] hover:bg-[#3B6FA3] text-white'
                  }`}
                >
                  {browserPermission === 'granted'
                    ? 'Notifikasi Browser Aktif'
                    : browserPermission === 'denied'
                    ? 'Izin Ditolak Browser'
                    : 'Aktifkan Notifikasi Browser'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-[#4D5E78]">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoRemindH2}
                  onChange={(e) =>
                    onUpdatePreferences({ autoRemindH2: e.target.checked })
                  }
                  className="rounded border-[#9EC3E6] text-[#4C82B8]"
                />
                <span>Pengingat H-2</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoRemindH1}
                  onChange={(e) =>
                    onUpdatePreferences({ autoRemindH1: e.target.checked })
                  }
                  className="rounded border-[#9EC3E6] text-[#4C82B8]"
                />
                <span>Pengingat H-1</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.autoRemindDueDay}
                  onChange={(e) =>
                    onUpdatePreferences({ autoRemindDueDay: e.target.checked })
                  }
                  className="rounded border-[#9EC3E6] text-[#4C82B8]"
                />
                <span>Hari-H</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.gentleChime}
                  onChange={(e) =>
                    onUpdatePreferences({ gentleChime: e.target.checked })
                  }
                  className="rounded border-[#E293AE] text-[#C95B7F]"
                />
                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Lonceng Lembut</span>
              </label>
            </div>

            {/* Simulator Bar */}
            <div className="pt-2 border-t border-[#DCE8F5] flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-[#5B6B84]">
                Uji pemicu otomatis:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onAdvanceDay(1)}
                  className="min-h-[34px] px-3 py-1 rounded-lg bg-white border border-[#DCE8F5] hover:border-[#4C82B8] text-xs font-medium text-[#24324A] inline-flex items-center gap-1.5"
                >
                  <FastForward className="w-3.5 h-3.5 text-[#4C82B8]" />
                  <span>+1 Hari</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAdvanceDay(3)}
                  className="min-h-[34px] px-3 py-1 rounded-lg bg-white border border-[#DCE8F5] hover:border-[#C95B7F] text-xs font-medium text-[#24324A] inline-flex items-center gap-1.5"
                >
                  <FastForward className="w-3.5 h-3.5 text-[#C95B7F]" />
                  <span>+3 Hari</span>
                </button>
                {dayOffset > 0 && (
                  <button
                    type="button"
                    onClick={onResetTime}
                    className="min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-medium text-[#5B6B84] hover:text-[#24324A] inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Notification Inbox */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-[#24324A]">
                Kotak Notifikasi ({unreadCount} baru)
              </h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllRead}
                  className="text-xs font-medium text-[#4C82B8] hover:underline inline-flex items-center gap-1 min-h-[32px]"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Tandai semua dibaca</span>
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="rounded-xl border border-[#DCE8F5] bg-white p-5 text-center text-sm text-[#5B6B84]">
                Belum ada notifikasi pengingat. Pinjam buku dari katalog untuk melihat jadwal pengingat otomatis.
              </div>
            ) : (
              <ul className="space-y-2.5">
                {notifications.map((item) => {
                  const isUrgent =
                    item.type === 'overdue' ||
                    item.type === 'due_today' ||
                    item.type === 'h1';
                  const matchingLoan = loans.find((l) => l.id === item.loanId);
                  const matchingBook = books.find((b) => b.id === item.bookId);

                  return (
                    <li
                      key={item.id}
                      className={`rounded-xl border p-4 transition-colors ${
                        item.read
                          ? 'bg-white border-[#E7EEF5] opacity-80'
                          : isUrgent
                          ? 'bg-[#FDF1F5] border-[#F0C7D6]'
                          : 'bg-[#EFF6FC] border-[#CDE1F4]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#24324A]">
                            <Bell
                              className={`w-3.5 h-3.5 ${
                                isUrgent ? 'text-[#C95B7F]' : 'text-[#4C82B8]'
                              }`}
                              aria-hidden="true"
                            />
                            <span>{item.title}</span>
                          </div>
                          <p className="text-sm text-[#394A65] leading-relaxed">
                            {item.message}
                          </p>
                          <p className="text-[11px] text-[#6B7B93] tabular-nums">
                            {formatIndonesianDate(item.createdAt)}
                          </p>
                        </div>
                        {!item.read && (
                          <button
                            type="button"
                            onClick={() => onMarkRead(item.id)}
                            className="shrink-0 text-xs font-medium text-[#4C82B8] hover:underline py-1"
                          >
                            Tandai dibaca
                          </button>
                        )}
                      </div>

                      {matchingLoan && matchingBook && (
                        <div className="mt-3 pt-2.5 border-t border-black/5 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onOpenReader(matchingBook);
                            }}
                            className="min-h-[34px] px-3 py-1 rounded-lg bg-white border border-[#DCE8F5] text-xs font-medium text-[#24324A] hover:border-[#4C82B8] inline-flex items-center gap-1.5"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-[#4C82B8]" />
                            <span>Baca</span>
                          </button>
                          {!matchingLoan.extendedOnce && (
                            <button
                              type="button"
                              onClick={() => onExtendLoan(matchingLoan.id)}
                              className="min-h-[34px] px-3 py-1 rounded-lg bg-white border border-[#F0C7D6] text-xs font-medium text-[#9B3B5B] hover:bg-[#FDF0F4]"
                            >
                              Perpanjang +3 Hari
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onReturnLoan(matchingLoan.id)}
                            className="min-h-[34px] px-3 py-1 rounded-lg bg-[#4C82B8] text-white text-xs font-medium hover:bg-[#3B6FA3]"
                          >
                            Kembalikan
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Compact Due Timeline */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarClock
                className="w-4 h-4 text-[#4C82B8]"
                aria-hidden="true"
              />
              <h3 className="font-display text-lg font-semibold text-[#24324A]">
                Urutan Tenggat Buku ({sortedLoans.length})
              </h3>
            </div>
            {sortedLoans.length === 0 ? (
              <p className="text-sm text-[#5B6B84]">
                Tidak ada buku yang sedang dipinjam saat ini.
              </p>
            ) : (
              <div className="divide-y divide-[#EAF1F8] rounded-xl border border-[#DCE8F5] bg-white">
                {sortedLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.bookId);
                  if (!book) return null;
                  const status = getDueStatusInfo(loan.dueAt, referenceNow);
                  return (
                    <div
                      key={loan.id}
                      className="p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#24324A] truncate">
                          {book.title}
                        </p>
                        <p className="text-xs text-[#5B6B84] tabular-nums">
                          Kembali {formatIndonesianDate(loan.dueAt)}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${
                          status.urgency === 'overdue' ||
                          status.urgency === 'urgent'
                            ? 'text-[#B23A61]'
                            : status.urgency === 'soon'
                            ? 'text-[#3B6FA3]'
                            : 'text-[#4D5E78]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{status.label}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
