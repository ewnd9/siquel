import { State } from 'shared';
import omit from 'lodash/omit';

import { mapRound } from './map-round';

export interface OnSkipQuestionAction {
  type: 'SKIP_QUESTION';
}

export function onSkipQuestion(
  state: State,
  _action: OnSkipQuestionAction
): State {
  const { questionId } = state;
  const answer = state.game.questions[questionId].answer;
  const question = omit(state.game.questions[questionId], 'answer');
  const round = mapRound({ state, roundId: state.roundId });

  const answered = {
    ...state.answered,
    [state.questionId]: true,
  };

  const nextState = {
    ...state,
    answeringId: undefined,
    answers: {},
    answered,
  };

  return {
    ...nextState,
    playerView: {
      type: 'SHOW_ANSWER_VIEW',
      round,
      question,
      answer,
    },
    ownerView: {
      type: 'OWNER_SHOW_ANSWER_VIEW',
      question,
      answer,
    },
  };
}
