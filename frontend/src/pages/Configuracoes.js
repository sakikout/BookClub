import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'

import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';
import axios from 'axios';


function createRandomUsers(data) {
  const users = [];
  
  for (let i = 0; i < Object.keys(data).length; i++) {
    users.push(data[i]);
  }

  return users;
}

function Configuracoes({userData}){
  const [tableData, setTableData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonDeletePopup, setDeletePopup] = useState(false);

  const { setToken, token } = useContext(StoreContext);

  const[formData, setFunc] = useState({
    cpf: '',
    nome: '',
    funcao: '',
    senha: '',
    salario: 0,
    intervalo: '',
    setor: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFunc((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
     console.log(tableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClearUsers = () => {
    setTableData([]);
  }

  const handleCreateUsers = () => {
    setButtonPopup(true);
  }

  const handleDelete = () => {
    setDeletePopup(true);
  }

  const handleSubmitModal = (event) => {
    event.preventDefault();
    console.log(formData.cpf);

    axios.post('http://127.0.0.1:5000/api/criaFuncionario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        handleGetUsers(event)

      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleSubmitDelete = (event) => {
    event.preventDefault();
    console.log(formData.cpf);

    axios.post('http://127.0.0.1:5000/api/deletaFuncionario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setDeletePopup(false);
        handleGetUsers(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleGetUsers = (event) => {
      
    event.preventDefault();
    
    
    axios.get('http://127.0.0.1:5000/api/getFuncionario')
      .then(response => {
        console.log('Resposta do servidor:', response.data);          
        const table = createRandomUsers(response.data)
        setTableData([...table])
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
      
  }

    return (
        <div className="mform">
          <div className = "text">Configurações</div>
          <button className= "update-btn" onClick={handleGetUsers}>Recarregar...</button>
          <button className= "update-btn" onClick={handleCreateUsers}>Criar</button>
          <button className= "delete-btn" onClick={handleDelete}>Deletar</button>

      <div class="table">
      <div class="table-header">
          
        <div class="header__item">
          <a id="cpf" class="filter__link filter__link--number" >
            CPF
          </a>
          </div>
          <div class="header__item">
          <a id="nome" class="filter__link filter__link--number">
            Funcionário</a>
          </div>
          <div class="header__item">
          <a id="funcao" class="filter__link filter__link--number">
            Função</a>
          </div>
          <div class="header__item">
          <a id="salario" class="filter__link filter__link--number">
            Salário</a>
          </div>
          <div class="header__item">
          <a id="dataInicio" class="filter__link filter__link--number">
            Data Início</a>
          </div>
          <div class="header__item">
          <a id="horaIntervalo" class="filter__link filter__link--number">
            Hora de Intervalo</a>
          </div>

        </div>
        <div class="table-content">
          {
            tableData.map((obj) => {
              return (
                <div class="table-row">
                  <div class="table-data">{obj.cpf}</div>
                  <div class="table-data">{obj.nome}</div>
                  <div class="table-data">{obj.funcao}</div>
                  <div class="table-data">{obj.salario}</div>
                  <div class="table-data">{obj.dataInicio}</div>
                  <div class="table-data">{obj.horaIntervalo}</div>
                </div>
              );
            })
          }
        </div>
      </div>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <div className='container-modal'>
            <div className="text-modal">Criar Funcionario</div>
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
                  CPF
                </label>
                <input 
                      name="cpf" 
                      className='dadosUsers' 
                      value={formData.cpf}
                      onChange={handleInputChange} required />
              </div>
              </div>
              <div class="form-row">
              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Função
                </label>
                <input 
                      name="funcao" 
                      className='dadosUsers' 
                      value={formData.funcao}
                      onChange={handleInputChange} required />
              </div>

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
              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Salario
                </label>
                <input 
                      name="salario" 
                      className='dadosUsers' 
                      value={formData.salario}
                      onChange={handleInputChange} required />
              </div>

              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Intervalo
                </label>
                <input 
                      name="intervalo" 
                      className='dadosUsers' 
                      value={formData.intervalo}
                      onChange={handleInputChange} required />
              </div>
              </div>
              <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Setor (Repositor)
                </label>
                <input 
                      name="setor" 
                      className='dadosUsers' 
                      value={formData.setor}
                      onChange={handleInputChange} required />
              </div>

              <button className= "modalButton" 
              type = "submit"
             >Atualizar</button>
              </form> 
          </div>
        </Popup>

        <Popup trigger={buttonDeletePopup} setTrigger={setDeletePopup}>
          <div className='container-modal'>
            <div className="text-modal">Deleta Funcionario</div>
            <form onSubmit={handleSubmitDelete}>
            <div class = "input-modal">
                <label className='modalLabel' for="quantidade">
                  Função
                </label>
                <input 
                      name="funcao" 
                      className='dadosUsers' 
                      value={formData.funcao}
                      onChange={handleInputChange} required />
              </div>
              <div class="input-modal">
              <label className='modalLabel' for="cdprod">
                  CPF
                </label>
                  <input 
                        name="cpf" 
                        className='dadosUsers' 
                        value={formData.id}
                        onChange={handleInputChange} required/>
                  
                </div>
              <button className= "modalButton" 
              type = "submit"
             >Excluir</button>
              </form> 
          </div>
        </Popup>
      
        </div>
  );
}

export default Configuracoes;