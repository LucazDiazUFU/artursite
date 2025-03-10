import styled from 'styled-components';

const HeroSection = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const VideoBackground = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: white;
  text-transform: uppercase;
  letter-spacing: 5px;
  margin-bottom: 30px;
  z-index: 2;
`;

const Button = styled.button`
  padding: 15px 30px;
  background: transparent;
  border: 2px solid white;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  margin-top: 65vh;

  &:hover {
    background: white;
    color: black;
  }
`;

const Hero = () => {
  return (
    <HeroSection>
      <VideoBackground autoPlay loop muted playsInline>
        <source src="/artur.mp4" type="video/mp4" />
      </VideoBackground>
      <Overlay />
      <Button>Ver Agenda</Button>
    </HeroSection>
  );
};

export default Hero;