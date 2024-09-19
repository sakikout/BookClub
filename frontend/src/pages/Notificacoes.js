import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';
import '../components/style/style.css';
import StoreContext from '../components/Store/Context';

const URL_API ='http://127.0.0.1:8080/api/' 

function createNotificacoes(data) {
  const notifications = [];
    for (let i = 0; i < data.notificacoes.length; i++) {
      notifications.push({
        id: data.notificacoes[i].id,
        usuario: data.notificacoes[i].usuario,
        nome: data.notificacoes[i].nome,
        conteudo: data.notificacoes[i].conteudo,
        titulo: data.notificacoes[i].titulo,
        data: data.notificacoes[i].data,
        foto: data.notificacoes[i].foto,
      });
  }
  console.log(notifications)
  return notifications;
}


function Notificacoes({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const { setToken, token } = useContext(StoreContext);
    const [tableData, setTableData] = useState([]);
    const { setUsuario, usuario } = useContext(StoreContext);
    const { setNome, nome } = useContext(StoreContext);
    const { setComunidade, comunidade } = useContext(StoreContext);

  const handleClearNotifications = () => {
    setTableData([]);
  }


useEffect(() => {
  handleLoadNotitifications();

  const interval = setInterval(() => {
    handleLoadNotitifications();
  }, 5000); 

  return () => clearInterval(interval);
}, [comunidade]);

const handleLoadNotitifications = () => {

  axios.get(URL_API + 'getNotificacoes', {
    headers: {
      'Content-Type': 'application/json'
    },
    params: {
      usuario: nome.nome
    }
  })
  .then(response => {
    console.log('Resposta do servidor:', response.data);
    const newNotifications = createNotificacoes(response.data)
    setTableData([...newNotifications])

  })
  .catch(error => {
    console.error('Erro ao receber dados:', error);
  });
}


    return (
    <div className="container">
      <div className="mform">
        <div className="notifications">
        {
          tableData.map((obj) => {
            return (
              <div className="notification" key={obj.id}>
                <div className="notifications-left">
                {obj.foto ? 
                    (<img src={obj.foto} alt="Uploaded" className="profile-pic"/>) 
                    :(
                      <div className="profile-pic"></div>
                    )}
                <div className="notification-main">
                    <div className="notification-title"> {obj.titulo}</div>
                    <div className="full-name">{obj.usuario}</div> 
                    <div className="notification-content"> {obj.conteudo}</div>
                </div>
                </div>
                  <div className="notifications-right">
                    <div className="notification-date">{obj.data}</div>
                  </div>
                
              </div>
            );
          })
        }
        
     
    </div>
      
    </div>
    </div>
        
  );
}

export default Notificacoes;