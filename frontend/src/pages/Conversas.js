import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {withRouter} from 'react-router-dom';
import axios from 'axios';
// import $ from 'jquery';

import logo from "../img/logo.png"
import Popup from '../components/popuplogin';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';

function createChamados(data) {
  const chamados = [];
    
    for (let i = 0; i < Object.keys(data.idchamado).length; i++) {
      chamados.push({
        id: data['idchamado'][i],
        nome: data['nomefuncionario'][i],
        departamento: data['departamento'][i],
        titulo: data['titulo'][i],
        assunto: data['assunto'][i],
      });
  }

  

  return chamados;
}

function Conversas({userData}){
    //const history = useNavigate();
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([]);
    const { setToken, token } = useContext(StoreContext);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [buttonDeletePopup, setDeletePopup] = useState(false);
    
    const[formData, setChamados] = useState({
            id: '2001',
            nome: 'Funcionario',
            departamento: '2',
            titulo: 'Chamado Teste',
            assunto: 'Assunto do Chamado',
    });
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setChamados((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    
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

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('http://127.0.0.1:5000/api/criaChamado', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Chamado criado com sucesso");
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
        window.alert("Erro ao criar chamado");
      });
  };

  const handleClearChamados = () => {
    setDeletePopup(true);
  }

  const handleSubmitDelete = (event) => {
    event.preventDefault();
    console.log(formData.id);

    axios.post('http://127.0.0.1:5000/api/deletaChamado', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setDeletePopup(false);
        handleCreateChamados(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

const handleCreateChamados = (event) => {
  event.preventDefault();
      
  axios.get('http://127.0.0.1:5000/api/getChamado')
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const table = createChamados(response.data)
      setTableData([...table])
    })
    .catch(error => {
      console.error('Erro ao enviar dados:', error);
    });
}


    return (
      <div className="mform">
        <div class = "text">Conversas</div>
        <form onSubmit={handleSubmit}>
           
            <div className='form-all'>
              <div class = "text">
                Abrir Chamado
              </div>
              <div class="form-row">
              <div class="input-data">
                <input 
                        name="nome" 
                        className='dadosChamado' 
                        value={formData.nome}
                        onChange={handleInputChange} required/>
                        <div class="underline"></div>
                    <label for="nome">
                    Nome
                    </label>
              </div>
              <div class="input-data">
                  <input 
                        name="departamento" 
                        className='dadosChamado' 
                        value={formData.departamento}
                        onChange={handleInputChange} required/>
                  <div class="underline"></div>
                <label for="departamento">
                    Departamento
                    
                </label>    
                </div>
                
                <div class = "input-data">
                  <input 
                        name="titulo" 
                        className='dadosChamado' 
                        value={formData.titulo}
                        onChange={handleInputChange} required />
                  <div class="underline"></div>
                <label for="titulo">
                    Titulo  
                </label>     
                </div>
                
              </div>
              <div className='form-row'>
              <div class = "input-data textarea">
              <textarea name="assunto" 
                        className='dadosChamado' 
                        value={formData.assunto}
                        onChange={handleInputChange} 
                        rows="8" cols="80" required>

              </textarea>
                <br />
                
                <div class="underline-textarea"></div>
                <label for="assunto">
                    Assunto
                </label>
                <br />
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

        <div className='Chamados'>
          <div class = "text">Chamados</div>
            <button className= "update-btn" onClick={handleCreateChamados}>Recarregar</button>
   
            <div className="mtable">
              <div class="table">
                <div class="table-header">

                  <div class="header__item">
                  <a id="id" class="filter__link filter__link--number" >
                   Id
                  </a>
                  </div>
                  <div class="header__item">
                  <a id="nome" class="filter__link filter__link--number" >
                   Nome
                  </a>
                  </div>
                  <div class="header__item">
                  <a id="departamento" class="filter__link filter__link--number">
                    Departamento</a>
                  </div>
                  <div class="header__item">
                  <a id="titulo" class="filter__link filter__link--number">
                    Titulo</a>
                  </div>
                  <div class="header__item">
                  <a id="assunto" class="filter__link filter__link--number">
                    Assunto</a>
                  </div>

                </div>
                <div class="table-content">
                  {
                    tableData.map((obj) => {
                      return (
                        <div class="table-row">
                          <div class="table-data">{obj.id}</div>
                          <div class="table-data">{obj.nome}</div>
                          <div class="table-data">{obj.departamento}</div>
                          <div class="table-data">{obj.titulo}</div>
                          <div class="table-data">{obj.assunto}</div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </div>
        </div>
      </div>
        
        
  );
}

export default Conversas;