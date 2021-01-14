import React from 'react';

export const Answering = ({ state, meta }) => {
  return (
    <div>
      Answering:{' '}
      <span style={{ fontWeight: 'bold' }}>
        {meta.players[state.playerId]?.username}
      </span>
    </div>
  );
};
