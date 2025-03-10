import styled from 'styled-components';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaSpotify, FaDeezer } from 'react-icons/fa';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 1rem;
  z-index: 10;
`;

const FooterContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  a {
    color: white;
    font-size: 1.5rem;
    transition: color 0.3s ease;

    &:hover {
      &[href*="instagram"] {
        color: #E1306C;
      }
      &[href*="twitter"] {
        color: #1DA1F2;
      }
      &[href*="facebook"] {
        color: #4267B2;
      }
      &[href*="youtube"] {
        color: #FF0000;
      }
      &[href*="spotify"] {
        color: #1DB954;
      }
    }
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>Todos os direitos reservados - Harmonia Hits - 2025</Copyright>
        <SocialLinks>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
            <FaSpotify />
          </a>

        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;