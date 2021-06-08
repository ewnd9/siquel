import React from 'react';
import { GAME_LIST_TYPE } from 'shared';

import { Socket, SetState } from './types';

export const GameListView = ({
  io,
  state,
  setState,
}: {
  io: Socket;
  state: GAME_LIST_TYPE;
  setState: SetState;
}) => {
  return (
    <div>
      <div>
        <h1>Список комнат:</h1>
        {state.gameList.length === 0 ? (
          <div>Пусто</div>
        ) : (
          <ul>
            {state.gameList.map((game) => (
              <li
                key={game.id}
                onClick={() => {
                  io.emit('JOIN_GAME', { roomId: game.id }, setState);
                }}
              >
                {game.id}: {game.players.join(', ')} (
                <a href={`${window.location.host}/room/${game.id}`}>link</a>)
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => {
            io.emit('CREATE_GAME', {}, setState);
          }}
        >
          Создать игру
        </button>
      </div>
    </div>
  );
};
