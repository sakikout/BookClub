import React, { useState, useEffect, useContext } from 'react';
import '../App.css';
import logo from "../img/logo.png"
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import {withRouter} from 'react-router-dom';
import Popup from '../components/popuplogin';
import PopupSignIn from '../components/Popup';
import axios from 'axios';

const URL_API ='http://127.0.0.1:8080/api/' 

function Formulario({navigation}){
    const navigate = useNavigate()
    const [buttonPopup, setButtonPopup] = useState(false);
    const { setToken, token } = useContext(StoreContext);
    const { setUsuario, usuario } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const { setFoto, foto } = useContext(StoreContext);
    const { setColor, color} = useContext(StoreContext);
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const [formData, setFormData] = useState({
        usuario: '2001', 
        senha: '123', 
    });

    const [formSignIn, setFormSignIn] = useState({
      nome: 'John Doe',
      usuario: 'John2001', 
      senha: '123', 
      foto: ''
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

    const handleInputChangeSignIn = (event) => {
      const { name } = event.target;

      if (name === 'foto') {
        const file = event.target.files[0];
        setFormSignIn((prevData) => ({
          ...prevData,
          foto: file,
        }));
        setImageURL(URL.createObjectURL(file));
      } else {
        const { value } = event.target;
        setFormSignIn((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    };

    const handleSignIn = () => {
      console.log("Sign In!");
      
      setButtonPopup(true);
    };

    // Função para limpar o formulário
  const clearForm = () => {
    setFormSignIn({
      nome: 'John Doe',
      usuario: 'John2001', 
      senha: '123', 
      foto: ''
    });
    setImageURL(null);
    
    document.getElementById('image-input').value = ''; // Para limpar o campo de arquivo (input file)
  };

    const handleSubmit = (event) => {
      event.preventDefault();
      axios.post(URL_API + 'login', formData)
      .then(response => {
        if(response.data.error !== true){
            setToken({token: 1});
            setUsuario({usuario: response.data.nome});
            setNome({nome: response.data.usuario});
            setFoto({foto: response.data.foto});
            console.log(response.data)
            if (response.data.color){
               setColor({color: response.data.color})
            } else {
              setColor({color: getRandomColor()})
            }
           
            navigate("comunidades",  { replace: false });
        } else {
          window.alert("Erro ao fazer login! Verifique seu usuário e senha e tente novamente.");
        }
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
    };

    const getRandomColor = () => {
      const randomIndex = Math.floor(Math.random() * colors.length)
      return colors[randomIndex]
    }

    const handleSubmitModal = (event) => {
      event.preventDefault();

      const data = new FormData();
      data.append('nome', formSignIn.nome);
      data.append('usuario', formSignIn.usuario);
      data.append('senha', formSignIn.senha);
      data.append('foto', formSignIn.foto);

      axios.post(URL_API + 'criaUsuario', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        window.alert("Usuário Criado!");
        clearForm();
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
    };

    return (
      <div className="principal">
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
        
        <div className='content'>
          <img src={logo} className='logo' alt="BookClub logo!"/>
            <div>
              <span className="loginFormTitle"></span>
              </div>
          <form onSubmit={handleSubmit}>
            <div className='form'>
                <label className="loginLabel">
                    Usuário:<br/>
                    <input 
                        name="usuario" 
                        className='dadosLogin' 
                        value={formData.usuario}
                        onChange={handleInputChange} />
                </label>
                <label className="senhaLoginLabel">
                    Senha:<br/>
                    <input 
                        name="senha" 
                        className='dadosLogin' 
                        type="password"
                        value={formData.senha}
                        onChange={handleInputChange} />
                </label>

                <div className='divButtons'>
                  <button className="logIn" type="submit"> LogIn </button>
                  <button className= "signIn" type="button" onClick={handleSignIn}>Sign In</button>
                </div>
                
            </div>
          </form>
        </div>

        <PopupSignIn trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Criar Usuário</div>
            <form onSubmit={handleSubmitModal}>
              <div className="form-row-sing">
                <div className="input-foto">
                  <label className='modalLabel' htmlFor="file-input">
                    Foto
                  </label>

                  {!imageURL ? (
                    <label htmlFor="file-input" className="circle-input-label">
                      <input 
                        type="file" 
                        id="file-input" 
                        name="foto"
                        onChange={handleInputChangeSignIn} 
                        className="circle-input"
                      />
                    </label>
                  ) : (
                    <label htmlFor="file-input" className="circle-input-label-after">
                      <input 
                        type="file" 
                        id="file-input" 
                        name="foto"
                        onChange={handleInputChangeSignIn} 
                        className="circle-input"
                      />
                    </label>
                  )}
                </div>

                <div className="inputs-right">
                  <div className="input-modal">
                    <label className='modalLabel' htmlFor="nome">
                      Nome
                    </label>
                    <input 
                      name="nome" 
                      id="nome"
                      className='dadosUsers' 
                      value={formSignIn.nome}
                      onChange={handleInputChangeSignIn} required/>
                  </div>

                  <div className="input-modal">
                    <label className='modalLabel' htmlFor="usuario">
                      Nome de Usuário
                    </label>
                    <input 
                      name="usuario" 
                      id="usuario"
                      className='dadosUsers' 
                      value={formSignIn.usuario}
                      onChange={handleInputChangeSignIn} required />
                  </div>

                  <div className="input-modal">
                    <label className='modalLabel' htmlFor="senha">
                      Senha
                    </label>
                    <input 
                      name="senha" 
                      id="senha"
                      type="password"
                      className='dadosUsers' 
                      value={formSignIn.senha}
                      onChange={handleInputChangeSignIn} required />
                  </div>
                </div>
              </div>

              <button className= "modalButton" type="submit">Criar</button>
            </form> 
          </div>
        </PopupSignIn>
      </div>
    );
}

export default Formulario;
