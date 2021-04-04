export interface SignInType {
  phone: string;
  email: string;
  password: string;
}

export interface RegisterOptions {
  name: string;
  password: string;
  phone: string;
  email: string;
}

export interface HistoryPlayGets {
  user_id: number;
  page: number;
  limit: number;
}

export interface HistoryPlaySets {
  user_id: number;
  play_id: number;
  ep: number;
  play_time: number;
  video_time: number;
}

export interface User {
  id: number;
  name: string;
  face: string;
}

export interface HistoryPlay {
  id: number;
  title: string;
  ep: number;
  ep_title: string;
  img: string;
  time: number;
  video_time: number;
}
