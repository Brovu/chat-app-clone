import { doc, getDoc, getDocs } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ConversationScreen from "../../components/ConversationScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../config/firebase";
import { Conversation, IMess } from "../../types";
import {
  generateQueryGetMess,
  transformMess,
} from "../../utils/generateQueryGetMess";
import { getRecipientEmail } from "../../utils/getRecipientEmail";

const StyledContainer = styled.div`
  display: flex;
`;

const StyledConversationContainer = styled.div`
  flex-frow: 1;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

interface Props {
  conversation: Conversation;
  mess: IMess[];
}
const Conversations = ({ conversation, mess }: Props) => {
  const [loggedInUser] = useAuthState(auth);
  return (
    <StyledContainer>
      <Head>
        <title>
          Chat with {getRecipientEmail(conversation.users, loggedInUser)}
        </title>
      </Head>
      <Sidebar />
      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} mess={mess} />
      </StyledConversationContainer>
    </StyledContainer>
  );
};

//how to fix above bug?

export default Conversations;

// eslint-disable-next-line @next/next/no-typos
export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationsID = context.params?.id;

  //get conversation, to know who are chatting
  const conversationRef = doc(db, "conversations", conversationsID as string);
  const conversationSnapshot = await getDoc(conversationRef);

  const queryMess = generateQueryGetMess(conversationsID);
  const messSnapshot = await getDocs(queryMess);

  const mess = messSnapshot.docs.map((messDoc) => transformMess(messDoc));

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      mess,
    },
  };
};
