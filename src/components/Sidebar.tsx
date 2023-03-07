import { Avatar, Button } from "@mui/material";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import * as EmailValidate from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ConversationSelect from "./ConversationSelect";
import { auth, db } from "../config/firebase";
import { Conversation } from "../types";

const StyledContainer = styled.div`
  height: 100vh;
  width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  background-color: white;
  border-bottom: 1px solid whitesmoke;
  top: 0;
  padding: 10px;
  height: 50px;
  z-index: 10;
`;

const StyledSearch = styled.div`
  display: flex;
  border-radius: 5px;
  padding: 10px;
  align-items: center;
`;

const SeacrchInput = styled.input`
  border: none;
  flex: 1;
  outline: none;
`;

const StyledButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;

const StyleUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const Sidebar = () => {
  const [loggedInUser] = useAuthState(auth);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  const toggleDialog = (isOpen: boolean) => {
    setIsOpenDialog(isOpen);
  };

  const closeDialog = () => {
    toggleDialog(false);
    setRecipientEmail("");
  };

  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );

  const [conversationsSnapshot] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const isConversationExisted = (recipientEmail: string) => {
    return conversationsSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  };

  const yourSelf = recipientEmail === loggedInUser?.email;

  const createConversation = async () => {
    if (!recipientEmail) return;
    if (
      EmailValidate.validate(recipientEmail) &&
      !yourSelf &&
      !isConversationExisted(recipientEmail)
    ) {
      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
    }
    closeDialog();
    setRecipientEmail("");
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <StyleUserAvatar src={loggedInUser?.photoURL || ""} />
        </Tooltip>
        <div>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVerticalIcon />
          </IconButton>
          <IconButton>
            <LogoutIcon onClick={logOut} />
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon style={{ cursor: "pointer" }} />
        <SeacrchInput placeholder="Seacrh in Conversation" />
      </StyledSearch>

      <StyledButton onClick={() => toggleDialog(true)}>
        Start a new conversation
      </StyledButton>

      {conversationsSnapshot?.docs.map((conversation) => (
        <ConversationSelect
          key={conversation.id}
          id={conversation.id}
          conversationUsers={(conversation.data() as Conversation).users}
        />
      ))}

      <Dialog
        open={isOpenDialog}
        onClose={() => {
          toggleDialog(false);
        }}
      >
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a Google email address for the user you want to chat
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientEmail}
            onChange={(e) => {
              setRecipientEmail(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button disabled={!recipientEmail} onClick={createConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Sidebar;
