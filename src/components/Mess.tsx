import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../config/firebase";
import { IMess } from "../types";

const StyledMess = styled.p`
  width: fit-content;
  word-break: break-all;
  min-width: 30%;
  max-width: 90%;
  padding: 15px 15px 30px;
  border-radius: 8px;
  margin: 10px;
  position: relative;
`;

const StyledTimeStamp = styled.span`
  color: #ccc;
  position: absolute;
  padding: 10px;
  text-align: right;
  bottom: 0;
  right: 0;
  font-size: x-small;
`;

const StyledSenderMess = styled(StyledMess)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const StyledReceiverMess = styled(StyledMess)`
  background-color: whitesmoke;
`;

const Mess = ({ mess }: { mess: IMess }) => {
  const [loggedInUser] = useAuthState(auth);
  const MessType =
    loggedInUser?.email === mess.user ? StyledSenderMess : StyledReceiverMess;
  return (
    <MessType>
      {mess.text}
      <StyledTimeStamp>{mess.sent_at}</StyledTimeStamp>
    </MessType>
  );
};

export default Mess;
