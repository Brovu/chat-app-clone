import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../config/firebase";
import { IMess } from "../types";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, deleteDoc } from "firebase/firestore";

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

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
  font-size: 1rem;
`;

const StyledSenderMess = styled(StyledMess)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const StyledReceiverMess = styled(StyledMess)`
  background-color: whitesmoke;
`;

const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  color: green;
`;

const Mess = ({ mess }: { mess: IMess }) => {
  const [loggedInUser] = useAuthState(auth);
  const MessType =
    loggedInUser?.email === mess.user ? StyledSenderMess : StyledReceiverMess;

  const handleDeleteMessage = async () => {
    try {
      const messageRef = doc(db, "messages", mess.id);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <StyledContainer>
      <MessType>
        {mess.text}
        <StyledTimeStamp>{mess.sent_at}</StyledTimeStamp>
      </MessType>
      <StyledDeleteIcon onClick={handleDeleteMessage} />
    </StyledContainer>
  );
};

export default Mess;
