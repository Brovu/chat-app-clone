import Avatar from "@mui/material/Avatar";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";

type RAProps = ReturnType<typeof useRecipient>;

const StyledAvatar = styled(Avatar)`
  margin: 5px;
`;

const RecipientAvt = ({ recipient, recipientEmail }: RAProps) => {
  return recipient?.avt ? (
    <StyledAvatar src={recipient.avt} />
  ) : (
    <StyledAvatar>
      {recipientEmail && recipientEmail[0].toUpperCase()}
    </StyledAvatar>
  );
};

export default RecipientAvt;
