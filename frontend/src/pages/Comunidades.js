import React, { useState, useEffect, useContext } from 'react';
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import {withRouter} from 'react-router-dom';
import Popup from '../components/popuplogin';
import axios from 'axios';


function Comunidades({navigation}){
    const navigate = useNavigate()
    const { setToken, token } = useContext(StoreContext);
    const { setCpf, cpf } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const {comunidade, setComunidade} = useContext(StoreContext);

   const communities = [{id: 0, name: "Harry Potter"}, {id: 1, name: "Game of Thrones"}, {id: 2, name: "Bridgerton"}] 

    const entrouNaComunidade = (community) => {
        console.log("Entrou na comunidade: " + community.name + " " + community.id);
        setComunidade({comunidade: community.name})
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
        <div className='content'>
        <div className="communities-list">
            <ul>
                {communities.map((community) => (
                    <div className="community-item" key={community.id} onClick={() => entrouNaComunidade(community)}>
                        {community.name}
                    </div>
                ))}
            </ul>

        </div>
        </div>
      </div>
        
        
  );
}

export default Comunidades;