import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMess } from "../types";
import {
  convertTimestampToString,
  transformMess,
} from "../utils/generateQueryGetMess";
import RecipientAvt from "./RecipientAvt";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { generateQueryGetMess } from "../utils/generateQueryGetMess";
import { useCollection } from "react-firebase-hooks/firestore";
import Mess from "./Mess";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
  useRef,
} from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const StyledHeader = styled.div`
  position: sticky;
  display: flex;
  top: 0;
  height: 60px;
  padding: 5px;
  border-bottom: 1px solid whitesmoke;
  background-color: white;
  z-index: 100;
  align-items: center;
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 1rem;
    color: #ccc;
  }
`;

const StyledHeaderIcons = styled.div`
  display: flex;
`;

const StyledH3 = styled.h3`
  word-break: break-all;
`;

const StyledMessContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const StyledInputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  z-index: 100;
  bottom: 0;
  position: sticky;
  background-color: white;
`;

const StyledInput = styled.input`
  flex-grow: 1;
  padding: 15px;
  margin: 0 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: white;
`;

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 30px;
`;

type NewType = {
  conversation: Conversation;
  mess: IMess[];
};

const ConversationScreen = ({ conversation, mess }: NewType) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollToTheEnd = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const addNewMessToDbAndUpdate = async () => {
    await setDoc(
      doc(db, "users", loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );
    await addDoc(collection(db, "messages"), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMess,
      user: loggedInUser?.email,
    });
    setNewMess("");
    scrollToTheEnd();
  };

  const sendNewMessOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!newMess) return;
      addNewMessToDbAndUpdate();
    }
  };

  const sendNewMessOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (!newMess) return;
    addNewMessToDbAndUpdate();
  };

  const [newMess, setNewMess] = useState("");
  const [loggedInUser] = useAuthState(auth);
  const conversationUsers = conversation.users;

  const router = useRouter();
  const conversationId = router.query.id;

  const queryGetMess = generateQueryGetMess(conversationId as string);

  const [messSnapshot, messLoading, __error] = useCollection(queryGetMess);

  const showMess = () => {
    if (messLoading) {
      return mess.map((mes) => <Mess mess={mes} key={mes.id} />);
    }
    if (messSnapshot) {
      return messSnapshot.docs.map((mess) => (
        <Mess key={mess.id} mess={transformMess(mess)} />
      ));
    }
  };

  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  return (
    <>
      <StyledHeader>
        <RecipientAvt recipient={recipient} recipientEmail={recipientEmail} />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last Online: {convertTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>
        <StyledHeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcons>
      </StyledHeader>
      <StyledMessContainer>
        {showMess()} <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessContainer>

      <StyledInputContainer>
        <InsertEmoticonIcon />
        <StyledInput
          value={newMess}
          onChange={(e) => setNewMess(e.target.value)}
          onKeyDown={sendNewMessOnEnter}
          placeholder="Write your text..."
        />
        {newMess && (
          <IconButton onClick={sendNewMessOnClick}>
            <SendIcon />
          </IconButton>
        )}
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
