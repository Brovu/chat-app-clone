import { Timestamp } from "firebase/firestore";

export interface Conversation {
  users: string[];
}
export interface AppUser {
  email: string;
  lastSeen: Timestamp;
  avt: string;
}

export interface IMess {
  id: string;
  text: string;
  sent_at: string;
  user: string;
  conversation_id: string;
}
