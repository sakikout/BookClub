# BookClub
A simple social network project in React.js.

## Objective
The main objective is to create a distributed system for using a NoSQL database. In this project, we are using a graph-oriented database, MemGraph.

## Requirements

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


###Backend (Python server)
``` bash
Flask==2.3.3
Flask-Cors==4.0.0
pandas==2.1.4
pymgclient==1.3.1
neo4j==5.24.0
````
Caso tenha algum problema, todos podem ser instalados usando o comando `pip install ...`

###Frontend
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




## Running the application
Backend:
1. Navigate to the project directory
  ``` bash
cd backend
````

2. Start the server with the following command
  ``` bash
python -m http.server 8080 
````
or
  ``` bash
python server-memgraph.py
````

Frontend:
1. Navigate to the project directory
  ``` bash
cd frontend
````
2. Run the following command
  ``` bash
npm run start
````
