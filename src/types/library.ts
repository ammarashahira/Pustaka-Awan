export type BookCategory =
  | 'Dongeng & Fantasi'
  | 'Fiksi Hangat'
  | 'Sains & Alam'
  | 'Puisi & Esai';

export type CoverMotif =
  | 'lantern'
  | 'teacup'
  | 'astrolabe'
  | 'waves'
  | 'botanical'
  | 'ribbon'
  | 'moon'
  | 'origami';

export interface BookChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  pullQuote?: string;
  paragraphs: string[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  category: BookCategory;
  pages: number;
  readingMinutes: number;
  totalCopies: number;
  coverImage?: string;
  coverMotif: CoverMotif;
  accentTone: 'blue' | 'pink';
  synopsis: string;
  chapters: BookChapter[];
}

export type LoanDuration = 3 | 7 | 14;

export interface LoanRecord {
  id: string;
  bookId: string;
  borrowedAt: string;
  dueAt: string;
  durationDays: LoanDuration;
  reminderLeadDays: 1 | 2 | 3;
  extendedOnce: boolean;
  currentChapterIndex: number;
  bookmarkedChapterIndex: number | null;
  personalNote: string;
  completed: boolean;
}

export type ReminderType =
  | 'h2'
  | 'h1'
  | 'due_today'
  | 'overdue'
  | 'borrowed'
  | 'returned'
  | 'extended';

export interface ReminderNotification {
  id: string;
  loanId: string;
  bookId: string;
  bookTitle: string;
  type: ReminderType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  triggerDateKey: string;
}

export interface ReminderPreferences {
  autoRemindH2: boolean;
  autoRemindH1: boolean;
  autoRemindDueDay: boolean;
  browserNotifications: boolean;
  gentleChime: boolean;
}

export type ReaderTheme = 'cloud' | 'sky' | 'petal' | 'night';
export type ReaderFontSize = 'sm' | 'md' | 'lg';
