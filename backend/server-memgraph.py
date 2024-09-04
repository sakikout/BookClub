from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import requests
import json
import pandas as pd
import mgclient
 
datahj = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)

# Função para criar conexão no banco
def conecta_db():
  con = mgclient.connect(host="", port="")
  con.autocommit = True
  return con

# Função para consultas no banco
def consultar_db(sql):
  con = conecta_db()
  cur = con.cursor()
  cur.execute(sql)
  recset = cur.fetchall()
  registros = []
  for rec in recset:
    registros.append(rec)
  con.close()
  return registros

def inserir_db(sql):
  con = conecta_db()
  cur = con.cursor()
  try:
    cur.execute(sql)
    con.commit()
  except (Exception, mgclient.DatabaseError) as error:
    print("Error: %s" % error)
    con.rollback()
    cur.close()
    return 1
  con.close()

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
    inserir_db('CREATE (n:Usuario {usuario: "' + username + '", nome: "' + nome + '", senha: "' + senha + ', avatar: "' + img + '", descricao: "' + desc +  '", color: "'+ color +'"})')
   
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
def get_usuario():
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

@app.route('/api/getComunidadesUsuario', methods=['GET'])
def get_comunidades_de_usuario():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id_user = data['usuario']
    user = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})--(c:Comunidade) RETURN c')
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

@app.route('/api/criaPublicacao', methods=['POST'])
def create_publicacao():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    id_post = post['id']
    username = post['usuario']
    conteudo = post['conteudo']
    img = post['imagem']
    date = post['data']
  
    inserir_db('CREATE (n:Publicacao {id: "' + id_post + '", usuario: "' + username + '", conteudo: "' + conteudo + ', imagem: "' + img + '", data: "' + date + '"})')
   
    return post

@app.route('/api/criaCurtida', methods=['POST'])
def create_curtida():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    usuario_que_curtiu = post['usuario']
    id_post = post['id']
  
    inserir_db('MATCH (n:Usuario), (p:Publicacao) WHERE n.usuario = "' + usuario_que_curtiu + '" AND p.id = "' + id_post +'" CREATE (n:Usuario )-[:CURTIU]->(p:Publicacao)')
   
    return post

@app.route('/api/criaComentario', methods=['POST'])
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

# Running app
if __name__ == '__main__':
    app.run(debug=True)


