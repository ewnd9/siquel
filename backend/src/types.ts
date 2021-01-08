export interface Round {
  id: string;
  name: string;
  themes: string[];
}

export type RoundFull = Omit<Round, 'themes'> & {
  themes: ThemeFull[];
};

export interface Theme {
  id: string;
  name: string;
  comments?: string;
  questions: string[];
}

export type ThemeFull = Omit<Theme, 'questions'> & {
  id: string;
  name: string;
  comments?: string;
  questions: Question[];
};

export interface Question {
  id: string;
  price: string;
  question: string;
  answer: string;
}

export interface ParseSiqResult {
  id: string;
  name: string;
  rounds: Round[];
  themes: Record<string, Theme>;
  questions: Record<string, Question>;
}
