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
    usuario: '',
    nome: '',
    imagemPerfil: '',
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

    axios.post('http://127.0.0.1:5000/api/criaUsario', formData)
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

    axios.post('http://127.0.0.1:5000/api/deletaUsuario', formData)
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
    
    
    axios.get('http://127.0.0.1:5000/api/getUsuarios')
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
          <div className = "text-title">Configurações</div>
          <div className="options">
            <div className="options-profile">
              <div className="options-item">Alterar Usuário</div>
              <div className="options-item">Alterar Nome</div>
              <div className="options-item">Alterar Imagem de Perfil</div>
            </div>

            <div className="options-password">
            <div className="options-item">Alterar Senha</div>
            </div>
            <div className="options-delete">
              <div className="options-item">Deletar Conta</div>
            </div>
          </div>
        </div>
  );
}

export default Configuracoes;