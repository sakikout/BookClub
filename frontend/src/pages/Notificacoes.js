import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';

import '../components/style/style.css';
import logo from "../img/logo.png"
import Popup from '../components/popuplogin';
import StoreContext from '../components/Store/Context';

function createRandomVendas(count = 5) {
  const vendas = [];
  
  for (let i = 0; i < count; i++) {
    vendas.push({
      idVenda: 440 + i,
      cpf: 2001,
      valor: 247.50 + (i * 5),
      dataVenda: '01-01-2024'
    });
  }

  return vendas;
}


function Notificacoes({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const { setToken, token } = useContext(StoreContext);
    const [tableData, setTableData] = useState([]);
    
    const[formData, setVenda] = useState({
            idVenda: 0,
            cpf: 0,
            valor: 0,
            dataVenda: '01-01-2024'
        
    });

    const sendVendas = (data) => {
        setVenda(data);
    }

    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setVenda((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };
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
  }, []);

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

  const handleClearVendas = () => {
    setTableData([]);
  }

const handleCreateVendas = () => {
    const newUsers = createRandomVendas()
    setTableData([...tableData, ...newUsers])
}

  const handleSubmit = (event) => {
    event.preventDefault();
    
    /*axios.post('http://127.0.0.1:5000/api/sendDados', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });*/
  };



    return (
      <div className="container">
      <div className="mform">
      <div className = "text">Notificações</div>
      <form onSubmit={handleSubmit}>
         
          <div className='form-all'>
            <div class = "text">
              Nova Venda
            </div>
            <div class="form-row">
              
              <div class = "input-data">
                <input 
                      name="data" 
                      className='dadosVenda' 
                      value={formData.data}
                      onChange={handleInputChange} required />
                <div class="underline"></div>
              <label for="data">
                  Data  
              </label>     
              </div>
              <div class="input-data">
              <input 
                      name="valor" 
                      className='dadosVenda' 
                      value={formData.valor}
                      onChange={handleInputChange} required/>
                      <div class="underline"></div>
                  <label for="valor">
                  Valor
                  </label>
            </div>
            </div>
       
            
              <div class="form-row submit-btn">
                <div class="input-data">
                  <div class="inner"></div>
                    <input type="submit" value="submit"/>

                </div>
              </div>
              
              
          </div>
      </form>
      <div className='encomendasFeitas'>
      <div class = "text">Vendas Feitas</div>
    <button className= "update-btn" onClick={handleCreateVendas}>Criar</button>
    <button className= "delete-btn" onClick={handleClearVendas}>Deletar</button>
        <div className="mtable">
   
    <div class="table">
    <div class="table-header">
        
    <div class="header__item">
      <a id="idVenda" class="filter__link">
        ID</a>
      </div>
      <div class="header__item">
        <a id="cpf" class="filter__link filter__link--number" >
         ID Funcionário
        </a>
        </div>
        <div class="header__item">
        <a id="data" class="filter__link filter__link--number">
          Data</a>
        </div>
        <div class="header__item">
        <a id="valor" class="filter__link filter__link--number">
          Valor</a>
        </div>

      </div>
      <div class="table-content">
        {
          tableData.map((obj) => {
            return (
              <div class="table-row">
                <div class="table-data">{obj.idVenda}</div>
                <div class="table-data">{obj.cpf}</div>
                <div class="table-data">{obj.data}</div>
                <div class="table-data">{obj.valor}</div>
              </div>
            );
          })
        }
      </div>
    </div>
      </div>

      </div>
    </div>
      
    </div>
        
  );
}

export default Notificacoes;