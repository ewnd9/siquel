import { State } from 'shared/src/state';

export function reduce(state: State, action): State {
  if (action.type === 'CREATE_GAME') {
    const roundId = 0;

    return {
      ...state,
      roundId,
      playerView: {
        type: 'SELECT_QUESTION_VIEW',
        round: mapRound({ state, roundId }),
      },
      metaView: {
        players: Object.values(state.players).reduce(
          (acc, { username, score }) => {
            acc[username] = score;
            return acc;
          },
          {}
        ),
        roomId: state.roomId,
      },
    };
  } else if (action.type === 'SELECT_QUESTION') {
    const questionId = action.id;

    return {
      ...state,
      questionId,
      answers: {},
      playerView: {
        type: 'SHOW_QUESTION_VIEW',
        question: state.game.questions[questionId],
      },
    };
  } else if (action.type === 'ANSWER_QUESTION') {
    const { questionId } = state;
    console.log(Object.keys(state));

    return {
      ...state,
      answeringId: action.playerId,
      answers: {
        [action.playerId]: true,
      },
      playerView: {
        type: 'SHOW_QUESTION_ANSWERING_VIEW',
        question: state.game.questions[questionId],
        playerId: action.playerId,
      },
    };
  } else if (action.type === 'ACK_QUESTION') {
    const { questionId } = state;

    if (action.ack) {
      const question = state.game.questions[questionId];
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
          answer: question.answer,
        },
        metaView: {
          ...nextState.metaView,
          players: Object.values(nextState.players).reduce(
            (acc, { username, score }) => {
              acc[username] = score;
              return acc;
            },
            {}
          ),
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
          question: state.game.questions[questionId],
        },
      };
    }
  } else if (action.type === 'NEXT_QUESTION') {
    return {
      ...state,
      playerView: {
        type: 'SELECT_QUESTION_VIEW',
        round: mapRound({ state, roundId: state.roundId }),
      },
    };
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
