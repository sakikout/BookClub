import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import {withRouter} from 'react-router-dom';
import Popup from '../components/popuplogin';
import PopupSignIn from '../components/Popup';
import axios from 'axios';




function Formulario({navigation}){
    //const history = useNavigate();
    const navigate = useNavigate()
    const [buttonPopup, setButtonPopup] = useState(false);
    const { setToken, token } = useContext(StoreContext);
    const { setUsuario, usuario } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const { setColor, color} = useContext(StoreContext);

    
    const [formData, setFormData] = useState({
        login: '2001', 
        senha: '123', 
    });

    const colors = ['#FF69B4', '#FF4500', '#FFA500', '#FFD700', '#EE82EE',
      '#FF00FF', '#6A5ACD',  '#7CFC00', '#32CD32', '#00FF7F', '#00FFFF', '#1E90FF',
      '#A0522D', '#FFF0F5', '#696969', '#FF0000', '#B22222'
     ];
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    const handleSignIn = () => {
      console.log("Sign In!");
      setButtonPopup(true);
    };

    const handleSubmit = (event) => {
      
  
      axios.post('http://127.0.0.1:5000/api/login', formData)
      .then(response => {
        
        if(response.data.error != true){
            setToken({token: 1});
            setUsuario({usuario: response.data.usuario});
            setNome({nome: response.data.nome});
            setColor({color: response.data.color})
            navigate("home",  { replace: false });

        } else {
          window.alert("Erro ao fazer login! verifique seu usuario e senha e tente novamente.");
        }
        
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  
        
        if (formData.login == '2001' && formData.senha == '123'){
          setToken({token: 1});
          setUsuario({usuario: "jonhdoe01"});
          setNome({nome: "John Doe"});
          setColor({color: getRandomColor()})
          navigate("comunidades",  { replace: false });
        }
        event.preventDefault();
      };

      const getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * colors.length)
        return colors[randomIndex]
      }

      const handleSubmitModal = (event) => {
        event.preventDefault();
        console.log(formData.nome);
    
        axios.post('http://127.0.0.1:5000/api/criaUsuario', formData)
          .then(response => {
            console.log('Resposta do servidor:', response.data);
            setButtonPopup(false);
    
          })
          .catch(error => {
            console.error('Erro ao enviar dados:', error);
          });
      }
    

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
  
                <label className="loginLabel">
                    Login:<br/>
                    <input 
                        name="login" 
                        className='dadosLogin' 
                        value={formData.login}
                        onChange={handleInputChange} />
                </label>
                <label className="senhaLoginLabel">
                    Senha:<br/>
                    <input 
                        name="senha" 
                        className='dadosLogin' 
                        value={formData.senha}
                        onChange={handleInputChange} />
                </label>
                <button className="logIn" type="submit"> Login </button>
                <button className= "signIn" type="button" onClick={handleSignIn}>Sign In</button>
            </div>
        </form>
        
        </div>
        <PopupSignIn trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Criar Usuário</div>
            <form onSubmit={handleSubmitModal}>
            <div class="form-row">
              <div class="input-modal">
                <label className='modalLabel' for="cdprod">
                  Nome
                </label>
                <input 
                      name="nome" 
                      className='dadosUsers' 
                      value={formData.nome}
                      onChange={handleInputChange} required/>
              </div>

              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Nome de Usuário
                </label>
                <input 
                      name="usuario" 
                      className='dadosUsers' 
                      value={formData.usuario}
                      onChange={handleInputChange} required />
              </div>
              </div>
              <div class="form-row">

              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Senha
                </label>
                <input 
                      name="senha" 
                      className='dadosUsers' 
                      value={formData.senha}
                      onChange={handleInputChange} required />
              </div>
              </div>

              <div class="form-row">
              </div>
              <button className= "modalButton" 
              type = "submit"
             >Criar</button>
              </form> 
          </div>
        </PopupSignIn>
      </div>
        
        
  );
}

export default Formulario;