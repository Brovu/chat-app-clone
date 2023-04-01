import styled from "styled-components";
import { ImgMess } from "../types";

const StyledContainer = styled.div`
  height: 200px;
  width: 200px;
`;

const StyledImg = styled.img`
  height: 190px;
  width: 100%;
  border-radius: 5px;
`;

const MessImg = ({ img }: { img: ImgMess }) => {
  return (
    <StyledContainer>
      <StyledImg src={img.imgUrl} />
    </StyledContainer>
  );
};

export default MessImg;
