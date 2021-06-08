import { State } from 'shared';

export interface Socket {
  emit(action: string, data: any, callback: (state: State) => void): void;
}

export type SetState = (state: State) => void;
