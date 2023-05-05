import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";

import {
  convertTimestampToString,
  generateQueryGetMessImg,
  transformMess,
} from "../utils/generateQueryGetMess";
import RecipientAvt from "./RecipientAvt";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../config/firebase";
import { generateQueryGetMess } from "../utils/generateQueryGetMess";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import Mess from "./Mess";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  addDoc,
  collection,
  doc,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import Picker from "emoji-picker-react";
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
  position: relative;
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
  border: 1px solid pink;
  border-radius: 10px;
  background-color: white;
`;

const StyledEmoji = styled.div`
  position: absolute;
  top: 0;
  overflow-y: auto;
  background-color: transparent;
  z-index: 100;
`;

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 50px;
`;

const StyledFileInput = styled.input``;
const StyleLabel = styled.label``;

const ConversationScreen = ({ conversation, mess }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [newMess, setNewMess] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [pickEmoji, setPickEmoji] = useState(null);

  const onEmojiClick = (emojiObject) => {
    setPickEmoji(emojiObject);
    setNewMess((prevValue) => prevValue + emojiObject.emoji);
    console.log(emojiObject);
  };
  const openPickerEmotion = () => {
    if (!showPicker) {
      setShowPicker(true);
    } else {
      setShowPicker(false);
    }
  };

  const closeEmojiPicker = () => {
    setShowPicker(false);
  };

  const [Img, setImg] = useState(null);

  const scrollToTheEnd = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addNewImg = async () => {
    const reader = new FileReader();
    reader.readAsDataURL(Img);
    reader.onload = async () => {
      const base64Img = reader.result;
      await addDoc(collection(db, "messages"), {
        conversation_id: conversationId,
        sent_at: serverTimestamp(),
        imgUrl: base64Img,
        user: loggedInUser?.email,
      });
    };
    setImg(null);
    setNewMess("");
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
  };

  const sendNewMessOnEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (Img) {
        addNewImg();
      } else {
        addNewMessToDbAndUpdate();
      }

      if (numMessages > 5) {
        scrollToTheEnd();
      } else {
        return;
      }
    }
  };

  const sendNewMessOnClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (Img) {
      addNewImg();
    } else {
      addNewMessToDbAndUpdate();
    }
    if (numMessages > 5) {
      scrollToTheEnd();
    } else {
      return;
    }
  };

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

  //Count quatity of messages
  const messageRef = collection(db, "messages");
  const conversationMessagesQuery = query(
    messageRef,
    where("conversation_id", "==", conversationId)
  );
  const [messagesSnapshot] = useCollectionData(conversationMessagesQuery, {
    idField: "id",
  } as any);
  const numMessages = messagesSnapshot?.length ?? 0;

  //Count quatity of conversations per user
  const conversationRef = collection(db, "conversations");
  const conversationconversationsQuery = query(
    conversationRef,
    where("users", "array-contains", loggedInUser?.email)
  );
  const [conversationsSnapshot] = useCollectionData(
    conversationconversationsQuery,
    {
      idField: "id",
    } as any
  );
  const numconversations = conversationsSnapshot?.length ?? 0;
  console.log(numconversations);

  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  return (
    <>
      {numconversations > 0 && (
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
              <MoreVertIcon />
            </IconButton>
          </StyledHeaderIcons>
        </StyledHeader>
      )}
      <StyledMessContainer onClick={closeEmojiPicker}>
        {showMess()} <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
        {/* {pickEmoji && (
          <div>
            <br />
            <br />
            <span>You chose: {pickEmoji.emoji}</span>
          </div>
        )} */}
        {showPicker && (
          <StyledEmoji>
            x
            <Picker onEmojiClick={onEmojiClick} />
          </StyledEmoji>
        )}
      </StyledMessContainer>

      <StyledInputContainer>
        <IconButton onClick={openPickerEmotion}>
          <InsertEmoticonIcon />
        </IconButton>
        <StyledInput
          type="text"
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

        <StyledFileInput
          style={{ display: "none" }}
          id="file"
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <IconButton>
          <StyleLabel style={{ cursor: "pointer" }} htmlFor="file">
            <AttachFileIcon />
          </StyleLabel>
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
