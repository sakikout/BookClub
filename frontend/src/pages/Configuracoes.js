import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'

import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';
import axios from 'axios';

function createRandomPosts() {
  const posts = [];
  var d = new Date();

  posts.push({
    id: crypto.randomUUID(),
    usuario: "johndoe01",
    nome: "John Doe",
    conteudo: "Baniram o Twitter :(",
    data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear(),
    comentarios: [
      {
      id: crypto.randomUUID(),
      usuario: "marysue10000",
      nome: "Mary Sue",
      conteudo: "Paia né!",
      data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
      },
      {
        id: crypto.randomUUID(),
        usuario: "elonmusk24",
        nome: "Elon Musk",
        conteudo: "I'm sorry brazilians",
        data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
        }
    ],
    curtidas: 1
  });

  posts.push({
    id: crypto.randomUUID(),
    usuario: "johndoe01",
    nome: "John Doe",
    conteudo: "Não aguento mais!",
    data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear(),
    comentarios: [
      {
      id: crypto.randomUUID(),
      usuario: "marysue10000",
      nome: "Mary Sue",
      conteudo: "Eu também não.",
      data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
      },
      {
        id: crypto.randomUUID(),
        usuario: "elonmusk24",
        nome: "Elon Musk",
        conteudo: "Can you guys speak in English?",
        data: d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
        }
    ],
    curtidas: 2
  });


  return posts;
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
    console.log(formData.usuario);

    axios.post('http://127.0.0.1:5000/api/criaUsario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        handleGetPosts(event)

      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const handleSubmitDelete = (event) => {
    event.preventDefault();
    console.log(formData.usuario);

    axios.post('http://127.0.0.1:5000/api/deletaUsuario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setDeletePopup(false);
        handleGetPosts(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }
  const handleSubmitDeletePost = (event, obj) => {
    event.preventDefault();
    console.log(formData.usuario);

    axios.post('http://127.0.0.1:5000/api/deletaPublicacao', obj)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        handleGetPosts(event)
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }
  const handleGetPosts = (event) => {

    event.preventDefault();
    axios.get('http://127.0.0.1:5000/api/getPublicacoesUsuario')
      .then(response => {
        console.log('Resposta do servidor:', response.data);     
        const table = createRandomPosts(response.data)
        setTableData([...table])     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
      
  }

  const handleLoadPosts = () => {
    const posts = [];

    posts.push({
      id: crypto.randomUUID(),
      usuario: "johndoe01",
      nome: "John Doe",
      conteudo: "Baniram o Twitter :(",
      data: Date.now(),
      comentarios: [
        {
        id: crypto.randomUUID(),
        usuario: "marysue10000",
        nome: "Mary Sue",
        conteudo: "Paia né!",
        data: Date.now()
        },
        {
          id: crypto.randomUUID(),
          usuario: "elonmusk24",
          nome: "Elon Musk",
          conteudo: "I'm sorry brazilians",
          data: Date.now()
          }
      ],
      curtidas: 1
    });

    const dados_post = createRandomPosts()
    setTableData([...dados_post])   
  }

  const showOptions = (divName) => {
    const element = document.querySelector("." + divName);
    if (element.style.display === "none") {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
    if (divName === "delete-post"){
      handleLoadPosts();
    }
  }


    return (
        <div className="mform">
          <div className = "settings">
          <div className = "text-title">Configurações</div>
          <div className="options-settings">
            <div className="options-profile">
              <div className="options-item-settings" onClick={() => showOptions("change-user")}>Alterar Usuário</div>
              <div className="options-item-settings" onClick={() => showOptions("change-name")}>Alterar Nome</div>
              <div className="options-item-settings" onClick={() => showOptions("change-image")}>Alterar Imagem de Perfil</div>
            </div>

            <div className="options-password">
            <div className="options-item-settings" onClick={() => showOptions("change-password")}>Alterar Senha</div>
            </div>
            <div className="options-delete">
            <div className="options-item-settings" onClick={() => showOptions("delete-post")}>Deletar Publicação</div>
              <div className="options-item-settings" onClick={() => showOptions("change-account")}>Deletar Conta</div>
            </div>
          </div>
          </div>

          <div className="change-user">
            <div className="container-options">
            <div className="text">Alterar Usuário</div>
          <form onSubmit={handleSubmitModal}>
            <div class="form-row-options">
              <div class = "input-options">
                <label className='optionsLabel' for="usuario">
                Novo Usuário:
                </label>
                <input 
                      name="usuario" 
                      className='dadosUsers' 
                      value={formData.usuario}
                      onChange={handleInputChange} required />
              </div>
              </div>
              <button className= "submit-btn" 
              type = "submit"
             >Atualizar</button>
              </form> 
              <span className="request-status"></span>
              </div>
          </div>

          <div className="change-name">
            <div className="container-options">
            <div className="text">Alterar Nome</div>
            <form onSubmit={handleSubmitModal}>
            <div class="form-row-options">
            <div class="input-options">
                <label className='optionsLabel' for="nome">
                  Novo Nome:
                </label>
                <input 
                      name="nome" 
                      className='dadosUsers' 
                      value={formData.nome}
                      onChange={handleInputChange} required/>
              </div>
              </div>
              <button className= "submit-btn" 
              type = "submit"
             >Atualizar</button>
            </form>
            <span className="request-status"></span>
            </div>
          </div>

          <div className="change-image">
            <div className="container-options">
            <div className="text">Alterar Imagem de Perfil</div>
            <form onSubmit={handleSubmitModal}>
            <div class="form-row-options">
            <div class="input-options-image">
                <label className='optionsLabel' for="avatar">
                </label>
                <input 
                      name="avatar"
                      type="file" 
                      className='dadosUsers' 
                      value={formData.avatar}
                      accept="image/png, image/jpeg"
                      onChange={handleInputChange} required/>
              </div>
              </div>
              <button className= "submit-btn" 
              type = "submit"
             >Atualizar</button>
            </form>
            <span className="request-status"></span>
            </div>
          </div>

          <div className="change-password">
            <div className="container-options">
            <div className="text">Alterar Senha</div>
            <form onSubmit={handleSubmitModal}>
            <div class="form-row-options">
                <div class = "input-options">
                  <label className='optionsLabel' for="senha">
                    Nova Senha:
                  </label>
                  <input 
                      name="senha" 
                      className='dadosUsers' 
                      value={formData.senha}
                      onChange={handleInputChange} required />
                  </div>
                </div>
              <button className= "submit-btn" 
              type = "submit"
             >Atualizar</button>
            </form>
            <span className="request-status"></span>
            </div>
          </div>

          <div className="delete-post" onLoad={handleGetPosts}>
            <div className="container-options">
            <div className="text">Deletar Publicação</div>
            <div className="post">
            { tableData.map( (obj) => {
              return (
              <form onSubmit={() => handleSubmitDeletePost(obj)} key={obj.key}>
                <div className="post-data">{obj.data}</div>
                <div className="post-content">Conteúdo: {obj.conteudo}</div>
                <div className="post-likes">Likes: {obj.curtidas}</div>

              <button className= "submit-btn-delete" 
                      type = "submit"
              >Deletar</button>
              </form>
              
            )})
            }

            </div>
            <span className="request-status"></span>
            </div>
          </div>

          <div className="change-account">
            <div className="container-options">
            <div className="text">Deletar Conta</div>
            <form onSubmit={handleSubmitModal}>
            <div class="form-row-options">
                <div class = "input-options">
                  <label className='optionsLabel' for="senha">
                    Insira sua senha:
                  </label>
                  <input 
                      name="senha" 
                      className='dadosUsers' 
                      value={formData.senha}
                      onChange={handleInputChange} required />
                  </div>
                </div>
              <button className= "submit-btn" 
              type = "submit"
             >Deletar</button>
            </form>
            <span className="request-status"></span>
            </div>
          </div>
        </div>


  );
}

export default Configuracoes;