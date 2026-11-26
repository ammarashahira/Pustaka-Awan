import React, { useState } from 'react';
import { Book } from '../types/library';

interface BookCoverProps {
  book: Book;
  className?: string;
}

const IllustratedFallback: React.FC<{ book: Book }> = ({ book }) => {
  const isBlue = book.accentTone === 'blue';
  const bgGradient = isBlue
    ? 'from-[#E4F1FB] via-[#F2F7FD] to-[#FBEAF1]'
    : 'from-[#FCEBF1] via-[#FDF4F7] to-[#E6F2FC]';
  const strokeColor = isBlue ? '#4C82B8' : '#C95B7F';
  const secondaryStroke = isBlue ? '#E497B2' : '#7AAAD8';
  const fillSoft = isBlue ? '#D2E7F8' : '#FADBE6';

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-br ${bgGradient} flex flex-col justify-between p-4 select-none overflow-hidden`}
    >
      {/* Subtle archival border frame */}
      <div
        className="absolute inset-2.5 rounded-xl border border-dashed opacity-55 pointer-events-none"
        style={{ borderColor: strokeColor }}
      />

      {/* Top celestial/botanical corner motif */}
      <div className="relative z-10 flex items-center justify-between text-[10px] tracking-[0.16em] uppercase font-medium opacity-75">
        <span style={{ color: strokeColor }}>{book.year}</span>
        <span style={{ color: strokeColor }}>Pustaka Awan</span>
      </div>

      {/* Central bespoke whimsical vector illustration */}
      <div className="relative z-10 flex items-center justify-center my-auto">
        {book.coverMotif === 'botanical' && (
          <svg
            viewBox="0 0 120 140"
            className="w-28 h-32"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="60" cy="70" r="42" fill={fillSoft} opacity="0.65" />
            <path
              d="M60 112 C60 80, 60 55, 60 30"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M60 88 C42 84, 34 70, 42 58 C52 60, 58 74, 60 88 Z"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="1.6"
            />
            <path
              d="M60 72 C78 68, 86 54, 78 42 C68 44, 62 58, 60 72 Z"
              fill="#FFFFFF"
              stroke={secondaryStroke}
              strokeWidth="1.6"
            />
            <circle cx="60" cy="30" r="9" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.6" />
            <circle cx="52" cy="34" r="6" fill={fillSoft} stroke={secondaryStroke} strokeWidth="1.4" />
            <circle cx="68" cy="34" r="6" fill={fillSoft} stroke={secondaryStroke} strokeWidth="1.4" />
            <path d="M44 96 Q60 104 76 96" stroke={secondaryStroke} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}

        {book.coverMotif === 'ribbon' && (
          <svg
            viewBox="0 0 120 140"
            className="w-28 h-32"
            fill="none"
            aria-hidden="true"
          >
            <rect x="26" y="42" width="68" height="58" rx="10" fill="#FFFFFF" stroke={strokeColor} strokeWidth="1.8" />
            <path d="M26 66 H94" stroke={secondaryStroke} strokeWidth="4" />
            <path d="M60 42 V100" stroke={secondaryStroke} strokeWidth="4" />
            <path
              d="M60 42 C46 28, 34 38, 44 46 C50 50, 56 45, 60 42 Z"
              fill={fillSoft}
              stroke={strokeColor}
              strokeWidth="1.6"
            />
            <path
              d="M60 42 C74 28, 86 38, 76 46 C70 50, 64 45, 60 42 Z"
              fill={fillSoft}
              stroke={strokeColor}
              strokeWidth="1.6"
            />
            <circle cx="34" cy="24" r="2.5" fill={strokeColor} opacity="0.6" />
            <circle cx="88" cy="26" r="2" fill={secondaryStroke} opacity="0.8" />
          </svg>
        )}

        {book.coverMotif === 'moon' && (
          <svg
            viewBox="0 0 120 140"
            className="w-28 h-32"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="60" cy="68" r="40" fill={fillSoft} opacity="0.55" />
            <path
              d="M68 34 A28 28 0 1 0 92 78 A22 22 0 1 1 68 34 Z"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="1.8"
            />
            <path
              d="M36 96 Q50 86 64 96 T92 96"
              stroke={secondaryStroke}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path d="M76 46 L78 52 L84 54 L78 56 L76 62 L74 56 L68 54 L74 52 Z" fill={secondaryStroke} />
            <circle cx="38" cy="44" r="2.5" fill={strokeColor} opacity="0.6" />
          </svg>
        )}

        {(book.coverMotif === 'origami' ||
          book.coverMotif === 'lantern' ||
          book.coverMotif === 'teacup' ||
          book.coverMotif === 'astrolabe' ||
          book.coverMotif === 'waves') && (
          <svg
            viewBox="0 0 120 140"
            className="w-28 h-32"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="60" cy="68" r="40" fill={fillSoft} opacity="0.6" />
            <polygon
              points="60,26 92,68 60,104 28,68"
              fill="#FFFFFF"
              stroke={strokeColor}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <polyline
              points="28,68 60,56 92,68"
              stroke={secondaryStroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <line x1="60" y1="26" x2="60" y2="104" stroke={strokeColor} strokeWidth="1.4" strokeDasharray="3 3" />
          </svg>
        )}
      </div>

      {/* Bottom book title placard on SVG cover */}
      <div className="relative z-10 bg-white/85 backdrop-blur-xs rounded-lg px-3 py-2 text-center border border-white">
        <p className="font-display text-xs font-semibold leading-snug text-[#24324A] line-clamp-2">
          {book.title}
        </p>
        <p className="text-[10px] text-[#5B6B84] mt-0.5 truncate">{book.author}</p>
      </div>
    </div>
  );
};

export const BookCover: React.FC<BookCoverProps> = ({ book, className = '' }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#DCE8F5] bg-[#F2F7FC] ${className}`}
    >
      {/* Subtle left book-spine highlight */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/10 to-transparent z-20"
        aria-hidden="true"
      />

      {book.coverImage && !imageError ? (
        <img
          src={book.coverImage}
          alt={`Sampul buku ${book.title} karya ${book.author}`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      ) : (
        <IllustratedFallback book={book} />
      )}
    </div>
  );
};
