import SearchIcon from "@mui/icons-material/Search";
import styled from "styled-components";
import { useState } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Avatar from "@mui/material/Avatar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

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

const StyledContainerUser = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 3px;
  padding: 15px;
  word-break: break-all;
  :hover {
    background-color: #e9eaeb;
  }
`;

const StyledAvatar = styled(Avatar)`
  margin: 5px;
`;
const SearchUser = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const router = useRouter();
  const [loggedInUser] = useAuthState(auth);

  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );

  const [conversationsSnapshot] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const getId = () => {
    const conversation = conversationsSnapshot?.docs.find((conversation) => {
      const users = conversation.data().users;
      return users.includes(loggedInUser?.email) && users.includes(userName);
    });
    return conversation?.id;
  };

  const handleSearchUser = async () => {
    const q = query(collection(db, "users"), where("email", "==", userName));

    try {
      const searchSnapShot = await getDocs(q);
      searchSnapShot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };
  const enterKey = (e: { code: string }) => {
    e.code === "Enter" && handleSearchUser();
  };

  const handleSelect = () => {
    setUser(null);
    setUserName("");
    const conversationId = getId();
    if (conversationId) {
      router.push(`/conversation/${conversationId}`);
    }
  };

  return (
    <>
      <StyledSearch>
        <SearchIcon style={{ cursor: "pointer" }} onClick={handleSearchUser} />
        <SeacrchInput
          placeholder="Seacrh in Conversation"
          onKeyDown={enterKey}
          onChange={(e) => setUserName(e.target.value)}
        />
      </StyledSearch>
      {err && <span>User not found!!</span>}
      {user && userName === user.email && (
        <StyledContainerUser onClick={handleSelect}>
          <StyledAvatar src={user.avt} />
          <span>{user.email}</span>
        </StyledContainerUser>
      )}
    </>
  );
};

export default SearchUser;
