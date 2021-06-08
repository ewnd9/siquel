import omit from 'lodash/omit';
import { State } from 'shared';

export function reduce(state: State, action): State {
  if (action.type === 'CREATE_GAME') {
    const roundId = 0;
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
      metaView: {
        players: state.players,
        roomId: state.roomId,
      },
    };
  } else if (action.type === 'JOIN_GAME') {
    const playerId = action.playerId;
    const username = action.username;

    const players: State['players'] = {
      ...state.players,
      [playerId]: {
        id: playerId,
        username,
        score: 0,
      },
    };

    return {
      ...state,
      players,
      metaView: {
        ...state.metaView,
        players,
      },
    };
  } else if (action.type === 'SELECT_QUESTION') {
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
  } else if (action.type === 'ANSWER_QUESTION') {
    const { questionId } = state;
    const answer = state.game.questions[questionId].answer;
    const question = omit(state.game.questions[questionId], 'answer');

    return {
      ...state,
      answeringId: action.playerId,
      answers: {
        [action.playerId]: true,
      },
      playerView: {
        type: 'SHOW_QUESTION_ANSWERING_VIEW',
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
  } else if (action.type === 'ACK_QUESTION') {
    const { questionId } = state;
    const answer = state.game.questions[questionId].answer;
    const question = omit(state.game.questions[questionId], 'answer');

    if (action.ack) {
      const players = {
        ...state.players,
        [state.answeringId]: {
          ...state.players[state.answeringId],
          score:
            state.players[state.answeringId].score + Number(question.price),
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
        answeringId: action.playerId,
        answers: {
          [action.playerId]: true,
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
  } else if (action.type === 'SKIP_QUESTION') {
    const { questionId } = state;
    const answer = state.game.questions[questionId].answer;
    const question = omit(state.game.questions[questionId], 'answer');

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
        question,
        answer,
      },
      ownerView: {
        type: 'OWNER_SHOW_ANSWER_VIEW',
        question,
        answer,
      },
    };
  } else if (action.type === 'NEXT_QUESTION') {
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
}

function mapRound({ state, roundId }: { state: State; roundId: number }) {
  return {
    ...state.game.rounds[roundId],
    themes: state.game.rounds[roundId].themes.map((themeId) => ({
      ...state.game.themes[themeId],
      questions: state.game.themes[themeId].questions.map((questionId) =>
        state.answered[questionId] ? null : state.game.questions[questionId]
      ),
    })),
  };
}
