import { State } from 'shared';
import omit from 'lodash/omit';

export interface OnSelectQuestionAction {
  type: 'SELECT_QUESTION';
  id: string;
}

export function onSelectQuestion(state: State, action: OnSelectQuestionAction): State {
  const questionId = action.id;
  const answer = state.game.questions[questionId].answer;
  const question = omit(state.game.questions[questionId], 'answer');

  return {
    ...state,
    questionId,
    answers: {},
    playerView: {
      type: 'SHOW_QUESTION_VIEW',
      question,
    },
    ownerView: {
      type: 'OWNER_SHOW_QUESTION_VIEW',
      question,
      answer,
    },
  };
}
