import React, { useState, useEffect, useContext } from 'react';
import '../components/style/style.css'

import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup';
import axios from 'axios';

// Na minha máquina, só consigo entrar por essa porta.
// Altere isso se você utiliza outra no backend.
const URL_API ='http://127.0.0.1:8080/api/' 

function createPosts(data) {
  const posts = [];
    for (let i = 0; i < data.posts.length; i++) {
      posts.push({
        id: data.posts[i].id,
        usuario: data.posts[i].usuario,
        nome: data.posts[i].nome,
        conteudo: data.posts[i].conteudo,
        imagem: data.posts[i].imagem,

        curtidas: data.posts[i].curtidas || []
      });
  }
  console.log(posts)
  return posts;
}


function Configuracoes({userData}){
  const [tableData, setTableData] = useState([]);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [buttonDeletePopup, setDeletePopup] = useState(false);
  const { setUsuario, usuario } = useContext(StoreContext);
  const { setComunidade, comunidade } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);
  const { setColor, color} = useContext(StoreContext);
  const { setFoto, foto } = useContext(StoreContext);
  const [imageURL, setImageURL] = useState("");

  const { setToken, token } = useContext(StoreContext);

  const[formData, setFunc] = useState({
    usuario: nome.nome,
    nome: usuario.usuario,
    descricao: '',
    foto: '',
    senha: '',
    cor: color.color
  });

 //Mudanças nos campos de criação de usuário
 const handleInputChange = (event) => {
  const { name } = event.target;
  //Para caso de fotos é necessário um tratamento diferente (File)
  if (name === 'foto') {
    const file = event.target.files[0];
    setFunc((prevData) => ({
      ...prevData,
      foto: file,
    }));
    setImageURL(URL.createObjectURL(file));
  } else {
    const { value } = event.target;
    setFunc((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
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

    axios.post(URL_API + 'criaUsario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
     

      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  const checkPassword = async (senha) => {
    try {
    const response = await axios.post(URL_API + 'getSenhaUsuario', formData);
    // console.log('Resposta do servidor:', response.data);
    const senhaServidor = response.data.data[0][0]
    // console.log("Senha do servidor: " + senhaServidor)
    // console.log("Senha do formulário: " + formData.senha)
    return senhaServidor.toString() === formData.senha.toString()
   
    } catch (error) {
      console.error('Erro ao enviar dados:', error);
      return false;
    }

  }

  const handleSubmitDelete = (event) => {
    event.preventDefault();
    console.log(formData.usuario);

    if (checkPassword(formData.usuario)){
        axios.post(URL_API + 'deletaUsuario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setToken(null);
        
     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
    }
    else {
      console.error('Senha incorreta.');
    }
  
      
  }

  const handleSubmitUsuario = (event) => {
    event.preventDefault();
    console.log(formData.usuario);
    console.log(usuario.usuario);
    console.log(formData.nome);
    console.log(nome.nome);

    const data = {
      oldUsuario: nome.nome,
      usuario: formData.usuario,
      nome: formData.nome,
      descricao: formData.descricao,
      foto: formData.foto,
      senha: formData.senha,
      cor: formData.cor
    }

    axios.post(URL_API + 'setUsuario', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setNome({nome: response.data.data[0][0]})
        console.log(usuario.usuario)
        setDeletePopup(false);
     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleSubmitNome = (event) => {
    event.preventDefault();

    console.log(formData.usuario);
    console.log(usuario.usuario);
    console.log(formData.nome);
    console.log(nome.nome);


    const data = {
      oldNome: usuario.usuario,
      usuario: formData.usuario,
      nome: formData.nome,
      descricao: formData.descricao,
      foto: formData.foto,
      senha: formData.senha,
      cor: formData.cor
    }

    axios.post(URL_API + 'setNome', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setUsuario({usuario: response.data.data[0][0]})
        console.log(nome.nome)
        setDeletePopup(false);
     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleSubmitAvatar = (event) => {
    event.preventDefault();
    console.log(formData.usuario);

    const data = new FormData();
    data.append('nome', formData.nome);
    data.append('usuario', formData.usuario);
    data.append('senha', formData.senha);
    data.append('foto', formData.foto);

    axios.post(URL_API + 'setAvatar', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        console.log(response.data.data[0][0])
        setFoto({foto: response.data.data[0][0]});
        setDeletePopup(false);
     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleSubmitSenha = (event) => {
    event.preventDefault();
    console.log(formData.usuario);

    const data = {
      oldSenha: usuario.usuario,
      usuario: formData.usuario,
      nome: formData.nome,
      descricao: formData.descricao,
      foto: formData.foto,
      senha: formData.senha,
      cor: formData.cor
    }

    axios.post(URL_API + 'setSenha', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        console.log(response.data.data[0][0])
        setDeletePopup(false);
     
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

      
  }

  const handleSubmitDeletePost = (obj) => {
   console.log(formData.usuario);
    console.log(obj.id)

    const data = {
      id : obj.id
    }
 
    axios.post(URL_API + 'deletaPublicacao', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        console.log(response.data.data[0][0])
 
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });

  }
  const handleLoadPosts = ( ) => {

      axios.get(URL_API + 'getPublicacoesUsuario', {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          usuario: nome.nome
        }
      })
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        console.log(response.data.data)
        const newPosts = createPosts(response.data)
        setTableData([...newPosts])
  
      })
      .catch(error => {
        console.error('Erro ao receber dados:', error);
      });
      
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
          <form onSubmit={handleSubmitUsuario}>
            <div className="form-row-options">
              <div className = "input-options">
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
            <form onSubmit={handleSubmitNome}>
            <div className="form-row-options">
            <div className="input-options">
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
            <form onSubmit={handleSubmitAvatar}>
            <div className="form-row-options">
            <div className="input-options-image">
                <label className='optionsLabel' for="avatar">
                </label>
                <input 
                      name="foto"
                      type="file" 
                      className='dadosUsers' 
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
            <form onSubmit={handleSubmitSenha}>
            <div className="form-row-options">
                <div className = "input-options">
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

          <div className="delete-post" onLoad={handleLoadPosts}>
            <div className="container-options">
            <div className="text">Deletar Publicação</div>
            <div className="post">
            { tableData.map( (obj) => {
              return (
              <form onSubmit={() => handleSubmitDeletePost(obj)} key={obj.key}>
                <div className="post-data">{obj.data}</div>
                <div className="post-content">Conteúdo: {obj.conteudo}</div>
                <div className="post-likes">Likes: {obj.curtidas.length}</div>

              <button className= "submit-btn-delete" 
                      type = "submit"
              >Deletar</button>
              </form>
              
            )})
            }

            </div>
            <span className="request-status-delete-acc"></span>
            </div>
          </div>

          <div className="change-account">
            <div className="container-options">
            <div className="text">Deletar Conta</div>
            <form onSubmit={handleSubmitDelete}>
            <div className="form-row-options">
                <div className = "input-options">
                  <label className='optionsLabel' for="senha">
                    Insira sua senha:
                  </label>
                  <input 
                      name="senha" 
                      className='dadosUsers' 
                      type="password"
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