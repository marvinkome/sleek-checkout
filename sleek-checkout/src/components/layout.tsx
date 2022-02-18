import { h } from "preact";
import styled from "styled-components";
import { IoCloseOutline } from "@react-icons/all-files/io5/IoCloseOutline";
import { useRouter } from "../services/router";
import { useConfig } from "../services/config";

const AppContainer = styled.div`
  @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");
  height: 100%;
  line-height: 1.5;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: rgb(0 0 0 / 0.72);
  -webkit-font-smoothing: antialiased;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #000000;
  }
`;

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 599999;
`;

const ModalContent = styled.div`
  position: relative;
  background: #fff;
  border-radius: 40px;
  padding: 2rem;
  width: 420px;
`;

const ModalHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ModalCloseButton = styled.button`
  cursor: pointer;
  border: none;
  background: rgb(0 0 0 / 5%);
  padding: 0.5rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
`;

const ModalBody = styled.main`
  padding: 1rem 0px;
`;

const ModalFooter = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 1rem;
`;

const FooterStep = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  background: #000000;
  border-radius: 50%;
  opacity: ${(props: any) => (props.active ? "1" : "0.2")};
  margin-right: 0.3rem;
`;

export const Layout = ({ children, maxPages }: any) => {
  const { activeRouteId } = useRouter();
  const { onClose } = useConfig();

  return (
    <AppContainer>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <div>
              <h2>Sleek Pay</h2>
              <p>The easiest way to pay with crypto</p>
            </div>

            <ModalCloseButton onClick={() => onClose!()}>
              <IoCloseOutline />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            {Array.from({ length: maxPages }, (_, i) => (
              <FooterStep key={i} active={i <= (activeRouteId || 0)} />
            ))}
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </AppContainer>
  );
};
