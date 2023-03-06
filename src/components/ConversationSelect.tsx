import { useRouter } from "next/router";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation } from "../types";
import RecipientAvt from "./RecipientAvt";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;

  :hover {
    background-color: #e9eaeb;
  }
`;

interface CSProps {
  id: string;
  conversationUsers: Conversation["users"];
}

const ConversationSelect = ({ id, conversationUsers }: CSProps) => {
  const { recipient, recipientEmail } = useRecipient(conversationUsers);
  const router = useRouter();

  const onSelectConversation = () => {
    router.push(`/conversation/${id}`);
  };
  return (
    <StyledContainer onClick={onSelectConversation}>
      <RecipientAvt recipient={recipient} recipientEmail={recipientEmail} />
      <span>{recipientEmail}</span>
    </StyledContainer>
  );
};

export default ConversationSelect;
