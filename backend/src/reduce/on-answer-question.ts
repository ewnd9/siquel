import { State } from 'shared';
import omit from 'lodash/omit';

import { mapRound } from './map-round';

export interface OnAnswerQuestionAction {
  type: 'ANSWER_QUESTION';
  playerId: string;
}

export function onAnswerQuestion(state: State, action: OnAnswerQuestionAction): State {
  const { questionId } = state;
  const answer = state.game.questions[questionId].answer;
  const question = omit(state.game.questions[questionId], 'answer');
  const round = mapRound({ state, roundId: state.roundId });

  return {
    ...state,
    answeringId: action.playerId,
    answers: {
      [action.playerId]: true,
    },
    playerView: {
      type: 'SHOW_QUESTION_ANSWERING_VIEW',
      round,
      question,
      playerId: action.playerId,
    },
    ownerView: {
      type: 'OWNER_SHOW_QUESTION_ANSWERING_VIEW',
      question,
      playerId: action.playerId,
      answer,
    },
  };
}
