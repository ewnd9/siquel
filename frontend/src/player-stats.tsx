import React from 'react';
import { MetaView } from 'shared';

export const PlayerStats = ({ state }: { state: MetaView }) => {
  return (
    <div style={{ display: 'flex' }}>
      {Object.values(state.players).map(({ id, username, score }) => (
        <div key={id} style={{ margin: '8px 8px 0 0' }}>
          {username}: {score}
        </div>
      ))}
    </div>
  );
};
