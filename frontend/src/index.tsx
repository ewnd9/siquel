import React from 'react';
import ReactDOM from 'react-dom';
import { PlayerView, MetaView } from 'shared/src/state';

import { SelectQuestionView } from './select-question-view';
import { ShowQuestionView } from './show-question-view';
import { PlayerStats } from './player-stats';
import { useSocketIo } from './hooks/use-socket-io';
import { Socket, SetState } from './types';

const App = () => {
  const [state, setState, io] = useSocketIo();
  console.log({ state });

  if (!state) {
    return <div>loading...</div>;
  }

  return (
    <div style={{ margin: '80px auto 0', maxWidth: '600px' }}>
      <Game
        io={io}
        meta={state.metaView}
        state={state.playerView}
        setState={setState}
      />
      <PlayerStats state={state.metaView} />
    </div>
  );
};

const Game = ({
  io,
  meta,
  state,
  setState,
}: {
  io: Socket;
  meta: MetaView;
  state: PlayerView;
  setState: SetState;
}) => {
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
