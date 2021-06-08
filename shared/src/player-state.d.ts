import { RoundFull, QuestionWithoutAnswer } from './models';
import { CommonState } from './common-state';

export interface SELECT_QUESTION_VIEW_TYPE {
  type: 'SELECT_QUESTION_VIEW';
  round: RoundFull;
}

export interface SHOW_QUESTION_VIEW_TYPE {
  type: 'SHOW_QUESTION_VIEW';
  question: QuestionWithoutAnswer;
}

export interface SHOW_QUESTION_ANSWERING_VIEW_TYPE {
  type: 'SHOW_QUESTION_ANSWERING_VIEW';
  question: QuestionWithoutAnswer;
  playerId: string;
}

export interface SHOW_ANSWER_VIEW_TYPE {
  type: 'SHOW_ANSWER_VIEW';
  question: QuestionWithoutAnswer;
  answer: string;
}

export type PlayerView =
  | CommonState
  | SELECT_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_VIEW_TYPE
  | SHOW_QUESTION_ANSWERING_VIEW_TYPE
  | SHOW_ANSWER_VIEW_TYPE;
