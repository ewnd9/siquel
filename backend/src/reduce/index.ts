import type { State } from 'shared';

import { onCreateGame, OnCreateGameAction } from './on-create-game';
import { onJoinGame, OnJoinGameAction } from './on-join-game';
import { onSelectQuestion, OnSelectQuestionAction } from './on-select-question';
import { onAnswerQuestion, OnAnswerQuestionAction } from './on-answer-question';
import { onAckQuestion, OnAckQuestionAction } from './on-ack-question';
import { onSkipQuestion, OnSkipQuestionAction } from './on-skip-question';
import { onNextQuestion, OnNextQuestionAction } from './on-next-question';

export function reduce(
  state: State,
  action:
    | OnCreateGameAction
    | OnJoinGameAction
    | OnSelectQuestionAction
    | OnAnswerQuestionAction
    | OnAckQuestionAction
    | OnSkipQuestionAction
    | OnNextQuestionAction
): State {
  switch (action.type) {
    case 'CREATE_GAME':
      return onCreateGame(state, action);
    case 'JOIN_GAME':
      return onJoinGame(state, action);
    case 'SELECT_QUESTION':
      return onSelectQuestion(state, action);
    case 'ANSWER_QUESTION':
      return onAnswerQuestion(state, action);
    case 'ACK_QUESTION':
      return onAckQuestion(state, action);
    case 'SKIP_QUESTION':
      return onSkipQuestion(state, action);
    case 'NEXT_QUESTION':
      return onNextQuestion(state, action);
    default:
      // @ts-expect-error
      throw new Error(`unknown type ${action.type}`);
  }
}
