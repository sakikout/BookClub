import React, { useState, useEffect, useContext } from 'react';
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import {withRouter} from 'react-router-dom';
import Popup from '../components/popuplogin';
import axios from 'axios';
import "../components/style/style.css";
import '../App.css';

const URL_API ='http://127.0.0.1:8080/api/' 

function Comunidades({navigation}){
    const navigate = useNavigate()
    const { setToken, token } = useContext(StoreContext);
    const { setUsuario, usuario } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const {comunidade, setComunidade} = useContext(StoreContext);

   const communities = [{id: "0", name: "Harry Potter", img: "https://m.media-amazon.com/images/I/81q77Q39nEL._SL1500_.jpg"}, 
                        {id: "1", name: "Game of Thrones", img:'https://m.media-amazon.com/images/I/71r9CosD5QL._SL1500_.jpg'},
                        {id: "2", name: "Me Before You", img:'https://m.media-amazon.com/images/I/71+YK9HSaJL._AC_UF1000,1000_QL80_.jpg'},
                        {id: "3", name: "Jogos Vorazes", img:'https://m.media-amazon.com/images/I/61zBhzjS4LL._AC_UF1000,1000_QL80_.jpg'},
                        {id: "4", name: "Diário de Banana", img:'https://m.media-amazon.com/images/I/71gWCy-KesL._AC_UF1000,1000_QL80_.jpg'},
                        {id: "5", name: "Bridgerton", img:'https://cdn.kobo.com/book-images/10ab6c9c-0a1d-4899-9dff-f29bab76774c/353/569/90/False/bridgerton-collection-volume-1.jpg'}] 
    
    //const userComunities = [{}]
    const [userComunities, setUserComunities] = useState([]);

    const entrouNaComunidade = (community) => {
        setComunidade({comunidade: community.name});

        const data = {
          id: community.id,
          usuario: nome.nome,
          comunidade: community.name,
          comunidadeImg: community.img
        }

        axios.post(URL_API + 'entraComunidade', data)
        .then(response => {
          console.log('Resposta do servidor:', response.data);
          //window.alert("Entrou na comunidade: " + community.name);
  
        })
        .catch(error => {
          console.error('Erro ao enviar dados:', error);
        });
    
        navigate("home",  { replace: false });
    };
    
    const getUserComunidades = () => {
  
      axios.get(URL_API + 'getComunidadesUsuario', {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          comunidade: comunidade.comunidade,
          usuario: nome.nome
        }
      })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setUserComunities(response.data.comunidades);

      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  
      
  };

  const createComunidades = () => {
    const comunidades_response = [];

    for (let community of communities){
      axios.post(URL_API + 'criaComunidade', community, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        comunidades_response.push(response.data.data);
  
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
    }

    //setUserComunities(comunidades_response)
    getUserComunidades()
    
    
};

const loadComunidades = () => {
  createComunidades()
  getUserComunidades()
  
};

    return (
      <div className="principal" onLoad={createComunidades}>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>

        <div className='content-comunidades'>
          <div className='comunidades'>
            <label className="labelComunidades">Suas Comunidades</label>
            { userComunities ?
            <div className="communities-list">
                    {userComunities.map((userComunity) => (
                        <div className="community-item" key={userComunity.id} onClick={() => entrouNaComunidade(userComunity)}>
                          <div className="community-card">
                            <div className="community-img">
                              <img src={userComunity.img} alt={userComunity.nome}></img>
                            </div>
                            <span className='community-name'>{userComunity.nome}</span>
                          </div>
                        </div>
                    ))}
                
            </div>
            : 
            <div className="communities-list">
              <label className="labelComunidades">Não há comunidades</label>
              </div>}
          </div>
        
          <div className='comunidades'>
            <label className="labelComunidades">Comunidades Disponíveis</label>
            <div className="communities-list">
                    {communities.map((community) => (
                        <div className="community-item" key={community.id} onClick={() => entrouNaComunidade(community)}>
                          <div className="community-card">
                            <div className="community-img">
                              <img src={community.img} alt={community.name}></img>
                            </div>
                            <span className='community-name'>{community.name}</span>
                          </div>
                        </div>
                    ))}
            </div>
          </div>
          
        </div>
      </div>
        
        
  );
}

export default Comunidades;