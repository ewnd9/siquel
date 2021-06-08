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
  return (
    <div>
      <Question state={state} meta={meta} />
      {state.type === 'SHOW_QUESTION_ANSWERING_VIEW' ? (
        <Answering state={state} meta={meta} />
      ) : null}
      {state.type === 'SHOW_ANSWER_VIEW' ? (
        <div>Answer: {state.answer}</div>
      ) : (
        <>
          <button
            disabled={state.type === 'SHOW_QUESTION_ANSWERING_VIEW'}
            onClick={() => {
              io.emit('ANSWER_QUESTION', {}, (state) => {
                setState(state);
              });
            }}
          >
            answer
          </button>
        </>
      )}
    </div>
  );
};
