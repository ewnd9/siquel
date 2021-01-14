import { RoundFull, Question } from './models';
import { CommonState } from './common-state';

export interface SELECT_QUESTION_VIEW_TYPE {
  type: 'SELECT_QUESTION_VIEW';
  round: RoundFull;
}

export interface SHOW_QUESTION_VIEW_TYPE {
  type: 'SHOW_QUESTION_VIEW';
  question: Question;
}

export interface SHOW_QUESTION_ANSWERING_VIEW_TYPE {
  type: 'SHOW_QUESTION_ANSWERING_VIEW';
  question: Question;
  playerId: string;
}

export interface SHOW_ANSWER_VIEW_TYPE {
  type: 'SHOW_ANSWER_VIEW';
  question: Question;
  answer: string;
}

export type PlayerView =
  | CommonState
  | SELECT_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_ANSWERING_VIEW_TYPE
  | SHOW_ANSWER_VIEW_TYPE;
