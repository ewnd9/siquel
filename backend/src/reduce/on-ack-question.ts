import { State } from 'shared';
import omit from 'lodash/omit';

export interface OnAckQuestionAction {
  type: 'ACK_QUESTION';
  ack: boolean;
}

export function onAckQuestion(
  state: State,
  action: OnAckQuestionAction
): State {
  const { questionId } = state;
  const answer = state.game.questions[questionId].answer;
  const question = omit(state.game.questions[questionId], 'answer');

  if (action.ack) {
    const players = {
      ...state.players,
      [state.answeringId]: {
        ...state.players[state.answeringId],
        score: state.players[state.answeringId].score + Number(question.price),
      },
    };
    const answered = {
      ...state.answered,
      [state.questionId]: true,
    };

    const nextState = {
      ...state,
      answeringId: undefined,
      answers: {},
      players,
      answered,
    };

    return {
      ...nextState,
      playerView: {
        type: 'SHOW_ANSWER_VIEW',
        question,
        answer,
      },
      ownerView: {
        type: 'OWNER_SHOW_ANSWER_VIEW',
        question,
        answer,
      },
      metaView: {
        ...nextState.metaView,
        players,
      },
    };
  } else {
    return {
      ...state,
      answeringId: undefined,
      answers: {
        [state.answeringId]: true,
      },
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
}
