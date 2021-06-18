import React from 'react';
import {
  MetaView,
  OWNER_SHOW_QUESTION_VIEW_TYPE,
  OWNER_SHOW_QUESTION_ANSWERING_VIEW_TYPE,
  OWNER_SHOW_ANSWER_VIEW_TYPE,
} from 'shared';

import { SetState, Socket } from './types';
import { Question } from './components/question';
import { Answering } from './components/answering';
import { Button } from './components/button';

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
      {(state.type === 'OWNER_SHOW_QUESTION_ANSWERING_VIEW' && (
        <div className="mt-3">
          <Button
            onClick={() => {
              io.emit('ACK_QUESTION', { ack: true }, (state) =>
                setState(state)
              );
            }}
          >
            correct
          </Button>
          <Button
            className="ml-3"
            onClick={() => {
              io.emit('ACK_QUESTION', { ack: false }, (state) =>
                setState(state)
              );
            }}
          >
            not correct
          </Button>
        </div>
      )) || (
        <div className="mt-3">
          <Button
            onClick={() => {
              io.emit('SKIP_QUESTION', {}, (state) => setState(state));
            }}
          >
            skip question
          </Button>
        </div>
      )}
    </div>
  );
};
