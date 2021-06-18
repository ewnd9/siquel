import React from 'react';

export const Question = ({ state, meta }) => {
  return (
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
        <div>Question: {state.question.question.text}</div>
      ) : (
        JSON.stringify(state.question, null, 2)
      )}
    </div>
  );
};
