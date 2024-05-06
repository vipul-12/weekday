import styled, { keyframes } from "styled-components";

const spinFrame = keyframes`
    0% {
        transform : rotate (0deg);
    }

    100%{
        transform: rotate (360deg);
    }
`;

const StyledLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .loader {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #90ee90;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: ${spinFrame} 2s linear infinite;
  }
`;

const Loader = () => {
  return (
    <StyledLoader>
      <div className="loader"></div>
    </StyledLoader>
  );
};

export default Loader;
