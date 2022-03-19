import React, { useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

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
        <Audio
          src={`/api/v1/static/${meta.roomId}/${encodeURIComponent(
            state.question.question.fileId
          )}`}
        />
      ) : state.question.question.type === 'text' ? (
        <div>Question: {state.question.question.text}</div>
      ) : (
        JSON.stringify(state.question, null, 2)
      )}
    </div>
  );
};

const Audio = ({ src }) => {
  return <ReactAudioPlayer src={src} autoPlay controls />;
};
