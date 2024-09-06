import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';

import logo from "../img/logo.png"
import sendImg from "../icons/send-svg.png"
import Popup from '../components/popuplogin';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';

function createMessages(data) {
  const messages = [];
    for (let i = 0; i < Object.keys(data.id).length; i++) {
      messages.push({
        usuario: data['usuario'][i],
        nome: data['nome'][i],
        conteudo: data['conteudo'][i],
        color: data['color'][i]
      });
  }

  return messages;
}

function createRandomMessages() {
  const messages = [];
  const colors = ['#FF69B4', '#FF4500', '#FFA500', '#FFD700', '#EE82EE',
    '#FF00FF', '#6A5ACD',  '#7CFC00', '#32CD32', '#00FF7F', '#00FFFF', '#1E90FF',
    '#A0522D', '#FFF0F5', '#696969', '#FF0000', '#B22222'
   ];
    
    for (let i = 0; i < 5; i++) {
      let randomIndex = Math.floor(Math.random() * colors.length)
      messages.push({
        usuario: crypto.randomUUID(),
        nome: "Random User " + i,
        conteudo: "Olá!",
        color: colors[randomIndex]
      });
  }

  return messages;
}

function Conversas({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const { setToken, token } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const { setComunidade, comunidade } = useContext(StoreContext);
    const { setColor, color } = useContext(StoreContext);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [buttonDeletePopup, setDeletePopup] = useState(false);
    
    const[formData, setMessage] = useState({
            nome: nome,
            comunidade: comunidade,
            conteudo: '',
            color: color
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setMessage((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    
    useEffect(() => {
      fetchData();
    });
  
    const fetchData = async () => {
      try {
        const chatMessages = document.querySelector(".chatMessages")
        if (tableData.length < 1){
          const newUsers = createRandomMessages();
          setTableData([...tableData, ...newUsers])
        }
        for (let i = 0; i < tableData.length; i++){
          const element = createMessageOtherElement(tableData[i].conteudo, tableData[i].usuario, tableData[i].color);
          chatMessages.appendChild(element)
        }
       console.log(tableData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://127.0.0.1:5000/api/criarMensagem', formData)
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      setDeletePopup(false);
      handleLoadMessages(event)
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });

    console.log(comunidade)
    console.log(nome)
    console.log(color)

    // all lines below in this function will be deleted when the backend works

    const elementSelf = createMessageSelfElement(formData.conteudo)
    const chatMessages = document.querySelector(".chatMessages")
    chatMessages.appendChild(elementSelf)

  };


const handleLoadMessages = (event) => {
  event.preventDefault();
  
  axios.get('http://127.0.0.1:5000/api/getMessages')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const table = createMessages(response.data)
      setTableData([...table])

      
    
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
  
 
}

  const createMessageSelfElement = (content) => {
     // it will be deleted when the backend works.
    const div = document.createElement('div')
    div.classList.add('messageSelf')
    div.innerHTML = content
    return div
  }

  const createMessageOtherElement = (content, user, userColor) => {
    // it will be deleted when the backend works.
    const div = document.createElement('div');
    const span = document.createElement('span');
    div.classList.add('messageOther');
    span.classList.add('messageUser');
    span.style.color = userColor;
    div.appendChild(span);
    span.innerHTML = user;
    div.innerHTML += content;
    return div;
  }

  /*  Formato de Mensagens no Chat
  
  <div className='messageSelf'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sollicitudin enim et risus pharetra, in mattis tellus efficitur. Sed egestas enim viverra ante tincidunt eleifend. Etiam dui diam, imperdiet eu hendrerit a, facilisis nec arcu. Duis laoreet nulla et eleifend suscipit. Aenean pellentesque ornare volutpat. Curabitur quis faucibus velit, a lobortis tellus. Aliquam sit amet libero sed enim bibendum interdum.
Maecenas non est varius, lacinia massa sed, congue turpis. Sed bibendum magna imperdiet commodo volutpat. Donec elementum diam tellus, vel hendrerit quam pretium vitae. Etiam aliquam justo sit amet pharetra maximus. Donec non odio nec purus aliquam malesuada. Ut finibus nulla tortor, et venenatis felis faucibus sed. </div> 
  <div className='messageOther'>
                <span className='messageUser'>{obj.usuario}</span>
                {obj.content}
              </div>

 {
  tableData.map((obj) => {
    return (
      <div className='messageOther'>
        <span className='messageUser'>{obj.usuario}</span>
        {obj.conteudo}
      </div>
    );
  })
  }
*/



    return (
      <div className = "mform">
        <div className="topText">
          <div className = "chatText">{comunidade.comunidade} Chat</div>
        </div>
        <section className="chat">
          <section className="chatMessages">
        
          </section>
          <div className="chatBackground">
          <form className="chatForm" onSubmit={handleSubmit}>
            <input 
            name= 'conteudo'
            type="text" 
            className="chatInput" 
            placeholder='Digite uma mensagem'
            value={formData.conteudo}
            onChange={handleInputChange} 
            ></input>
            <button type="submit" className="chatButton">
              <img src={sendImg} className='send-img' alt='send'></img>
            </button>
          </form>
          </div>
        </section>
          
      </div>
        
        
  );
}

export default Conversas;