import {
  collection,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { IMess } from "../types";

export const generateQueryGetMess = (conversationID?: string) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationID),
    orderBy("sent_at", "asc")
  );

export const generateQueryGetMessImg = (conversationID?: string) =>
  query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationID)
  );

export const transformMess = (mess: QueryDocumentSnapshot<DocumentData>) =>
  ({
    id: mess.id,
    ...mess.data(), //spread out conversation_id, text, sent_at, user
    sent_at: mess.data().sent_at
      ? convertTimestampToString(mess.data().sent_at as Timestamp)
      : null,
  } as IMess);

export const convertTimestampToString = (timestamp: Timestamp) =>
  new Date(timestamp.toDate().getTime()).toLocaleString();
