import styled from 'styled-components';

export const Background = styled.div`
  position: absolute;
  width:390px;
  height:844px;
  
  top: 0;
  left: 0;
  background: #000000b0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled.div`
  font: 1rem 'Noto Sans KR';
  text-align: center;
  font-size:24px;
  color:#ffffff;
  background-color:#000000;
  `;