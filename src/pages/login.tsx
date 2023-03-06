import { Button } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import ChatAppLogo from "../assets/logo-chat-app.png";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";

const StyleContainer = styled.div`
  height: 100vh;
  background-color: whitesmoke;
  display: grid;
  place-items: center;
`;

const StyledButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 50px;
  border-radius: 5px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
`;

const StyledImgWrapper = styled.div`
  margin-bottom: 50px;
`;

const Login = () => {
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const signIn = () => {
    signInWithGoogle();
  };
  return (
    <StyleContainer>
      <Head>
        <title>Log in</title>
      </Head>
      <StyledButtonContainer>
        <StyledImgWrapper>
          <Image
            src={ChatAppLogo}
            alt="Logo"
            style={{ height: "200px", width: "200px" }}
          />
        </StyledImgWrapper>

        <Button style={{ border: "1px solid pink" }} onClick={signIn}>
          Sign in with Google
        </Button>
      </StyledButtonContainer>
    </StyleContainer>
  );
};

export default Login;
