import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';

const NavBar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 100;
`

const Logo = styled.div`
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease;
    
    &:hover {
      color: #ccc;
    }
  }
`

const HeroSection = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #000;
  position: relative;
  overflow: hidden;
`

const Spotlight = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
`

const Title = styled(motion.h1)`
  font-size: 4rem;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  z-index: 1;
`

const Button = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  background: transparent;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
  
  &:hover {
    background: white;
    color: black;
  }
`

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/sobre" element={<div>Sobre</div>} />
        <Route path="/agenda" element={<div>Agenda</div>} />
        <Route path="/discografia" element={<div>Discografia</div>} />
        <Route path="/fotos" element={<div>Fotos</div>} />
        <Route path="/noticias" element={<div>Notícias</div>} />
        <Route path="/central-fas" element={<div>Central de Fãs</div>} />
        <Route path="/contato" element={<div>Contato</div>} />
        <Route path="/loja" element={<div>Loja</div>} />
        <Route path="/transparencia" element={<div>Transparência</div>} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
