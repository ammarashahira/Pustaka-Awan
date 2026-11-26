import {
  Book,
  LoanRecord,
  ReminderNotification,
  ReminderPreferences,
} from '../types/library';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function getVirtualNow(dayOffset: number): Date {
  const now = new Date();
  return new Date(now.getTime() + dayOffset * MS_PER_DAY);
}

export function addDaysToDate(base: Date, days: number): Date {
  return new Date(base.getTime() + days * MS_PER_DAY);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysRemaining(dueAtIso: string, referenceNow: Date): number {
  const dueDay = startOfDay(new Date(dueAtIso));
  const currentDay = startOfDay(referenceNow);
  return Math.round((dueDay.getTime() - currentDay.getTime()) / MS_PER_DAY);
}

export function formatIndonesianDate(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatShortDayMonth(isoOrDate: string | Date): string {
  const date = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
}

export function getDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface DueStatusInfo {
  label: string;
  urgency: 'calm' | 'soon' | 'urgent' | 'overdue';
  daysLeft: number;
}

export function getDueStatusInfo(dueAtIso: string, referenceNow: Date): DueStatusInfo {
  const daysLeft = getDaysRemaining(dueAtIso, referenceNow);
  if (daysLeft < 0) {
    const lateDays = Math.abs(daysLeft);
    return {
      label: `Terlambat ${lateDays} hari`,
      urgency: 'overdue',
      daysLeft,
    };
  }
  if (daysLeft === 0) {
    return {
      label: 'Jatuh tempo hari ini',
      urgency: 'urgent',
      daysLeft,
    };
  }
  if (daysLeft === 1) {
    return {
      label: 'Sisa 1 hari lagi',
      urgency: 'urgent',
      daysLeft,
    };
  }
  if (daysLeft <= 2) {
    return {
      label: `Sisa ${daysLeft} hari lagi`,
      urgency: 'soon',
      daysLeft,
    };
  }
  return {
    label: `Sisa ${daysLeft} hari`,
    urgency: 'calm',
    daysLeft,
  };
}

export function playGentleBellChime(): void {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.08, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // Soft pastel music-box two-note chime (C6 -> E6)
    playNote(1046.5, now, 0.45);
    playNote(1318.5, now + 0.14, 0.55);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 900);
  } catch {
    // Ignore audio context restrictions if user has not interacted yet
  }
}

export function evaluateLoanReminders(
  loans: LoanRecord[],
  books: Book[],
  existingNotifications: ReminderNotification[],
  preferences: ReminderPreferences,
  referenceNow: Date,
): ReminderNotification[] {
  const dateKey = getDateKey(referenceNow);
  const generated: ReminderNotification[] = [];

  for (const loan of loans) {
    const book = books.find((b) => b.id === loan.bookId);
    if (!book) continue;

    const daysLeft = getDaysRemaining(loan.dueAt, referenceNow);
    const dueFormatted = formatIndonesianDate(loan.dueAt);

    let candidate: Omit<ReminderNotification, 'id' | 'createdAt' | 'read'> | null =
      null;

    if (daysLeft < 0) {
      const lateCount = Math.abs(daysLeft);
      candidate = {
        loanId: loan.id,
        bookId: book.id,
        bookTitle: book.title,
        type: 'overdue',
        triggerDateKey: `${loan.id}-overdue-${dateKey}`,
        title: `Tenggat Terlewat (${lateCount} hari)`,
        message: `"${book.title}" seharusnya kembali pada ${dueFormatted}. Kembalikan sekarang atau perpanjang pinjaman agar rakmu tetap rapi.`,
      };
    } else if (daysLeft === 0 && preferences.autoRemindDueDay) {
      candidate = {
        loanId: loan.id,
        bookId: book.id,
        bookTitle: book.title,
        type: 'due_today',
        triggerDateKey: `${loan.id}-h0-${dateKey}`,
        title: 'Hari Pengembalian Tiba',
        message: `Hari ini (${dueFormatted}) batas akhir peminjaman "${book.title}". Jangan lupa selesaikan bab terakhirmu!`,
      };
    } else if (daysLeft === 1 && preferences.autoRemindH1) {
      candidate = {
        loanId: loan.id,
        bookId: book.id,
        bookTitle: book.title,
        type: 'h1',
        triggerDateKey: `${loan.id}-h1-${dateKey}`,
        title: 'Pengingat Besok Kembali (H-1)',
        message: `"${book.title}" jatuh tempo besok (${dueFormatted}). Kamu bisa lanjut membaca atau perpanjang 3 hari.`,
      };
    } else if (
      daysLeft >= 2 &&
      daysLeft <= loan.reminderLeadDays &&
      preferences.autoRemindH2
    ) {
      candidate = {
        loanId: loan.id,
        bookId: book.id,
        bookTitle: book.title,
        type: 'h2',
        triggerDateKey: `${loan.id}-h2-${dateKey}`,
        title: `Pengingat Terjadwal (H-${daysLeft})`,
        message: `Masih ada ${daysLeft} hari sebelum "${book.title}" kembali pada ${dueFormatted}. Jadwal bacaanmu tetap aman.`,
      };
    }

    if (
      candidate &&
      !existingNotifications.some(
        (n) => n.triggerDateKey === candidate!.triggerDateKey,
      )
    ) {
      generated.push({
        ...candidate,
        id: `notif-${candidate.triggerDateKey}-${Math.random().toString(36).slice(2, 6)}`,
        createdAt: referenceNow.toISOString(),
        read: false,
      });
    }
  }

  return generated;
}
