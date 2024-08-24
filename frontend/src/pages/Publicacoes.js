import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';



function Publicacoes({userData}){

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const { setToken, token } = useContext(StoreContext);
  const { setCpf, cpf } = useContext(StoreContext);


  const[formData, setCaixa] = useState({
    idope: cpf.cpf,
    idcaixa: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCaixa((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('http://127.0.0.1:5000/api/entraCaixa', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Entrada no caixa feita com sucesso!");
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
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

  return (
    <div className="mform">
      <div className = "text">Publicações</div>
      <form onSubmit={handleSubmit}>
        
        { token.token == 1 ? 
          <div className='form-all'>
            <div class = "text">
              Entrar Caixa
            </div>
            <div class="form-row">
              <div class="input-data">
                
                <input 
                   name="solicitante" 
                   className='dadosEncomenda' 
                   value={formData.idope}
                   onChange={handleInputChange} required/>
                <label for="solicitante">
                  Operador
                </label>
                <div class="underline"></div>
              </div>
            </div>
            <div className="form-row">
              <div class="input-data">
                 
                <input 
                   name="idcaixa" 
                   className='dadosEncomenda' 
                   value={formData.idcaixa}
                   onChange={handleInputChange} required/>
                <label for="cdprod">
                  Caixa
                </label>
                 <div class="underline"></div>
              </div>
            </div>
             
            <div class="form-row submit-btn">
              <div class="input-data">
                <div class="inner"></div>
                  <input type="submit" value="submit"/>
                </div>
              </div>
            </div> : ""}
      </form>
    </div>
  );

}

export default Publicacoes;