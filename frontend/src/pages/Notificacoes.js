import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';
import '../components/style/style.css';
import logo from "../img/logo.png"
import Popup from '../components/popuplogin';
import StoreContext from '../components/Store/Context';

function createRandomNotifications(count = 5) {
  const notifications = [];
  var d = new Date();
  
  for (let i = 0; i < count; i++) {
    notifications.push({
      id: crypto.randomUUID(),
      usuario: crypto.randomUUID(),
      nome: "John Doe",
      tipo: "message",
      titulo: "Nova Mensagem",
      conteudo: "TÁ PAGANDO MUITO",
      data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
    });
  }

  notifications.push({
    id: crypto.randomUUID(),
    usuario: crypto.randomUUID(),
    nome: "Elon Musk",
    tipo: "comment",
    titulo: "Novo Comentário",
    conteudo: "Kekw",
    data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
  });

  return notifications;
}


function Notificacoes({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const { setToken, token } = useContext(StoreContext);
    const [tableData, setTableData] = useState([]);
    
    /*

    function createVenda(input){
      var jqXHR = $.ajax({
          type: "POST",
          url: "/api/createVenda",
          async: false,
          data: { data: input}
      });
  
      return jqXHR.responseText;
      // return jqXHR;
  }

  function returnVendas(input){
    var data = $.ajax({
        type: "POST",
        url: "/api/returnVendas",
        async: false,
        data: { data: input}
    });

    sendVendas(data);
  }
  */

  useEffect(() => {
    fetchData();
    handleCreateNotifications();
  });

  const fetchData = async () => {
    try {
      /*
      const response = await fetch("https://cities-qd9i.onrender.com/agents");
      const agents = await response.json();
      
      setTableData(agents);
      */
     console.log(tableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearNotifications = () => {
    setTableData([]);
  }

const handleCreateNotifications = () => {
  if (tableData.length < 1){
    const newUsers = createRandomNotifications()
    setTableData([...tableData, ...newUsers])
  }
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
                <div className="profile-pic"></div>
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