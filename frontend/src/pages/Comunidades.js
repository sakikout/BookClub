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

   const communities = [{id: 0, name: "Harry Potter", img: "https://m.media-amazon.com/images/I/81q77Q39nEL._SL1500_.jpg"}, {id: 1, name: "Game of Thrones", img:'https://m.media-amazon.com/images/I/71r9CosD5QL._SL1500_.jpg'}, {id: 2, name: "Bridgerton", img:'https://cdn.kobo.com/book-images/10ab6c9c-0a1d-4899-9dff-f29bab76774c/353/569/90/False/bridgerton-collection-volume-1.jpg'}] 

    const entrouNaComunidade = (community) => {
        setComunidade({comunidade: community.name});

        const data = {
          usuario: nome.nome,
          comunidade: community.name
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


    const handleSubmit = (event) => {
      
    /*
      axios.post('http://127.0.0.1:5000/api/login', formData)
      .then(response => {
        
        if(response.data.error != true){
          if(response.data.option == 1){
            setToken({token: 1});
            setCpf({cpf: response.data.cpfop});
            setNome({nome: response.data.opnome});
            navigate("Home",  { replace: false });
          } else if(response.data.option == 2){
            setToken({token: 2});
            setCpf({cpf: response.data.cpfge});
            setNome({nome: response.data.gernome});
            navigate("Home",  { replace: false });
          } else if(response.data.option == 3){
            setToken({token: 3});
            setCpf({cpf: response.data.cpfrep});
            setNome({nome: response.data.repnome});
            navigate("Home",  { replace: false });
          }
          
        } else {
          window.alert("Erro ao fazer login! verifique seu usuario e senha e tente novamente.");
        }
        
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
      */
        navigate("home",  { replace: false });
  
        event.preventDefault();
      };

    return (
      <div className="principal">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <div ></div>
        
        <div className='content'>
        <label className="labelComunidades">Comunidades:</label>
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
        
        
  );
}

export default Comunidades;