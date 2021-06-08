import { ParseSiqResult } from './models';
import { PlayerView } from './player-state';
import { OwnerView } from './owner-state';

export interface State {
  roomId?: string;
  game?: ParseSiqResult;
  roundId?: number;
  ownerId?: string;
  answered?: Record<string, boolean>;

  answers?: Record<string, boolean>;
  answeringId?: string;
  questionId?: string;

  players?: Record<
    string,
    {
      id: string;
      username: string;
      score: number;
    }
  >;

  metaView?: MetaView;
  playerView?: PlayerView;
  ownerView?: OwnerView;
  auth?: { id: string; username: string };
}

export interface MetaView {
  players: Record<
    string,
    {
      id: string;
      username: string;
      score: number;
    }
  >;
  roomId: string;
}

export type ClientView = PlayerView | OwnerView;
