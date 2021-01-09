import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';

import { SelectQuestionView } from './select-question-view';
import { ShowQuestionView } from './show-question-view';
import { PlayerStats } from './player-stats';

const App = () => {
  const [state, setState] = useState(null);
  const ioRef = useRef(null);

  useEffect(() => {
    const userId = localStorage['sigame:userId'];
    const socket = io();

    if (userId) {
      socket.emit('LOGIN', { id: userId }, ({ status, state }) => {
        if (status === 'game') {
          onUpdateState(state);
        } else if (status === 'success') {
          socket.emit('CREATE_GAME', {}, onUpdateState);
        } else {
          signUp();
        }
      });
    } else {
      signUp();
    }

    socket.on('UPDATE_STATE', onUpdateState);
    ioRef.current = socket;

    function signUp() {
      socket.emit('SIGN_UP', { username: 'ivan' }, ({ id }) => {
        localStorage['sigame:userId'] = id;
        socket.emit('CREATE_GAME', {}, onUpdateState);
      });
    }

    function onUpdateState(state) {
      console.log({ state });
      setState(state);
    }
  }, []);

  console.log({ state });

  if (!state) {
    return <div>loading...</div>;
  }

  return (
    <div style={{ margin: '80px auto 0', maxWidth: '600px' }}>
      <Game
        io={ioRef.current}
        meta={state.metaView}
        state={state.playerView}
        setState={setState}
      />
      <PlayerStats state={state.metaView} />
    </div>
  );
};

const Game = ({ io, meta, state, setState }) => {
  if (state.type === 'SELECT_QUESTION_VIEW') {
    return <SelectQuestionView io={io} state={state} setState={setState} />;
  } else if (state.type === 'SHOW_QUESTION_VIEW') {
    return (
      <ShowQuestionView io={io} meta={meta} state={state} setState={setState} />
    );
  } else if (state.type === 'SHOW_QUESTION_ANSWERING_VIEW') {
    return (
      <ShowQuestionView io={io} meta={meta} state={state} setState={setState} />
    );
  } else if (state.type === 'SHOW_ANSWER_VIEW') {
    return (
      <ShowQuestionView io={io} meta={meta} state={state} setState={setState} />
    );
  } else {
    return <div>incorrect state</div>;
  }
};

ReactDOM.render(<App />, document.querySelector('#root'));
