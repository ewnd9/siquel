import { State } from 'shared';

export function mapRound({ state, roundId }: { state: State; roundId: number }) {
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
