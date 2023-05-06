import { useRouter } from "next/router";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation } from "../types";
import RecipientAvt from "./RecipientAvt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const StyledHighlightOffIcon = styled(HighlightOffIcon)`
  cursor: pointer;
  color: #ff3333;
  display: none;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  :hover {
    background-color: #e9eaeb;
    ${StyledHighlightOffIcon} {
      display: block;
    }
  }
`;

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 3px;
  padding: 15px;
  word-break: break-all;
`;

interface CSProps {
  id: string;
  conversationUsers: Conversation["users"];
}

const ConversationSelect = ({ id, conversationUsers }: CSProps) => {
  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  const router = useRouter();

  const handleDeleteConversation = async () => {
    try {
      const conversationeRef = doc(db, "conversations", id);
      await deleteDoc(conversationeRef);
    } catch (error) {
      console.error("Error deleting conversation: ", error);
    }
    console.log(id);
  };

  const onSelectConversation = () => {
    router.push(`/conversation/${id}`);
  }; 
  return (
    <StyledWrapper>
      <StyledContainer onClick={onSelectConversation}>
        <RecipientAvt recipient={recipient} recipientEmail={recipientEmail} />
        <span>{recipientEmail}</span>
      </StyledContainer>
      <StyledHighlightOffIcon onClick={handleDeleteConversation} />
    </StyledWrapper>
  );
};

export default ConversationSelect;
