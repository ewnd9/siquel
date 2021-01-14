import React from 'react';
import {
  MetaView,
  OWNER_SHOW_QUESTION_VIEW_TYPE,
  OWNER_SHOW_QUESTION_ANSWERING_VIEW_TYPE,
  OWNER_SHOW_ANSWER_VIEW_TYPE,
} from 'shared/src';

import { SetState, Socket } from './types';
import { Question } from './components/question';
import { Answering } from './components/answering';

export const OwnerShowQuestionView = ({
  io,
  meta,
  state,
  setState,
}: {
  io: Socket;
  meta: MetaView;
  state:
    | OWNER_SHOW_QUESTION_VIEW_TYPE
    | OWNER_SHOW_QUESTION_ANSWERING_VIEW_TYPE
    | OWNER_SHOW_ANSWER_VIEW_TYPE;
  setState: SetState;
}) => {
  return (
    <div>
      <Question state={state} meta={meta} />
      {state.type === 'OWNER_SHOW_QUESTION_ANSWERING_VIEW' ? (
        <Answering state={state} meta={meta} />
      ) : null}
      <div>Answer: {state.answer}</div>
      {state.type === 'OWNER_SHOW_QUESTION_ANSWERING_VIEW' && (
        <div>
          <button
            onClick={() => {
              io.emit('ACK_QUESTION', { ack: true }, (state) =>
                setState(state)
              );
            }}
          >
            correct
          </button>
          <button
            onClick={() => {
              io.emit('ACK_QUESTION', { ack: false }, (state) =>
                setState(state)
              );
            }}
          >
            not correct
          </button>
        </div>
      )}
    </div>
  );
};
