import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  unreadCount: number;
  activeLoanCount: number;
  onOpenOrganizer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unreadCount,
  onOpenOrganizer,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAFBFD]/90 backdrop-blur-md border-b border-[#E3EDF7]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#beranda"
          className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[#24324A] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-md"
        >
          Pustaka Awan
        </a>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4D5E78]"
        >
          <a
            href="#katalog"
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#E293AE] hover:text-[#24324A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-sm"
          >
            Katalog
          </a>
          <a
            href="#rak-pinjaman"
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#8AB8E6] hover:text-[#24324A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-sm"
          >
            Rak Pinjaman
          </a>
          <a
            href="#pengingat"
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#E293AE] hover:text-[#24324A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-sm"
          >
            Pengingat
          </a>
          <a
            href="#cara-kerja"
            className="whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-[#8AB8E6] hover:text-[#24324A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C82B8] rounded-sm"
          >
            Cara Kerja
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenOrganizer}
            className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-xl bg-[#C95B7F] hover:bg-[#B54B6E] text-white text-sm font-medium transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C95B7F]"
          >
            <Bell className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>
              Pengingat
              {unreadCount > 0 ? (
                <span className="tabular-nums ml-1">({unreadCount})</span>
              ) : null}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
