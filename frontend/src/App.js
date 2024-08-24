import './App.css';
import Formulario from './pages/Login.js';
import Conversas from './pages/Conversas.js';
import Notificacoes from './pages/Notificacoes.js';
import Configuracoes from './pages/Configuracoes.js'
import Publicacoes from './pages/Publicacoes.js'
import Home from './pages/Home.js'
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import StoreContext from './components/Store/Context.jsx';
import StoreProvider from './components/Store/Provider.jsx';
import Comunidades from './pages/Comunidades.js';


function App() {
  return (
    <StoreProvider>
      <Router> 
        <Routes>
          <Route path="/" element={<Formulario />}/>
          <Route path="comunidades" element={<Comunidades />}/>
          <Route path= "comunidades/home" element= {<Home/>}/>
          <Route path="posts" element={<Publicacoes/>}/>
          <Route path="chat" element={<Conversas/>}/>
          <Route path="notificacoes" element={<Notificacoes/>}/>
          <Route path="configuracoes" element={<Configuracoes/>}/>
        
        </Routes>        
      </Router>
    </StoreProvider>
  );
}

export default App;