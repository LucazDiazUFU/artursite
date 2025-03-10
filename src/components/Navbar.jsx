import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  background: transparent;
  z-index: 1000;
`;

const LogoContainer = styled.div`
  position: fixed;
  top: 12px;
  left: 10px;
  z-index: 1001;
`;

const Logo = styled.img`
  height: 80px;
  width: auto;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  width: 100%;
  padding: 0 100px;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 0.5rem 4.2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: white;
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: white;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <LogoContainer>
        <Logo src="/logo.png" alt="Artur Almeida" />
      </LogoContainer>
      <NavLinks>
        <NavLink to="/">Início</NavLink>
        <NavLink to="/sobre">Sobre</NavLink>
        <NavLink to="/agenda">Agenda</NavLink>
        <NavLink to="/discografia">Discografia</NavLink>
        <NavLink to="/fotos">Fotos</NavLink>
        <NavLink to="/contato">Contato</NavLink>
      </NavLinks>
    </Nav>
  );
};

export default Navbar;