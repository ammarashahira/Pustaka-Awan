import React, { useState } from 'react';
import { BookOpen, Calendar, BellRing, X, CheckCircle2 } from 'lucide-react';
import { Book, LoanDuration } from '../types/library';
import { addDaysToDate, formatIndonesianDate } from '../utils/dateAndReminder';
import { BookCover } from './BookCover';

interface BorrowModalProps {
  book: Book | null;
  referenceNow: Date;
  activeLoanCount: number;
  maxLoans: number;
  onClose: () => void;
  onConfirmBorrow: (
    book: Book,
    durationDays: LoanDuration,
    reminderLeadDays: 1 | 2 | 3,
    personalNote: string,
  ) => void;
}

const DURATION_OPTIONS: { days: LoanDuration; label: string; hint: string }[] = [
  { days: 3, label: '3 Hari', hint: 'Bacaan kilat akhir pekan' },
  { days: 7, label: '7 Hari', hint: 'Durasi standar paling pas' },
  { days: 14, label: '14 Hari', hint: 'Santai tanpa terburu-buru' },
];

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  referenceNow,
  activeLoanCount,
  maxLoans,
  onClose,
  onConfirmBorrow,
}) => {
  const [durationDays, setDurationDays] = useState<LoanDuration>(7);
  const [reminderLeadDays, setReminderLeadDays] = useState<1 | 2 | 3>(2);
  const [personalNote, setPersonalNote] = useState('');

  if (!book) return null;

  const dueDate = addDaysToDate(referenceNow, durationDays);
  const firstReminderDate = addDaysToDate(
    referenceNow,
    Math.max(1, durationDays - reminderLeadDays),
  );
  const atLimit = activeLoanCount >= maxLoans;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (atLimit) return;
    onConfirmBorrow(book, durationDays, reminderLeadDays, personalNote.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2B3E]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="borrow-modal-title"
    >
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#FFFDFE] border border-[#DCE8F5] shadow-xl overflow-hidden max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAF1F8] bg-gradient-to-r from-[#EEF6FC] to-[#FDF1F5]">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#24324A]">
            <BookOpen className="w-4 h-4 text-[#4C82B8]" aria-hidden="true" />
            <span>Formulir Peminjaman Buku Online</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir peminjaman"
            className="min-w-[40px] min-h-[40px] inline-flex items-center justify-center rounded-xl text-[#4D5E78] hover:text-[#24324A] hover:bg-white/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Book Summary */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-24 shrink-0">
              <BookCover book={book} />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-[#5B6B84]">
                {book.category} · {book.pages} hlm · {book.readingMinutes} menit baca
              </p>
              <h2
                id="borrow-modal-title"
                className="font-display text-2xl font-semibold text-[#24324A]"
              >
                {book.title}
              </h2>
              <p className="text-sm text-[#4D5E78]">Oleh {book.author}</p>
              <p className="text-sm text-[#4D5E78] leading-relaxed pt-1">
                {book.synopsis}
              </p>
            </div>
          </div>

          <hr className="border-[#EEF3F8]" />

          {/* Duration Picker */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-[#24324A]">
              Pilih Lama Peminjaman
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DURATION_OPTIONS.map((opt) => {
                const selected = durationDays === opt.days;
                return (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setDurationDays(opt.days)}
                    className={`text-left p-3.5 rounded-xl border transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] ${
                      selected
                        ? 'bg-[#EAF4FB] border-[#4C82B8] text-[#24324A]'
                        : 'bg-white border-[#DCE8F5] text-[#4D5E78] hover:border-[#9EC3E6]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm tabular-nums">
                        {opt.label}
                      </span>
                      {selected && (
                        <CheckCircle2
                          className="w-4 h-4 text-[#4C82B8]"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="text-xs text-[#5B6B84] mt-1">{opt.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reminder Timing */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-[#24324A]">
              Jadwal Pengingat Otomatis
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([1, 2, 3] as const).map((lead) => {
                const selected = reminderLeadDays === lead;
                return (
                  <button
                    key={lead}
                    type="button"
                    onClick={() => setReminderLeadDays(lead)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-sm transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C95B7F] ${
                      selected
                        ? 'bg-[#FDF0F4] border-[#C95B7F] text-[#24324A] font-medium'
                        : 'bg-white border-[#EBDCE3] text-[#4D5E78] hover:border-[#DF9EB4]'
                    }`}
                  >
                    <span className="tabular-nums">Mulai H-{lead}</span>
                    <span className="block text-xs text-[#5B6B84] mt-0.5">
                      {lead} hari sebelum tenggat
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule Preview */}
          <div className="rounded-xl bg-[#F4F8FC] border border-[#DCE8F5] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-[#4C82B8] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#5B6B84]">Batas Pengembalian</p>
                <p className="font-semibold text-[#24324A] tabular-nums">
                  {formatIndonesianDate(dueDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BellRing className="w-4 h-4 text-[#C95B7F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-[#5B6B84]">Pengingat Pertama Aktif</p>
                <p className="font-semibold text-[#24324A] tabular-nums">
                  {formatIndonesianDate(firstReminderDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Optional Goal */}
          <div className="space-y-1.5">
            <label
              htmlFor="borrow-note"
              className="block text-sm font-medium text-[#24324A]"
            >
              Catatan Target Bacaan (opsional)
            </label>
            <input
              id="borrow-note"
              type="text"
              maxLength={90}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Contoh: Baca 1 bab setiap malam sebelum tidur"
              className="w-full rounded-xl border border-[#DCE8F5] bg-white px-4 py-2.5 text-sm text-[#24324A] placeholder:text-[#8A99B0] focus:outline-none focus:border-[#4C82B8] focus:ring-2 focus:ring-[#4C82B8]/20"
            />
          </div>

          {atLimit && (
            <p
              role="alert"
              className="text-sm text-[#A63A5B] bg-[#FDF0F4] border border-[#F2C7D6] rounded-xl px-4 py-3"
            >
              Rak pinjamanmu sudah mencapai batas maksimal {maxLoans} buku. Kembalikan salah satu buku terlebih dahulu untuk meminjam judul baru.
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#DCE8F5] text-sm font-medium text-[#4D5E78] hover:bg-[#F4F8FC] transition-colors whitespace-nowrap"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={atLimit}
              className="min-h-[44px] px-6 py-2.5 rounded-xl bg-[#4C82B8] hover:bg-[#3B6FA3] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Konfirmasi Pinjam & Aktifkan Pengingat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
