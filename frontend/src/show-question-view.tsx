import React from 'react';

export const ShowQuestionView = ({ io, meta, state, setState }) => {
  const isSomeoneAnswering = state.type === 'SHOW_QUESTION_ANSWERING_VIEW';
  const showingAnswer = state.type === 'SHOW_ANSWER_VIEW';

  return (
    <div>
      <div>
        {state.question.question.type === 'image' ? (
          <img
            style={{ width: '600px', height: 'auto' }}
            src={`/api/v1/static/${meta.roomId}/${encodeURIComponent(
              state.question.question.fileId
            )}`}
          />
        ) : state.question.question.type === 'voice' ? (
          <audio
            src={`/api/v1/static/${meta.roomId}/${encodeURIComponent(
              state.question.question.fileId
            )}`}
            autoPlay
          />
        ) : state.question.question.type === 'text' ? (
          <div>{state.question.question.text}</div>
        ) : (
          JSON.stringify(state.question, null, 2)
        )}
      </div>
      {isSomeoneAnswering ? <div>answering: {state.playerId}</div> : null}
      {showingAnswer ? (
        state.answer
      ) : (
        <>
          <button
            disabled={isSomeoneAnswering}
            onClick={() => {
              io.emit('ANSWER_QUESTION', {}, (state) => {
                setState(state);
              });
            }}
          >
            answer
          </button>
          {isSomeoneAnswering && (
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
        </>
      )}
    </div>
  );
};
