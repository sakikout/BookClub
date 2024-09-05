import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup'

import bubble from "../icons/bubble-green.png";
import greenHeart from "../icons/heart-green.png";
import pinkHeart from "../icons/pink-heart.png";
import deleteButton from "../icons/delete.png";


function createRandomPosts(count = 5) {
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
  
  for (let i = 0; i < count; i++) {
    posts.push({
      id: crypto.randomUUID() + i,
      usuario: crypto.randomUUID(),
      nome: "user" + (i * 31124),
      conteudo: "Hello World!",
      data: Date.now(),
      comentarios: [
        {
        id: crypto.randomUUID() + i + 12,
        usuario: "marysue10000",
        nome: "Mary Sue",
        conteudo: "Oi!",
        data: Date.now()
        },
        {
          id: crypto.randomUUID() + i + 10,
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
  const [buttonPopup, setButtonPopup] = useState(false);
  const [activePost, setActivePost] = useState('');
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

  const[formComment, setComment] = useState({
    usuario: usuario,
    data: Date.now(),
    conteudo: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
};

const handleInputChangeComment = (event) => {
  const { name, value } = event.target;
  setComment((prevData) => ({
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
     /* console.log(tableData); */
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleCreatePosts = () => {
    const newUsers = createRandomPosts()
    setTableData([...tableData, ...newUsers])
}

  const changeHeartColor = (obj, className) => {
    const element = document.querySelector(className);
    console.log(element)
    console.log("Curtiu o post de " + obj.nome)
    if (element){
        if (element.src === greenHeart){
      element.src = pinkHeart;
    } else {
      element.src = greenHeart;
    }
    }
  
    
  }

  const commentPost = (post) => {
    console.log("Comentar no post de " + post.nome)
    setActivePost(post)
    setButtonPopup(true);
    console.log(post)

    /*
    <div class="post-header"> 
      <div class="profile-pic-comment"></div> 
          <div class="user-info-comment"> 
            <div class="full-name">{comment.nome}</div> 
            <div class="username">@{comment.usuario}</div>
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
        </div>
      </div>     
      <div class="form-row submit-btn">
        <button type="submit" value="submit">Publicar</button>
      </div>

    */
  }
  const deletePost = (obj) => {
    console.log("Você quer deletar o post de id " + obj.id + " do usuario " + obj.nome);
  }

  const handleSubmitComment = (event) => {
    event.preventDefault();
    
    axios.post('http://127.0.0.1:5000/api/publicarComentario', formData)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Entrada no caixa feita com sucesso!");
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  }

  return (
    <div className="page">
    <section className="mform">
      <div className = "wrapper">
      <form onSubmit={handleSubmit}>
          <div className='form-all'>
          <header className="header"> 
            <p className="header-content">Você está em {comunidade.comunidade}</p>  
          </header>
          <div className="post-header"> 
           <div className="profile-pic"></div> 
             <div className="user-info"> 
                <div className="full-name">{nome.nome}</div> 
                <div className="username">@{usuario.usuario}</div>
              </div>
        </div>
            <div className="form-row">
              <div className="input-data">
                <textarea 
                   name="conteudo" 
                   className='conteudoForm' 
                   value={formData.conteudo}
                   onChange={handleInputChange}
                   placeholder={'O que está acontecendo?'}/>

              </div>
            </div>     
            <div className="form-row submit-btn">
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
              <div className='postagem' key={obj.id}>
              <div className={'post-top-' + obj.id}>
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
                  <span key={obj.id} onClick={() => changeHeartColor(obj, ('icons-heart' + obj.id))}>Curtir</span>
                </div>
                <div className="action">
                <img src={bubble} className='icons' alt="Bolha de comentário"></img>
                <span onClick={() =>  commentPost(obj)}>Comentar</span>
                </div>
                </div>
                <div className="comments">
                  {obj.comentarios.map((comment) =>{
                    return ( <div className="comment" key={comment.id}> 
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
              <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
              <div className="addComment">
              <header className="header"> 
                  <p className="header-content">Você está comentando no post de {activePost.nome}</p>  
              </header>
              <form onSubmit={handleSubmitComment}>
              <div className="post-header-comment"> 
                <div className="profile-pic-comment"></div> 
                  <div className="user-info-comment"> 
                    <div className="full-name">{nome.nome}</div> 
                    <div className="username">@{usuario.usuario}</div>
                </div>
              </div>
              <div className="form-row">
                  <div className="input-data">
                    <textarea 
                      name="conteudo" 
                      className='conteudoForm' 
                      value={formComment.conteudo}
                      onChange={handleInputChangeComment}
                      placeholder={'Deixe um comentário!'}/>
                    </div>
                  </div>     
                <div className="form-row submit-btn-comment">
                    <div className="align-button">
                      <button type="submit" value="submit">Comentar</button>
                    </div>
                  </div>
                  </form>
              </div>
              </Popup>
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