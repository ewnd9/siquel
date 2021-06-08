import { State } from 'shared';

import { mapRound } from './map-round';

export interface OnNextQuestionAction {
  type: 'NEXT_QUESTION';
}

export function onNextQuestion(state: State, _action: OnNextQuestionAction): State {
  const isRoundEnded = state.game.rounds[state.roundId].themes.every(
    (themeId) =>
      state.game.themes[themeId].questions.every(
        (questionId) => state.answered[questionId]
      )
  );

  if (isRoundEnded) {
    const isGameEnded = !state.game.rounds[state.roundId + 1];

    if (isGameEnded) {
      return {
        ...state,
        playerView: {
          type: 'END_GAME',
        },
        ownerView: {
          type: 'END_GAME',
        },
      };
    } else {
      const roundId = state.roundId + 1;
      const round = mapRound({ state, roundId });

      return {
        ...state,
        roundId,
        playerView: {
          type: 'SELECT_QUESTION_VIEW',
          round,
        },
        ownerView: {
          type: 'OWNER_SELECT_QUESTION_VIEW',
          round,
        },
      };
    }
  } else {
    const round = mapRound({ state, roundId: state.roundId });

    return {
      ...state,
      playerView: {
        type: 'SELECT_QUESTION_VIEW',
        round,
      },
      ownerView: {
        type: 'OWNER_SELECT_QUESTION_VIEW',
        round,
      },
    };
  }
}
