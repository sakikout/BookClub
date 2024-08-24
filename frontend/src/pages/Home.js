import React, { useContext, useState, Component, useEffect } from 'react';
import StoreContext from '../components/Store/Context';
import Sidebar from '../components/Sidebar'
import '../components/sidebar.css'
import { Link, useNavigate } from 'react-router-dom';
import Publicacoes from './Publicacoes';
import Conversas from './Conversas';
import Notificacoes from './Notificacoes';
import Configuracoes from './Configuracoes';
import Usuario from './Usuario';

const Home = ({userData}) => {
  const { setToken, token } = useContext(StoreContext);
  const { comunidade, setComunidade} = useContext(StoreContext);
  const navigate = useNavigate();

  const [state, setState] = useState(0)

  const handleClick = (event, value) => {
    console.log(event.target);
    console.log(value);
    setState({
      message: value
    });
  }

  useEffect(() => {
    console.log(userData);
    console.log(state);
    console.log(token);
    console.log(comunidade)
  })

  return (
    <div className="main">
      { token ?
        <div>
        <Sidebar userData={userData} newMessage={ handleClick }></Sidebar>
        <Usuario userData={userData}></Usuario>
        {state.message === 0 ?
          <h2>Pagina Inicial</h2>
        : ''}

        {state.message === 1 ?
          <Publicacoes userData={userData}></Publicacoes>
          
        : ''}
        
        {state.message === 2 ?
          <Conversas userData={userData}></Conversas>
          
        : ''}
         {state.message === 3 ?
          <Notificacoes userData={userData}></Notificacoes>
          
        : ''}

        {state.message === 4 ?
          <Configuracoes userData={userData}></Configuracoes>
          
        : ''}
      
          
        
        <br/>
      </div>
      
      : navigate("/")}
      
    </div>
  );
};

export default Home;