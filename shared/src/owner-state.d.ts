import { RoundFull, Question } from './models';
import { CommonState } from './common-state';

export interface OWNER_SELECT_QUESTION_VIEW_TYPE {
  type: 'OWNER_SELECT_QUESTION_VIEW';
  round: RoundFull;
}

export interface OWNER_SHOW_QUESTION_VIEW_TYPE {
  type: 'OWNER_SHOW_QUESTION_VIEW';
  question: Question;
  answer: string;
}

export interface OWNER_SHOW_QUESTION_ANSWERING_VIEW_TYPE {
  type: 'OWNER_SHOW_QUESTION_ANSWERING_VIEW';
  question: Question;
  playerId: string;
  answer: string;
}

export interface OWNER_SHOW_ANSWER_VIEW_TYPE {
  type: 'OWNER_SHOW_ANSWER_VIEW';
  question: Question;
  answer: string;
}

export type OwnerView =
  | CommonState
  | OWNER_SELECT_QUESTION_VIEW_TYPE
  | OWNER_SHOW_QUESTION_VIEW_TYPE
  | OWNER_SHOW_QUESTION_ANSWERING_VIEW_TYPE
  | OWNER_SHOW_ANSWER_VIEW_TYPE;
