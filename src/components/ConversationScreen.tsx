import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import IconButton from "@mui/material/IconButton";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMess } from "../types";
import { convertTimestampToString } from "../utils/generateQueryGetMess";
import RecipientAvt from "./RecipientAvt";

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

const ConversationScreen = ({
  conversation,
  mess,
}: {
  conversation: Conversation;
  mess: IMess[];
}) => {
  const conversationUsers = conversation.users;

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
    </>
  );
};

export default ConversationScreen;
