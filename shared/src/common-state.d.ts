export interface LOGIN_TYPE {
  type: 'LOGIN';
}

export interface GAME_LIST_TYPE {
  type: 'GAME_LIST';
  gameList: { id: string; players: string[] }[];
}

export interface END_GAME_TYPE {
  type: 'END_GAME';
}

export type CommonState = LOGIN_TYPE | GAME_LIST_TYPE | END_GAME_TYPE;
