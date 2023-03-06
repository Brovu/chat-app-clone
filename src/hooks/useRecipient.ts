import { AppUser, Conversation } from "../types";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { getRecipientEmail } from "../utils/getRecipientEmail";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [loggedInuser] = useAuthState(auth);

  const recipientEmail = getRecipientEmail(conversationUsers, loggedInuser);

  //get avt
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );

  const [recipientsSnapshot] = useCollection(queryGetRecipient);

  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined;

  return { recipient, recipientEmail };
};
