# BookClub
Um projeto simples de rede social em React.js, voltado para usuários com interesse em literatura.

## Objetivo
O objetivo principal é criar um sistema distribuído para usar um banco de dados NoSQL. Neste projeto, estamos usando um banco de dados orientado a grafos, MemGraph.

## Requerimentos

### MemGraph
Para instalar o MemGraph é necessário primeiramente intalar o *Docker* e, em seguida, rodar o seguinte comando no *Power Shell*:

Windows
``` bash
iwr https://windows.memgraph.com | iex
````

Linux/Mac
``` bash
curl https://install.memgraph.com | sh
````

Após isso você pode encontra-lo em http://localhost:3000
Basta clicar no botão para conectar 

Obsevação: É necessário que o docker esteja rodando!


### Backend (Python server)
``` bash
Flask==2.3.3
Flask-Cors==4.0.0
pandas==2.1.4
pymgclient==1.3.1
neo4j==5.24.0
cloudinary==1.41.0
````
Caso tenha algum problema, todos podem ser instalados usando o comando `pip install ...` ou `pip install -r requirements.txt`

### Frontend
``` bash
"axios": "^1.6.5",
"bootstrap": "^5.3.2",
"jquery": "^3.7.1",
"js-cookie": "^3.0.5",
"js-cookies": "^1.0.4",
"react": "^18.2.0",
"react-bootstrap": "^2.9.2",
"react-dom": "^18.2.0",
"react-image": "^4.1.0",
"react-router-dom": "^6.21.2",
"react-scripts": "5.0.1",
"reactjs-popup": "^2.0.6",
"web-vitals": "^2.1.4"
````
Caso tenha algum problema, todos podem ser instalados usando o comando `npm install ...`




## Iniciar a aplicação
Backend:
1. Navegue até o diretório do projeto
  ``` bash
cd backend
````

2. Inicie o servidor com o seguinte comando
  ``` bash
python -m http.server 8080 
````
ou
  ``` bash
python server-memgraph.py
````

Frontend:
1. Navegue até o diretório do projeto
  ``` bash
cd frontend
````
2. Digite o seguinte comando
  ``` bash
npm run start
````
