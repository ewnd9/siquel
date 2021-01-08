import React from 'react';

export const PlayerStats = ({ state }) => {
  return (
    <div style={{ display: 'flex' }}>
      {Object.entries(state.players).map(([id, score]) => (
        <div key={id}>
          {id}: {score}
        </div>
      ))}
    </div>
  );
};
