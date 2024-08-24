import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import {withRouter} from 'react-router-dom';
import Popup from '../components/popuplogin';
import axios from 'axios';




function Formulario({navigation}){
    //const history = useNavigate();
    const navigate = useNavigate()
    const { setToken, token } = useContext(StoreContext);
    const { setCpf, cpf } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);

    
    const [formData, setFormData] = useState({
        login: '2001', 
        senha: '123', 
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const signIn = () => {
      console.log("Sign In!");
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
        
        if (formData.login == '2001' && formData.senha == '123'){
          setToken({token: 1});
          setCpf({cpf: "000.000.000-00"});
          setNome({nome: "John Doe"});
          navigate("comunidades",  { replace: false });
        }
        event.preventDefault();
      };
    

    return (
      <div className="principal">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        <div className='content'>
        <img src={logo} className='logo' alt="BookClub logo!"/>
            <div>
              <span class="loginFormTitle"></span>
              </div>
        <form onSubmit={handleSubmit}>
            <div className='form'>
  
                <label>
                    Login:<br/>
                    <input 
                        name="login" 
                        className='dadosLogin' 
                        value={formData.login}
                        onChange={handleInputChange} />
                </label>
                <label>
                    Senha:<br/>
                    <input 
                        name="senha" 
                        className='dadosLogin' 
                        value={formData.senha}
                        onChange={handleInputChange} />
                </label>
                <button className="logIn" type="submit"> Login </button>
                <button className= "signIn" type="" onClick={signIn}>Sign In</button>
            </div>
        </form>
        </div>
      </div>
        
        
  );
}

export default Formulario;