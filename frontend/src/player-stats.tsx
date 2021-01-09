import React from 'react';
import { MetaView } from 'shared/src/state';

export const PlayerStats = ({ state }: { state: MetaView }) => {
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
