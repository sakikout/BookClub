import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';

import bubble from "../icons/bubble-green.png";
import greenHeart from "../icons/heart-green.png";
import pinkHeart from "../icons/pink-heart.png";


function createRandomPosts(count = 5) {
  const posts = [];
  
  for (let i = 0; i < count; i++) {
    posts.push({
      id: crypto.randomUUID() + i,
      usuario: crypto.randomUUID(),
      nome: "user" + (i * 31124),
      conteudo: "Hellow World!",
      data: Date.now(),
      comentarios: [
        {
        usuario: "marysue10000",
        nome: "Mary Sue",
        conteudo: "Oi!",
        data: Date.now()
        },
        {
          usuario: "elonmusk24",
          nome: "Elon Musk",
          conteudo: "Kekw",
          data: Date.now()
          }
      ],
      curtidas: 2
    });
  }

  return posts;
}

function Publicacoes({userData}){

  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const { setToken, token } = useContext(StoreContext);
  const { setUsuario, usuario } = useContext(StoreContext);
  const { setComunidade, comunidade } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);


  const[formData, setPost] = useState({
    usuario: usuario,
    data: Date.now(),
    conteudo: '',
    comentarios: [],
    curtidas: 0
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

  const handleSubmit = (event) => {
    event.preventDefault();
    
    axios.post('http://127.0.0.1:5000/api/publicarPostagem', formData)
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

  });

  const fetchData = async () => {
    try {
      if (tableData.length < 1){
        handleCreatePosts();
      }
     console.log(tableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreatePosts = () => {
    const newUsers = createRandomPosts()
    setTableData([...tableData, ...newUsers])
}

  const changeHeartColor = (obj) => {
    const element = document.querySelector(".icons-heart" + obj.id);
    if (element){
        if (element.src === greenHeart){
      element.src = pinkHeart;
    } else {
      element.src = greenHeart;
    }
    }
  
    
  }

  const commentPost = (post) => {

  }

  return (
    <div className="page">
    <section className="mform">
      <div className = "wrapper">
      <form onSubmit={handleSubmit}>
          <div className='form-all'>
          <header class="header"> 
            <p className="header-content">Você está em {comunidade.comunidade}</p> 
              <div class="cross-icon"> 
                <div class="cross-icon-mark"></div> 
              </div> 
          </header>
          <div class="post-header"> 
           <div class="profile-pic"></div> 
             <div class="user-info"> 
                <div class="full-name">{nome.nome}</div> 
                <div class="username">@{usuario.usuario}</div>
              </div>
        </div>
            <div class="form-row">
              <div class="input-data">
                <textarea 
                   name="conteudo" 
                   className='conteudoForm' 
                   value={formData.conteudo}
                   onChange={handleInputChange}
                   placeholder={'O que está acontecendo?'}/>
                <div class="underline"></div>
              </div>
            </div>     
            <div class="form-row submit-btn">
                  <button type="submit" value="submit">Publicar</button>
              </div>
            </div>
      </form>
      </div>
    </section>

    <section className='mform'>
      <div className="postagens">
      {
          tableData.map((obj) => {
            return (
              <div className='postagem'>
              <div className="post-top">
              <div class="post-header"> 
                 <div class="profile-pic"></div> 
                   <div class="user-info"> 
                      <div class="full-name">{obj.nome}</div> 
                      <div class="username">@{obj.usuario}</div>
                    </div>
              </div>
              <div className="post-content">
                <div className="user-content">
                 {obj.conteudo}
                </div>
                <div className="post-image">
      
                </div>
              </div>
              <div className="post-bottom">
                <div className="action">
                  <img src={greenHeart} className= {'icons-heart' + obj.id} alt="Coração"></img>
                  <span onClick={changeHeartColor(obj)}>Curtir</span>
                </div>
                <div className="action">
                <img src={bubble} className='icons' alt="Bolha de comentário"></img>
                <span onClick={commentPost(obj)}>Comentar</span>
                </div>
                </div>
                <div className="comments">
                  {obj.comentarios.map((comment) =>{
                    return ( <div className="comment"> 
                      <div class="post-header"> 
                          <div class="profile-pic-comment"></div> 
                          <div class="user-info-comment"> 
                            <div class="full-name">{comment.nome}</div> 
                            <div class="username">@{comment.usuario}</div>
                          </div>
                      </div>
                      <div className="post-content-comment">
                        <div className="user-content">
                          {comment.conteudo}
                        </div>
                      </div>
                     </div>
                    )
                  })}
              </div>
                
              </div>
              </div>
  

            );
          })
        }
      </div>
    </section>
    
    </div>
  );

}

export default Publicacoes;