import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StoreContext from '../components/Store/Context';
import logo from "../img/books.png";
import communities from "../icons/communities.png";
import logoff from "../icons/logoff.png";
import posts from "../icons/posts.png";
import settings from "../icons/settings.png";
import chat from "../icons/chat.png";
import notifications from "../icons/notification.png";
import profile from "../icons/profile.png"
import './sidebar.css'

function Sidebar ({userData, newMessage}) {
    const navigate = useNavigate();
	const {token, setToken } = useContext(StoreContext);
	const [pratEstoque, setpratEstoque] = useState(false);

	useEffect(() => {
		console.log(userData);
		
		console.log(token);

		if(token.token == 2){
			console.log('token');
		}
	  })

    return (
        <>
	<div className="sidenav">
        <img
              alt=""
              src={logo}
              width="70"
              height="70"
              className="img-logo"
			  onClick={(event) => newMessage(event, 0)}
			  />{' '}

		<div className="options">
			<span className="options-title">OPÇÕES</span>
			<div className="options-rest">

				<a className="item-a">
					
					<span className="item" onClick={(event) => navigate(-1)}>
					<img src={communities} className='icons' alt="Comunidades" width="30px" height="30px"></img>
					<div className="text-span">Comunidades</div></span>
				</a>
				
				<a className="item-a">

					<span className="item" onClick={(event) => newMessage(event, 1)}>
					<img src={posts} className='icons' alt="Publicações" width="30px" height="30px"></img>
					<div className="text-span">Publicações</div>
					</span>
				</a>
				

				<a className="item-a">
					
					<span className="item" onClick={(event) => newMessage(event, 2)}>
					<img src={chat} className='icons' alt="Conversas" width="30px" height="30px"></img>
					<div className="text-span">Conversas</div></span>
				</a>

				<a className="item-a">
					
					<span className="item" onClick={(event) => newMessage(event, 3)}>
					<img src={notifications} className='icons' alt="Notificações" width="30px" height="30px"></img>
					<div className="text-span">Notificações</div></span>
				</a>

				<div className="options-below">
				<a className="item-a">
					<span className="item" onClick={(event) => newMessage(event, 4)}>
					<img src={settings} className='icons' alt="Configurações" width="30px" height="30px"></img>
					<div className="text-span">Configurações</div></span>
				
				</a>
				
				<a className="item-a">
					<span className="item" onClick={() => setToken(null)}>
					<img src={logoff} className='icons' alt="Encerrar" width="30px" height="30px"></img>
					<div className="text-span">Encerrar</div></span>
				
				</a>

				</div>
	
			</div>
			
		</div>
		
	</div>

  
      </>
      );
};



export default Sidebar