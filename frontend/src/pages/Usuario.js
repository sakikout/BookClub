import React, { useState, useContext } from 'react';
import profile from "../icons/profile.png"
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';


function getTipo(token){
  if(token == 1){
    return 'Operador'
  } else if(token == 2){
    return 'Gerente'
  } else {
    return 'Repositor'
  }
}

function Usuario({userData}){

  const { setToken, token } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);

  const [formData, setFormData] = useState({
    nome: nome.nome, 
    tipo: getTipo(token.token), 
  });

    return (
          <div className="profile">
            <a className="item-profile">
            <span className="item">
            <img src={profile} className='icons' alt="Profile" width="30px" height="30px"></img>
            <div className='texts'>
               <div className="text-profile" value={formData.nome}>{formData.nome}</div>
            <div className="text-profile" value={formData.tipo}>{formData.tipo}</div>
            </div>
           
            </span>
            </a>
          </div>
        
  );
}

export default Usuario;