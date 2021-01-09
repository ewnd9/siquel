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
  question:
    | {
        type: 'text';
        text: string;
      }
    | {
        type: 'image' | 'voice';
        fileId: string;
      };
  answer: string;
}

export interface ParseSiqResult {
  id: string;
  name: string;
  rounds: Round[];
  themes: Record<string, Theme>;
  questions: Record<string, Question>;
}

interface SELECT_QUESTION_VIEW_TYPE {
  type: 'SELECT_QUESTION_VIEW';
  round: RoundFull;
}

interface SHOW_QUESTION_VIEW_TYPE {
  type: 'SHOW_QUESTION_VIEW';
  question: Question;
}

interface SHOW_QUESTION_ANSWERING_VIEW_TYPE {
  type: 'SHOW_QUESTION_ANSWERING_VIEW';
  question: Question;
  playerId: string;
}

interface SHOW_ANSWER_VIEW_TYPE {
  type: 'SHOW_ANSWER_VIEW';
  question: Question;
  answer: string;
}

export interface State {
  roomId: string;
  game: ParseSiqResult;
  roundId?: number;
  ownerId: string;
  answered: Record<string, boolean>;

  answers: Record<string, boolean>;
  answeringId?: string;
  questionId?: string;

  players: Record<
    string,
    {
      username: string;
      score: number;
    }
  >;

  metaView?: MetaView;
  playerView?: PlayerView;
}

export interface MetaView {
  players: Record<string, number>;
  roomId: string;
}

export type PlayerView =
  | SELECT_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_ANSWERING_VIEW_TYPE
  | SHOW_ANSWER_VIEW_TYPE;
