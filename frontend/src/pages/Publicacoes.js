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
  return d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes()
}

function createPosts(data) {
  const posts = [];
    for (let i = 0; i < data.posts.length; i++) {
      posts.push({
        id: data.posts[i].id,
        usuario: data.posts[i].usuario,
        nome: data.posts[i].nome,
        conteudo: data.posts[i].conteudo,
        data: data.posts[i].data,
        foto: data.posts[i].foto,
        comentarios: data.posts[i].comentarios || [],
        curtidas: data.posts[i].curtidas || []
      });
  }
  console.log(posts)
  return posts;
}

function Publicacoes({userData}){
  const [buttonPopup, setButtonPopup] = useState(false);
  const [activePost, setActivePost] = useState('');
  const [tableData, setTableData] = useState([]);
  const { setUsuario, usuario } = useContext(StoreContext);
  const { setComunidade, comunidade } = useContext(StoreContext);
  const { setNome, nome } = useContext(StoreContext);
  const { setFoto, foto } = useContext(StoreContext);

  const[formData, setPost] = useState({
    id: crypto.randomUUID(),
    nome: nome.nome,
    foto: foto.foto,
    usuario: usuario.usuario,
    data: getDateNow(),
    conteudo: '',
    comentarios: [],
    curtidas: []
  });

  // Função para limpar o formulário
  const clearComment = () => {
    setComment({
      id: '',
      foto: foto.foto,
      usuario: usuario.usuario,
      nome: nome.nome,
      data: getDateNow(),
      conteudo: '',
    });
    
  };

  const clearPost = () => {
    setPost({
      id: crypto.randomUUID(),
      nome: nome.nome,
      foto: foto.foto,
      usuario: usuario.usuario,
      data: getDateNow(),
      conteudo: '',
      comentarios: [],
      curtidas: []
    });


  };

  const[formComment, setComment] = useState({
    id: '',
    foto: foto.foto,
    usuario: usuario.usuario,
    nome: nome.nome,
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
      id: crypto.randomUUID(),
      nome: formData.usuario,
      usuario: formData.nome,
      data: formData.data,
      conteudo: formData.conteudo,
      comunidade: comunidade.comunidade,
      foto: formData.foto
    }

    console.log(data);
    
    axios.post( URL_API + 'criarPublicacao', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        window.alert("Post feito com sucesso!");
        clearPost();
   
      })
      .catch(error => {
        console.error('Erro ao enviar dados:', error);
      });
  };
  
  
  useEffect(() => {
    handleLoadPosts();

    const interval = setInterval(() => {
      handleLoadPosts();
    }, 2000); 

    return () => clearInterval(interval);
  }, [comunidade]);



  const handleLoadPosts = () => {

    axios.get(URL_API + 'getPublicacoes', {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        comunidade: comunidade.comunidade,
        usuario: usuario.usuario
      }
    })
    .then(response => {
      console.log('Resposta do servidor:', response.data);
      console.log(response.data)
      const newPosts = createPosts(response.data)
      setTableData([...newPosts])

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
      usuario: nome.nome,
      comunidade: comunidade.comunidade,
      data: getDateNow(),
      foto: foto.foto
    }

    console.log("Dados sendo enviados para curtida: "+ data.id + " " + data.usuario);

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
    console.log(post)
    setButtonPopup(true);
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    const data = {
      idPost: activePost.id,
      id: crypto.randomUUID(),
      nome: formComment.usuario,
      usuario: formComment.nome,
      conteudo: formComment.conteudo,
      data: formComment.data,
      foto: formComment.foto,
      comunidade: comunidade.comunidade
    }

    console.log("Comentário a ser enviado: ");
    console.log(data);
    
    axios.post(URL_API + 'criarComentario', data)
      .then(response => {
        console.log('Resposta do servidor:', response.data);
        setButtonPopup(false);
        //window.alert("Usuário Criado!");
        clearComment();
        //window.alert("Entrada no caixa feita com sucesso!");
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
           <div className="profile-pic"><img src={foto.foto} alt="Uploaded" className="profile-pic"/></div> 
             <div className="user-info"> 
                <div className="full-name">{usuario.usuario}</div> 
                <div className="username">@{nome.nome}</div>
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
              <div className="post-header"> 
                
                <div>
                  {obj.foto ? 
                    (<img src={obj.foto} alt="Uploaded" className="profile-pic"/>) 
                    :(
                      <div className="profile-pic"></div>
                    )}
                </div>
                   <div className="user-info"> 
                      <div className="full-name">{obj.nome}</div> 
                      <div className="username">@{obj.usuario}</div>
                    </div>
                     
              </div>
              
              <div className="post-content">
                <div className="user-content">
                 {obj.conteudo}
                </div>
                <div className="post-image">
      
                </div>
                
              </div>
              <span className="date-post">{obj.data}</span>
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
                      <div className="post-header"> 

                      <div>
                        {comment.foto ? 
                          (<img src={comment.foto} alt="Uploaded" className="profile-pic-comment"/>) 
                          :(
                            <div className="profile-pic-comment"></div>
                          )}
                      </div> 
                          <div className="user-info-comment"> 
                            <div className="full-name">{comment.nome}</div> 
                            <div className="username">@{comment.usuario}</div>
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
                <div>
                  {foto.foto ? 
                    (<img src={foto.foto} alt="Uploaded" className="profile-pic-comment"/>) 
                    :(
                      <div className="profile-pic-comment"></div>
                  )}
                  
                </div> 
                  <div className="user-info-comment"> 
                    <div className="full-name">{usuario.usuario}</div> 
                    <div className="username">@{nome.nome}</div>
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