import React from 'react';
import {
  MetaView,
  SHOW_QUESTION_VIEW_TYPE,
  SHOW_QUESTION_ANSWERING_VIEW_TYPE,
  SHOW_ANSWER_VIEW_TYPE,
} from 'shared';

import { SetState, Socket } from './types';
import { Question } from './components/question';
import { Answering } from './components/answering';
import { Button } from './components/button';

export const ShowQuestionView = ({
  io,
  meta,
  state,
  setState,
}: {
  io: Socket;
  meta: MetaView;
  state:
    | SHOW_QUESTION_VIEW_TYPE
    | SHOW_QUESTION_ANSWERING_VIEW_TYPE
    | SHOW_ANSWER_VIEW_TYPE;
  setState: SetState;
}) => {
  const theme = state.round.themes.find((theme) =>
    theme.questions.some((question) => question?.id === state.question.id)
  );

  return (
    <div>
      <div>{theme?.name}</div>
      <div className="mt-3">
        <Question state={state} meta={meta} />
        {state.type === 'SHOW_QUESTION_ANSWERING_VIEW' ? (
          <Answering state={state} meta={meta} />
        ) : null}
        {state.type === 'SHOW_ANSWER_VIEW' ? (
          <div>Answer: {state.answer}</div>
        ) : (
          <div className="mt-3">
            <Button
              disabled={state.type === 'SHOW_QUESTION_ANSWERING_VIEW'}
              onClick={() => {
                io.emit('ANSWER_QUESTION', {}, (state) => {
                  setState(state);
                });
              }}
            >
              answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
