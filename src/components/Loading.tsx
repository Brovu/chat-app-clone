import { CircularProgress } from "@mui/material";
import styled from "styled-components";
import WaitImg from "../assets/wait.jpg";
import Image from "next/image";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledImgWrapper = styled.div`
  margin-bottom: 50px;
`;
const Loading = () => {
  return (
    <StyledContainer>
      <StyledImgWrapper>
        <Image
          src={WaitImg}
          alt="Logo"
          style={{ height: "200px", width: "200px" }}
        />
      </StyledImgWrapper>
      <CircularProgress />
    </StyledContainer>
  );
};

export default Loading;
