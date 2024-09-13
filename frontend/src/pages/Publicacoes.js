import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../components/style/style.css'
import StoreContext from '../components/Store/Context';
import Popup from '../components/Popup'

import bubble from "../icons/bubble-green.png";
import greenHeart from "../icons/heart-green.png";
import pinkHeart from "../icons/pink-heart.png";


// Na minha máquina, só consigo entrar por essa porta.
// Altere isso se você utiliza outra no backend.
const URL_API ='http://127.0.0.1:8080/api/' 

function getDateNow(){
  var d = new Date();
  return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear()
}

function createPosts(data) {
  const posts = [];
    for (let i = 0; i < data.posts.length; i++) {
      posts.push({
        id: data.posts[i].id,
        usuario: data.posts[i].usuario,
        nome: data.posts[i].nome,
        conteudo: data.posts[i].conteudo,
        imagem: data.posts[i].imagem,
        comentarios: data.posts[i].comentarios || [],
        curtidas: data.posts[i].curtidas || []
      });
  }

  return posts;
}

function createRandomPosts(count = 5) {
  const posts = [];

  posts.push({
    id: crypto.randomUUID(),
    usuario: "johndoe01",
    nome: "John Doe",
    conteudo: "Baniram o Twitter :(",
    data: getDateNow(),
    comentarios: [
      {
      id: crypto.randomUUID(),
      usuario: "marysue10000",
      nome: "Mary Sue",
      conteudo: "Paia né!",
      data: getDateNow()
      },
      {
        id: crypto.randomUUID(),
        usuario: "elonmusk24",
        nome: "Elon Musk",
        conteudo: "I'm sorry brazilians",
        data: getDateNow()
        },
        {
          id: crypto.randomUUID(),
          usuario: "johndoe01",
          nome: "John Doe",
          conteudo: "Libera pra nós de novo",
          data: getDateNow()
          },
    ],
    curtidas: [ 
      {
      usuario: "marysue10000"
      }
    ]
  });
  
  for (let i = 0; i < count; i++) {
    posts.push({
      id: crypto.randomUUID() + i,
      usuario: crypto.randomUUID(),
      nome: "user" + (i * 31124),
      conteudo: "Hello World!",
      data: getDateNow(),
      comentarios: [
        {
        id: crypto.randomUUID() + i + 12,
        usuario: "marysue10000",
        nome: "Mary Sue",
        conteudo: "Oi!",
        data: getDateNow()
        },
        {
          id: crypto.randomUUID() + i + 10,
          usuario: "elonmusk24",
          nome: "Elon Musk",
          conteudo: "Kekw",
          data: getDateNow()
          }
      ],
      curtidas: [ 
        {
        usuario: "marysue10000"
        },
        { usuario: "elonmusk24" }
      ]
    });
  }


  return posts;
}

function Publicacoes({userData}){
  const [buttonPopup, setButtonPopup] = useState(false);
  const [activePost, setActivePost] = useState('');
  const [tableData, setTableData] = useState([]);
  const { setUsuario, usuario } = useContext(StoreContext);
  const { setComunidade, comunidade } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);

  const[formData, setPost] = useState({
    id: crypto.randomUUID(),
    nome: nome.nome,
    usuario: usuario.usuario,
    data: getDateNow(),
    conteudo: '',
    comentarios: [],
    curtidas: []
  });

  const[formComment, setComment] = useState({
    id: '',
    usuario: usuario.usuario,
    data: getDateNow(),
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

    console.log(formData);

    const data = {
      id: formData.id,
      nome: formData.nome,
      usuario: formData.usuario,
      data: formData.data,
      conteudo: formData.conteudo,
      comunidade: comunidade.comunidade,
      imagem: "..."
    }
    
    axios.post( URL_API + 'criarPublicacao', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Entrada no caixa feita com sucesso!");
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };
  
  
  useEffect(() => {
    handleLoadPosts();

    const interval = setInterval(() => {
      handleLoadPosts();
    }, 5000); 

    return () => clearInterval(interval);
  }, [comunidade]);

  const handleLoadPosts = () => {

    axios.get(URL_API + 'getPublicacoes', {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        comunidade: comunidade.comunidade
      }
    })
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      const newPosts = createPosts(response.data)
      setTableData([...tableData, ...newPosts])

    })
    .catch(error => {
      console.error('Erro ao receber dados:', error);
    });
  }

  const sendLike = (obj, className) => {
    const element = document.querySelector(className);
    console.log(element)
    console.log("Curtiu o post de " + obj.nome)

    // Trocar a cor do coração
    if (element){
        if (element.src === greenHeart){
      element.src = pinkHeart;
    } else {
      element.src = greenHeart;
    }
    }

    const data = {
      id: obj.id,
      usuario: usuario.usuario
    }

    console.log("Dados senod enviados para curtida: "+ data.id + " " + data.usuario);

    // obj.curtidas.append({usuario: usuario.usuario});

    axios.post(URL_API + 'criarCurtida', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Post foi curtido!");
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };
    
    

  const commentPost = (post) => {
    console.log("Comentar no post de " + post.nome)
    setActivePost(post)
    setButtonPopup(true);
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const data = {
      idPost: activePost.id,
      id: crypto.randomUUID(),
      usuario: formComment.usuario,
      conteudo: formComment.conteudo,
      data: formComment.data
    }

    console.log("Comentário a ser enviado: ");
    console.log(data);
    
    axios.post(URL_API + 'criarComentario', data)
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
                  <img src={greenHeart} className= {'icons-heart' + obj.id} alt="Coração"
                  onClick={() => sendLike(obj, ('icons-heart' + obj.id))}></img>
                  <span key={obj.id}>
                    {obj.curtidas.length}
                  </span>
                </div>
                <div className="action">
                <img src={bubble} className='icons' alt="Bolha de comentário"
                onClick={() =>  commentPost(obj)}></img>
                <span>{obj.comentarios.length}</span>
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