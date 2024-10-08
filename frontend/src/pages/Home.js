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

  /*  <Usuario userData={userData}></Usuario> */

  return (
    <div className="main">

      { token ?
        <div>
        <Sidebar userData={userData} newMessage={ handleClick }></Sidebar>
        
        {state.message === 0 ?
          <div className="mform">
            <h2 className="title">Pagina Inicial</h2>
          </div>
        : ''}

        {state.message === 1 || state === 0 ?
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