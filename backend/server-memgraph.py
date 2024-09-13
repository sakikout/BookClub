from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import requests
import json
import pandas as pd

#A biblioteca do Memgraph (Não sei porque é o neo4j mas funciona) 
from neo4j import GraphDatabase
 
datahj = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)

#A url tem que ser com esse bolt mesmo
URI = "bolt://localhost:7687"
AUTH = ("", "")


# Função para criar conexão no banco
# Vamos usar só essa função pra tudo, não tem diferença de inserir/criar nem nada
def consultar_db(consulta):
    with GraphDatabase.driver(URI, auth=AUTH) as client:
        # Check the connection
        client.verify_connectivity()
        #consulta = 'CREATE (n:Usuario {usuario: "Amanda123", nome: "Amanda", senha: "1234", avatar: "...", descricao: "uma descricao", cor: "rosa"}) RETURN n.nome AS name'
        records, summary, keys = client.execute_query(consulta)
    
    #Exemplo de print, todos vem como array
    #for record in records:
        #print(record["name"])
    return records, summary, keys

#Esse é o teste para ver se a conexão funciona
#consultar_db("consulta")

##################   ROTAS   ######################
 
@app.route('/api/login', methods=['POST'])
def send_data():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    login = data['usuario']
    senha = data['senha']
    reg = consultar_db('MATCH (n:Usuario {usuario: "' + login + '"}) WHERE n.senha = "' + str(senha)+ '"')
    print("Dados banco:", reg)
    if(len(reg) > 0):
        df_bd = pd.DataFrame(reg, columns=['usuario', 'nome'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'option': 1,
                'usuario': df_bd['usuario'][0],
                'nome': df_bd['nome'][0]}
    else:
       df_bd = {}
       data = {'error': True,
               'mensage': 'Não foi possivel encontrar o usuário'}
    return data

@app.route('/api/criaUsuario', methods=['POST'])
def create_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['color']
    inserir_db('CREATE (n:Usuario {usuario: "' + username + '", nome: "' + nome + '", senha: "' + senha + ', avatar: "' + img + '", descricao: "' + desc +  '", cor: "'+ color +'"})')
   
    return usuario

@app.route('/api/entraComunidade', methods=['POST'])
def entrar_em_comunidade():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    comunidade = usuario['comunidade']
    inserir_db('MATCH (n:Usuario {usuario: "' + username + '"}), (c:Comunidade {comunidade: "'+ comunidade + '"}) CREATE (n)-[:ESTA_EM]->(c)')
   
    return usuario

@app.route('/api/deletaUsuario', methods=['POST'])
def delete_usuario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    username = funcionario['usuario']
    usuario = inserir_db('DELETE (n:Usuario) WHERE n.usuario = "' + username + '" ')  
    usuario = {'error': False}
    return usuario

@app.route('/api/getUsuarios', methods=['GET'])
def get_usuarios():
    user = consultar_db('MATCH (n:Usuario) RETURN n')
    df_bd1 = pd.DataFrame(user, columns=['usuario', 'nome', 'senha', 'descricao', 'avatar', 'cor'])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_users = []
    
    for i in range(len(df_bd1['cpfop'])):
    #for operador in df_bd1:
        dict_users.append({'usuario': df_bd1['usuario'][i],
            'nome': df_bd1['nome'][i],
            'senha': df_bd1['senha'][i],
            'descricao': df_bd1['descricao'][i],
            'avatar': df_bd1['avatar'][i],
            'cor': df_bd1['cor'][i]
        })
        
    print("Dados retorno:", dict_users)
    return json.dumps(dict_users)

@app.route('/api/getComunidadesUsuario', methods=['POST'])
def get_comunidades_de_usuario():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id_user = data['usuario']
    user = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[:ESTA_EM]->(c:Comunidade) RETURN c')
    df_bd1 = pd.DataFrame(user, columns=['id','nome'])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_communities = []
    
    for i in range(len(df_bd1['id'])):
    #for operador in df_bd1:
        dict_communities.append({'id': df_bd1['id'][i],
            'nome': df_bd1['nome'][i],
        })
        
    print("Dados retorno:", dict_communities)
    return json.dumps(dict_communities)

@app.route('/api/sairComunidade', methods=['POST'])
def sair_de_comunidade():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id_user = data['usuario']
    comunidade = data['comunidade']
    relacao = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[rel:ESTA_EM]->(c:Comunidade: "'+ comunidade +'") DELETE rel')
    print("Dados retorno:", relacao)
    return json.dumps(relacao)

@app.route('/api/setUsuario', methods=['POST'])
def set_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['color']
    inserir_db('MATCH (n:Usuario {id: "' + username + '"}) SET n.nome = "' + nome + '", n.senha = "' + senha + ', n.avatar = "' + img + '", n.descricao = "' + desc +  '", n.color = "'+ color +'"})')
   
    return usuario

@app.route('/api/criarPublicacao', methods=['POST'])
def create_publicacao():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    comunidade = post['comunidade']
    id_post = post['id']
    username = post['usuario']
    conteudo = post['conteudo']
    img = post['imagem']
    date = post['data']
  
    inserir_db('CREATE (n:Publicacao {id: "' + id_post + '", usuario: "' + username + '", conteudo: "' + conteudo + ', imagem: "' + img + '", data: "' + date + '"})')
    inserir_db('MATCH (p:Publicacao {id: "' + id_post +'"}), (c:Comunidade {nome:"' + comunidade + '"}) CREATE (p)-[:PERTENCE_A]->(c)')
   
    return post

@app.route('/api/getPublicacoes', methods=['GET'])
def get_publicacoes():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    comunidade = data_received['comunidade']
    posts = consultar_db('(c:Comunidade {nome: "'+ comunidade +'"})<-[:PERTENCE_A]-(p:Publicacao) RETURN p')
    df_bd1 = pd.DataFrame(posts, columns=['id', 'usuario', 'imagem', 'conteudo', 'data'])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_posts = []
    
    for i in range(len(df_bd1['id'])):
    #for operador in df_bd1:
        dict_posts.append({'id': df_bd1['id'][i],
            'usuario': df_bd1['usuario'][i],
            'conteudo': df_bd1['conteudo'][i],
            'data': df_bd1['data'][i],
            'imagem': df_bd1['imagem'][i]
        })
        
    print("Dados retorno:", dict_posts)
    return json.dumps(dict_posts)


@app.route('/api/criarCurtida', methods=['POST'])
def create_curtida():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    usuario_que_curtiu = post['usuario']
    id_post = post['id']
  
    inserir_db('MATCH (n:Usuario), (p:Publicacao) WHERE n.usuario = "' + usuario_que_curtiu + '" AND p.id = "' + id_post +'" CREATE (n:Usuario )-[:CURTIU]->(p:Publicacao)')
   
    return post

@app.route('/api/getCurtidas', methods=['GET'])
def get_curtidas():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    postagem = data_received['idPost']
    curtidas = consultar_db('MATCH (p:Publicacao {id: "'+ postagem +'"})<-[:CURTIU]-(n:Usuario) RETURN n')
    df_bd1 = pd.DataFrame(curtidas, columns=['usuario'])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_curtidas = []
    
    for i in range(len(df_bd1['usuario'])):
    #for operador in df_bd1:
        dict_curtidas.append({
            'usuario': df_bd1['usuario'][i],
        })
        
    print("Dados retorno:", dict_curtidas)
    return json.dumps(dict_curtidas)


@app.route('/api/criarComentario', methods=['POST'])
def create_comentario():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    id_comentario = post['id']
    usuario= post['usuario']
    conteudo = post['conteudo']
    date = post['data']
    id_post = post['idPost']
  
    inserir_db('MATCH (n:Usuario), (p:Publicacao) WHERE n.usuario = "' + usuario + '" AND p.id = "' + id_post +'" CREATE (n:Usuario )-[:COMENTOU {id: "' + id_comentario + '", conteudo: "' + conteudo + '", data: "'+ date +'"}]->(p:Publicacao)')
   
    return post

@app.route('/api/getComentarios', methods=['GET'])
def get_comentarios():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    postagem = data_received['idPost']
    comment = consultar_db('MATCH (p:Publicacao {id: "'+ postagem +'"})<-[rel:COMENTOU]-(n:Usuario) RETURN rel')
    df_bd1 = pd.DataFrame(comment, columns=['id', 'usuario', 'nome', 'conteudo', 'data',])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_comments = []
    
    for i in range(len(df_bd1['id'])):
    #for operador in df_bd1:
        dict_comments.append({'id': df_bd1['id'][i],
            'usuario': df_bd1['usuario'][i],
            'nome': df_bd1['nome'][i],
            'conteudo': df_bd1['conteudo'][i],
            'data': df_bd1['data'][i],
        })
        
    print("Dados retorno:", dict_comments)
    return json.dumps(dict_comments)


@app.route('/api/criarMensagem', methods=['POST'])
def create_mensagem():
    message = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", message)
    id_message = message['id']
    comunidade = message['comunidade']
    usuario= message['usuario']
    conteudo = message['conteudo']
    date = message['data']
    color = consultar_db('MATCH (n:Usuario) WHERE n.usuario = "' + usuario + '" RETURN n.cor')

    inserir_db('CREATE (m: Mensagem {id: "' + id_message + '", usuario:"'+ usuario +'", conteudo: "' + conteudo + '", data: "'+ date +'", cor: "'+ color +'"})')
    inserir_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})-[:TEM_CONVERSA]->(n:Conversa) CREATE (m:Mensagem {id: "'+ id_message +'"}-[:EM]->(n)')

    return message

@app.route('/api/getMensagens', methods=['GET'])
def get_mensagens():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    comunidade = data_received['comunidade']
    message = consultar_db('(c:Comunidade {nome: "'+ comunidade +'"})-[:TEM_CONVERSA]->(n:Conversa)<-[:EM]-(m:Mensagem) RETURN m')
    df_bd1 = pd.DataFrame(message, columns=['id', 'usuario', 'conteudo', 'data', 'cor'])
    df_bd1.head()
    df_bd1 = df_bd1.to_dict()
    print("Dados banco:", df_bd1)
    dict_messages = []
    
    for i in range(len(df_bd1['id'])):
    #for operador in df_bd1:
        dict_messages.append({
            'usuario': df_bd1['usuario'][i],
            'conteudo': df_bd1['conteudo'][i],
            'data': df_bd1['data'][i],
            'cor': df_bd1['cor'][i]
        })
        
    print("Dados retorno:", dict_messages)
    return json.dumps(dict_messages)


# Running app
if __name__ == '__main__':
    app.run(debug=True)


