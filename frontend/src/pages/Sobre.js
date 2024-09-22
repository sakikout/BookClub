import React, { useContext, useState, Component, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookClub from '../img/BookClub.png'
import '../components/style/style.css'

const Sobre = () => {
    const navigate = useNavigate()

    const handleClickLogin = (event) => {
        event.preventDefault();
        navigate("login",  { replace: false });
    }

    /* <img src={BookClub} alt="Logo BookClub"></img> */


  return (
    <div className="main">
         <header class="header_section">
      <div class="container-fluid">
        <nav class="navbar navbar-expand-lg custom_nav-container ">
          <a class="navbar-brand">
            <span>
            BookClub
            </span>
          </a>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <div class="navbar-nav  ">
              <div class="nav-item active">
                <a class="nav-link"></a>
              </div>
              <div class="nav-item">
                <a class="nav-link"></a>
              </div>
            </div>

          </div>
        </nav>
        
      </div>
    </header>
    <section class="about_section layout_padding">
    <div class="container  ">
      <div class="row-about-page">
        <div class="col-md-6">
          <div class="detail-box">
            <div class="heading_container">
              <h2>
                Venha fazer Parte Da Nossa Família!
              </h2>
            </div>
            <p>
              A "BookClub" é uma rede social para todos. Interaja, compartilhe e discuta sobre seus livros favoritos em comunidades receptivas. 
            </p>
            <div class="quote_btn-container">
              <a onClick={handleClickLogin} class="quote_btn">
                Experimente
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-6 ">
          <div class="img-box">
            <img src={BookClub} alt="Logo BookClub"></img>
          </div>
        </div>

      </div>
    </div>
  </section>
    <footer>
        <div className="footer_section">
        <div class="container">
        <p>
          &copy; <span id="displayYear"></span> Created By 
          <a> @sakikout</a> and <a>@AmandaJacomette</a>
        </p>
      </div>

        </div>
    </footer>


    </div>
  );
};

export default Sobre;