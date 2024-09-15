from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import json
import pandas as pd

import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

#A biblioteca do Memgraph (Não sei porque é o neo4j mas funciona) 
from neo4j import GraphDatabase
 
datahj = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)

URI = "bolt://localhost:7687"
AUTH = ("", "")

# Configurações do Cloudinary
cloudinary.config(
  cloud_name = "dvks6kvfn", 
  api_key = "949973423629945", 
  api_secret = "uau5kTgXfthklnl1st74MoQzRA4"
)

# Função para criar conexão no banco
# Vamos usar só essa função pra tudo, não tem diferença de inserir/criar nem nada
def consultar_db(consulta):
    with GraphDatabase.driver(URI, auth=AUTH) as client:
        client.verify_connectivity()
        records, summary, keys = client.execute_query(consulta)
    
    return records, summary, keys

def node_to_dict(node):
    """Converte um objeto Node do Neo4j para um dicionário."""
    return dict(node)

def upload_image(img):
    result = cloudinary.uploader.upload(img)
    # O URL da imagem na nuvem será retornado
    image_url = result.get("secure_url")

    return image_url

##################   ROTAS   ######################
 
@app.route('/api/login', methods=['POST'])
def send_data():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    login = data['usuario']
    senha = data['senha']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + login + '", senha: "' + str(senha)+ '"}) RETURN n.nome AS nome, n.usuario AS usuario, n.foto AS foto')
    print("Dados banco:")
    for record in reg:
        print(record["nome"])
    if(len(reg) > 0):
        df_bd = pd.DataFrame(reg, columns=['usuario', 'nome', 'foto'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'option': 1,
                'usuario': df_bd['usuario'][0],
                'nome': df_bd['nome'][0],
                'foto': df_bd['foto'][0]}
    else:
       df_bd = {}
       data = {'error': True,
               'mensage': 'Não foi possivel encontrar o usuário'}
    return data

@app.route('/api/criaUsuario', methods=['POST'])
def create_usuario():
    if 'usuario' not in request.form or 'nome' not in request.form or 'senha' not in request.form:
        return jsonify({"error": "Imagem, nome ou senha não foram enviados"}), 400
    
    img = request.files['foto']
    username = request.form['usuario']
    nome = request.form['nome'] 
    senha = request.form['senha']

    link = upload_image(img)
    
    reg_already_exist, summary_already_exist, keys_already_exist = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) RETURN n.nome AS nome, n.usuario AS usuario')
    if (reg_already_exist):
        return reg_already_exist
    else:
        reg, summary, keys = consultar_db('CREATE (n:Usuario {usuario: "' + username + '", nome: "' + nome + '", senha: "' + senha + '", foto: "' + link + '"})')
        return reg

@app.route('/api/entraComunidade', methods=['POST'])
def entrar_em_comunidade():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    comunidade = usuario['comunidade']
    img = usuario['comunidadeImg']
    id = usuario['id']

    reg_community, summary_community, keys_community = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade + '"}) RETURN c')
    print("reg1", reg_community)
    reg_already_exist, summary_already_exist, keys_already_exist = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"})-[rel:ESTA_EM]->(c:Comunidade {nome: "'+ comunidade + '"}) RETURN rel')
    print("reg2", reg_already_exist)

    if (reg_already_exist):
        return jsonify({"status": "success", "data": 'Usuário já na comunidade'}), 200
    else:
        if(reg_community):
            reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}), (c:Comunidade {nome: "'+ comunidade + '"}) CREATE (n)-[rel:ESTA_EM]->(c) RETURN rel')
            print("reg3", reg)
        else:
            reg_community, summary_community, keys_community = consultar_db('CREATE (c:Comunidade {nome: "'+ comunidade + '", img: "'+ img + '", id: "'+ str(id) + '"}) RETURN c')
            reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}), (c:Comunidade {nome: "'+ comunidade + '"}) CREATE (n)-[rel:ESTA_EM]->(c) RETURN rel')
   
    return jsonify({"status": "success", "data": "Usuário entrou na comunidade"}), 200

@app.route('/api/getUsuarios', methods=['GET'])
def get_usuarios():
    reg, summary, keys = consultar_db('MATCH (n:Usuario) RETURN n')
    df_bd1 = pd.DataFrame(reg, columns=['usuario', 'nome', 'senha', 'descricao', 'foto', 'cor'])
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
            'foto': df_bd1['foto'][i],
            'cor': df_bd1['cor'][i]
        })
        
    print("Dados retorno:", dict_users)
    return json.dumps(dict_users)

@app.route('/api/getComunidadesUsuario', methods=['POST'])
def get_comunidades_de_usuario():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    
    id_user = data['usuario']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[:ESTA_EM]->(c:Comunidade) RETURN c.id AS id, c.nome AS nome, c.img AS img;')
    print(reg)

    if(len(reg) > 0):
        com = []
        for r in reg:
            com.append({
                'id': r['id'],
                'name': r['nome'],
                'img': r['img']
            }) 
        
        data = {'error': False,
                'comunidades': com}
    else:
       df_bd = {}
       data = {'error': True,
               'mensage': 'Não foi possivel encontrar as comunidades'}
        
    return data

@app.route('/api/sairComunidade', methods=['POST'])
def sair_de_comunidade():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id_user = data['usuario']
    comunidade = data['comunidade']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[rel:ESTA_EM]->(c:Comunidade: {nome: "'+ comunidade +'"}) DELETE rel')
    print("Dados retorno:", reg)
    return json.dumps(reg)

@app.route('/api/setSenha', methods=['POST'])
def set_senha_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) SET n.senha = "' + senha + '" RETURN n.senha')
   
    return jsonify({"status": "success", "data": reg}), 200

@app.route('/api/getSenha', methods=['POST'])
def get_senhar_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) RETURN n.senha')
   
    return jsonify({"status": "success", "data": reg}), 200

def update_avatar(user, avatar):

    reg_publicacoes, summary_publicacoes, keys_publicacoes = consultar_db('MATCH (n:Publicacoes {usuario: "' + user + '"}) SET n.avatar = "' + avatar + '" RETURN n.avatar')
    reg_comments, summary_comments, keys_comments = consultar_db('MATCH (n:Comentario {usuario: "' + user + '"}) SET n.avatar = "' + avatar + '" RETURN n.avatar')
    reg_messages, summary_messages, keys_messages = consultar_db('MATCH (n:Mensagem {usuario: "' + user + '"}) SET n.avatar = "' + avatar + '" RETURN n.avatar')

    data = [reg_publicacoes, reg_comments,  reg_messages]

    return jsonify({"status": "success", "data": data}), 200

@app.route('/api/setAvatar', methods=['POST'])
def set_avatar_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) SET n.avatar = "' + img + '" RETURN n.avatar')
    update = update_avatar(username, img)

    return jsonify({"status": "success", "data": reg}), 200

@app.route('/api/getAvatar', methods=['POST'])
def get_avatar_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) RETURN n.avatar')
   
   
    return jsonify({"status": "success", "data": reg}), 200

def update_usuario(oldUser, newUser):

    reg_publicacoes, summary_publicacoes, keys_publicacoes = consultar_db('MATCH (n:Publicacoes {usuario: "' + oldUser + '"}) SET n.usuario = "' + newUser + '" RETURN n.usuario')
    reg_comments, summary_comments, keys_comments = consultar_db('MATCH (n:Comentario {usuario: "' + oldUser + '"}) SET n.usuario = "' + newUser + '" RETURN n.usuario')
    reg_messages, summary_messages, keys_messages = consultar_db('MATCH (n:Mensagem {usuario: "' + oldUser + '"}) SET n.usuario = "' + newUser + '" RETURN n.usuario')

    data = [reg_publicacoes, reg_comments,  reg_messages]

    return jsonify({"status": "success", "data": data}), 200

@app.route('/api/setUsuario', methods=['POST'])
def set_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    old_usuario = usuario['oldUsuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + old_usuario + '"}) SET n.usuario = "' + username + '" RETURN n.usuario')
    update = update_usuario(old_usuario, username)

    return jsonify({"status": "success", "data": reg}), 200


def update_nome(usuario, newNome):

    reg_publicacoes, summary_publicacoes, keys_publicacoes = consultar_db('MATCH (n:Publicacoes {usuario: "' + usuario + '"}) SET n.nome = "' + newNome + '" RETURN n.nome')
    reg_comments, summary_comments, keys_comments = consultar_db('MATCH (n:Comentario {usuario: "' + usuario + '"}) SET n.nome = "' + newNome + '" RETURN n.nome')
    reg_messages, summary_messages, keys_messages = consultar_db('MATCH (n:Mensagem {usuario: "' + usuario + '"}) SET n.nome = "' + newNome + '" RETURN n.nome')

    data = [reg_publicacoes, reg_comments,  reg_messages]

    return jsonify({"status": "success", "data": data}), 200

@app.route('/api/setNome', methods=['POST'])
def set_nome():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    old_nome = usuario['oldNome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) SET n.nome = "' + nome + '" RETURN n.nome')
    update = update_nome(username, nome)
   
    return jsonify({"status": "success", "data": reg}), 200


@app.route('/api/deleteUsuario', methods=['POST'])
def delete_usuario():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    nome = usuario['nome']
    senha = usuario['senha']
    img = usuario['avatar']
    desc = usuario['descricao']
    color = usuario['cor']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) DETACH DELETE n)')
   
    return jsonify({"status": "success", "data": reg}), 200


def create_notificacao(idNotificacao, usuario, conteudo, data, titulo, comunidade):
    reg, summary, keys = consultar_db(
        'MATCH (u:Usuario {usuario: "' + usuario + '"}) '
        'CREATE (n:Notificacao {id: "'+ idNotificacao +'", usuario: "' + usuario + '", conteudo: "' + conteudo + '", data: "' + data + '", titulo: "'+ titulo +'", comunidade: "'+ comunidade +'"})<-[:TEM_NOTIFICACAO]-(u) '
        'RETURN n'
    )
    return reg

@app.route('/api/criarPublicacao', methods=['POST'])
def create_publicacao():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    comunidade = post['comunidade']
    nome = post['nome']
    id_post = post['id']
    username = post['usuario']
    conteudo = post['conteudo']
    img = post['imagem']
    date = post['data']
  
    reg, summary, keys = consultar_db('CREATE (n:Publicacao {id: "' + id_post + '", usuario: "' + username + '", nome: "' + nome + '", conteudo: "' + conteudo + '", imagem: "' + img + '", data: "' + date + '"}) RETURN n')
    post, summary_post, keys_post = consultar_db('MATCH (p:Publicacao {id: "' + id_post +'"}), (c:Comunidade {nome:"' + comunidade + '"}) CREATE (p)-[:PERTENCE_A]->(c)')
    
    membros, summary_members, keys_members = consultar_db('MATCH (m:Usuario)-[:ESTA_EM]->(com:Comunidade {nome: "' + comunidade + '"}) RETURN m.usuario')
    members = [r['m.usuario'] for r in membros]
    members_not_repeated = list(set(members))

    # Extraindo as propriedades de cada nó 'Usuario'
    for membro in members_not_repeated:
        if (membro != username):
            title_name = "Nova Publicação em " + comunidade
            create_notificacao(id_post, membro, conteudo, date, title_name, comunidade)

    return post

def comentario_to_dict(c):
    # {id: "' + id_comentario + '", conteudo: "' + conteudo + '", data: "'+ date +'"}
    return {
        "id": c["id"],
        "nome": c["nome"],
        "conteudo": c["conteudo"],
        "data": c["data"],
        "usuario": c["usuario"]
    }

def curtida_to_dict(curtida):
    return {
        "usuario": curtida["usuario"]  # ou qualquer outra propriedade da curtida que seja relevante
    }

@app.route('/api/getPublicacoes', methods=['GET'])
def get_publicacoes():
    try:
        # data_received = request.json  # Os dados do formulário serão enviados como JSON
        # comunidade = data_received['comunidade']
        comunidade = request.args.get('comunidade')
        # reg, summary, keys = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})<-[:PERTENCE_A]-(p:Publicacao) RETURN p')

        reg, summary, keys = consultar_db(
            'MATCH (p:Publicacao)-[:PERTENCE_A]->(com:Comunidade {nome: "'+ comunidade +'"}) OPTIONAL MATCH (p)<-[:CURTIU]-(u:Usuario) OPTIONAL MATCH (p)<-[rel:COMENTOU]-(v:Usuario) RETURN p, collect(DISTINCT u.usuario) AS curtidas, collect(DISTINCT rel) AS comentarios')

        # Verificar o que está sendo retornado
        print("Dados recebidos da consulta:", reg)

        # Extraindo as propriedades de cada nó 'Publicacao'
        posts = []
        for record in reg:
            post_node = record['p']
            propriedades = {
                'id': post_node['id'],
                'nome': post_node['nome'],
                'usuario': post_node['usuario'],
                'conteudo': post_node['conteudo'],
                'imagem': post_node['imagem'],
                "curtidas": record["curtidas"],
                'data': post_node['data'],
                "comentarios": [comentario_to_dict(c) for c in record["comentarios"]]
            }
            posts.append(propriedades)


        # Verificar se as mensagens estão sendo extraídas corretamente
        print("Mensagens extraídas:", posts)

        df_bd1 = pd.DataFrame(posts, columns=['id', 'usuario', 'nome', 'imagem', 'conteudo', 'data', 'curtidas', 'comentarios'])
        return jsonify({"posts": df_bd1.to_dict(orient="records")}), 200
    
    except Exception as e:
        print(f"Erro ao obter posts: {e}")
        return jsonify({"error": f"Erro interno: {e}"}), 500


@app.route('/api/getPublicacoesUsuario', methods=['GET'])
def get_publicacoes_usuario():
    try:
        # data_received = request.json  # Os dados do formulário serão enviados como JSON
        # comunidade = data_received['comunidade']
        usuario = request.args.get('usuario')
        # reg, summary, keys = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})<-[:PERTENCE_A]-(p:Publicacao) RETURN p')

        reg, summary, keys = consultar_db(
            'MATCH (p:Publicacao {usuario: "'+ usuario +'"}) RETURN p')

        # Verificar o que está sendo retornado
        print("Dados recebidos da consulta:", reg)

        # Extraindo as propriedades de cada nó 'Publicacao'
        posts = []
        for record in reg:
            post_node = record['p']
            propriedades = {
                'id': post_node['id'],
                'nome': post_node['nome'],
                'usuario': post_node['usuario'],
                'conteudo': post_node['conteudo'],
                'imagem': post_node['imagem'],
                "curtidas": record["curtidas"],
                'data': post_node['data'],
                "comentarios": [comentario_to_dict(c) for c in record["comentarios"]]
            }
            posts.append(propriedades)


        # Verificar se as mensagens estão sendo extraídas corretamente
        print("Mensagens extraídas:", posts)

        df_bd1 = pd.DataFrame(posts, columns=['id', 'usuario', 'nome', 'imagem', 'conteudo', 'data', 'curtidas', 'comentarios'])
        return jsonify({"posts": df_bd1.to_dict(orient="records")}), 200
    
    except Exception as e:
        print(f"Erro ao obter posts: {e}")
        return jsonify({"error": f"Erro interno: {e}"}), 500

@app.route('/api/deletaPublicacao', methods=['POST'])
def delete_publicacao():
    try:
        post = request.json  # Os dados do formulário serão enviados como JSON
        print("Dados recebidos:", post)
        id_post = post['id']
  
        reg, summary, keys = consultar_db(
            'MATCH (p:Publicacao {id: "'+ id_post +'"}) DETACH DELETE p')

        return jsonify({"status": "success", "message": "A publicação foi apagada!"}), 200
    
    except Exception as e:
        print(f"Erro ao apagar post: {e}")
        return jsonify({"error": f"Erro interno: {e}"}), 500



def delete_curtida(usuario, post):
    try:
        reg, summary, keys = consultar_db(
        'MATCH (n:Usuario {usuario: "' + usuario + '"})-[rel:CURTIU]->(p:Publicacao {id: "' + post +'"}) DETACH DELETE rel'
        )
        
        return jsonify({"status": "success", "data": "Curtida removida com sucesso."}), 200
    
    except Exception as e:
        print("Erro:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/criarCurtida', methods=['POST'])
def create_curtida():
    post = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", post)
    usuario_que_curtiu = post['usuario']
    id_post = post['id']
    date = post['data']
    comunidade = post['comunidade']
   
    try:
        reg_already_exists, summary_already_exists, keys_already_exists = consultar_db(
        'MATCH (n:Usuario {usuario: "' + usuario_que_curtiu + '"})-[rel:CURTIU]->(p:Publicacao {id: "' + id_post +'"}) RETURN rel'
        )

        if (reg_already_exists):
            return delete_curtida(usuario_que_curtiu, id_post)
        else:  
            reg, summary, keys = consultar_db(
                'MATCH (n:Usuario {usuario: "' + usuario_que_curtiu + '"}), (p:Publicacao {id: "' + id_post +'"}) CREATE (n)-[rel:CURTIU]->(p) RETURN rel'
            )
            membros, summary_members, keys_members = consultar_db('MATCH (m:Usuario), (p:Publicacao {id: "'+ id_post +'"} WHERE m.usuario = p.usuario RETURN m.usuario')
            members = [r['m.usuario'] for r in membros]
            members_not_repeated = list(set(members))

            # Extraindo as propriedades de cada nó 'Usuario'
            for membro in members_not_repeated:
                title_name = "Nova Curtida em " + comunidade
                create_notificacao(id_post, membro, " ", date, title_name, comunidade)
            return jsonify({"status": "success", "data": "Curtida feita com sucesso!"}), 200

    except Exception as e:
        print("Erro:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/getCurtidas', methods=['GET'])
def get_curtidas():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    postagem = data_received['idPost']
    reg, summary, keys = consultar_db(
        'MATCH (p:Publicacao {id: "'+ postagem +'"})<-[:CURTIU]-(n:Usuario) RETURN n'
        )
    df_bd1 = pd.DataFrame(reg, columns=['usuario'])
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
    nome = post['nome']
    conteudo = post['conteudo']
    date = post['data']
    id_post = post['idPost']
    comunidade = post['comunidade']
  
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + usuario + '"}), (p:Publicacao {id: "' + id_post +'"}) CREATE (n)-[:COMENTOU {id: "' + id_comentario + '", conteudo: "' + conteudo + '", data: "'+ date +'", usuario: "'+ usuario +'", nome: "'+ nome +'"}]->(p)')

    membros, summary_members, keys_members = consultar_db('MATCH (m:Usuario), (p:Publicacao {id: "'+ id_post +'"}) WHERE m.usuario = p.usuario RETURN m.usuario')
    members = [r['m.usuario'] for r in membros]
    members_not_repeated = list(set(members))

        # Extraindo as propriedades de cada nó 'Usuario'
    for membro in members_not_repeated:
        if (membro != usuario):
            title_name = "Novo Comentário em " + comunidade
            create_notificacao(id_post, membro, conteudo, date, title_name, comunidade)
   
    return jsonify({"status": "success"}), 200

@app.route('/api/getComentarios', methods=['GET'])
def get_comentarios():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    postagem = data_received['idPost']
    reg, summary, keys = consultar_db('MATCH (p:Publicacao {id: "'+ postagem +'"})<-[rel:COMENTOU]-(n:Usuario) RETURN rel')
    df_bd1 = pd.DataFrame(reg, columns=['id', 'usuario', 'nome', 'conteudo', 'data',])
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
    try:
        id_message = message['id']
        comunidade = message['comunidade']
        usuario= message['usuario']
        conteudo = message['conteudo']
        date = message['data']
        color = message['color']

        # Criar a mensagem no banco de dados
        reg, summary, keys = consultar_db('CREATE (m: Mensagem {id: "' + id_message + '", usuario:"'+ usuario +'", conteudo: "' + conteudo + '", data: "'+ date +'", cor: "'+ color +'"}) RETURN m')
        reg_rel, summary_rel, keys_rel = consultar_db('MATCH (m: Mensagem {id: "' + id_message + '"}), (u:Usuario {usuario:"'+ usuario +'"}) CREATE (u)-[rel:ENVIOU]->(m) RETURN rel')
        print("Mensagem criada:", reg)

        # Relacionar a mensagem à conversa da comunidade
        msg, summary_msg, keys_msg = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})  OPTIONAL MATCH (c)-[:TEM_CONVERSA]->(n:Conversa) WITH c, n MERGE (m:Mensagem {id: "'+ id_message +'"}) MERGE (m)-[:EM]->(n) RETURN m')
        msgs = [node_to_dict(record['m']) for record in msg]
        msg_received = msgs[-1]  # Assume que o último registro contém a mensagem
        print("Mensagem relacionada à conversa:", msg_received)
    
        membros, summary_members, keys_members = consultar_db('MATCH (m:Usuario)-[:ESTA_EM]->(com:Comunidade {nome: "' + comunidade + '"}) RETURN m.usuario')
        members = [r['m.usuario'] for r in membros]
        members_not_repeated = list(set(members))

        # Extraindo as propriedades de cada nó 'Usuario'
        for membro in members_not_repeated:
            if (membro != usuario):
                title_name = "Nova Mensagem em " + comunidade
                create_notificacao(id_message, membro, conteudo, date, title_name, comunidade)
        
        return jsonify({"message": "Mensagem criada e relacionada com sucesso", "data": msg_received}), 200

    except KeyError as e:
        print(f"Erro: Chave ausente no JSON recebido: {e}")
        return {"error": f"Campo obrigatório ausente: {e}"}, 400

    except Exception as e:
        print(f"Erro ao criar a mensagem: {e}")
        return {"error": "Erro interno ao criar a mensagem"}, 500


@app.route('/api/getMensagens', methods=['GET'])
def get_mensagens():
    try:
        # data_received = request.json  # Os dados do formulário serão enviados como JSON
        # comunidade = data_received['comunidade']
        comunidade = request.args.get('comunidade')
        reg, summary, keys = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})-[:TEM_CONVERSA]->(n:Conversa)<-[:EM]-(m:Mensagem) RETURN m')

        # Verificar o que está sendo retornado
        print("Dados recebidos da consulta:", reg)

        # Extraindo as propriedades de cada nó 'Mensagem'
        mensagens = []
        for record in reg:
            mensagem_node = record['m']
            propriedades = {
                'id': mensagem_node['id'],
                'usuario': mensagem_node['usuario'],
                'conteudo': mensagem_node['conteudo'],
                'cor': mensagem_node['cor'],
                'data': mensagem_node['data']
            }
            mensagens.append(propriedades)


        # Verificar se as mensagens estão sendo extraídas corretamente
        print("Mensagens extraídas:", mensagens)

        df_bd1 = pd.DataFrame(mensagens, columns=['id', 'usuario', 'conteudo', 'data', 'cor'])
        return jsonify({"mensagens": df_bd1.to_dict(orient="records")}), 200
    
    except Exception as e:
        print(f"Erro ao obter mensagens: {e}")
        return jsonify({"error": f"Erro interno: {e}"}), 500


@app.route('/api/getNotificacoes', methods=['GET'])
def get_notificacoes():
    try:
        # data_received = request.json  # Os dados do formulário serão enviados como JSON
        # comunidade = data_received['comunidade']
        user = request.args.get('usuario')
        reg, summary, keys = consultar_db('MATCH (u:Usuario {usuario: "'+ user +'"})-[:TEM_NOTIFICACAO]->(n:Notificacao) RETURN n')

        # Verificar o que está sendo retornado
        print("Dados recebidos da consulta:", reg)

        # Extraindo as propriedades de cada nó 'Notificação'
        #'CREATE (n:Notificacao {id: "'+ idNotificacao +'", usuario: "' + usuario + '", conteudo: "' + conteudo + '", data: "' + data + '", titulo: "'+ titulo +'"})<-[:TEM_NOTIFICACAO]-(u) '
        notificacoes = []
        for record in reg:
            notificacoes_node = record['n']
            propriedades = {
                'id': notificacoes_node['id'],
                'usuario': notificacoes_node['usuario'],
                'conteudo': notificacoes_node['conteudo'],
                'titulo': notificacoes_node['titulo'],
                'data': notificacoes_node['data']
            }
            notificacoes.append(propriedades)


        # Verificar se as mensagens estão sendo extraídas corretamente
        print("Notificações extraídas:", notificacoes)

        df_bd1 = pd.DataFrame(notificacoes, columns=['id', 'usuario', 'conteudo', 'data', 'titulo'])
        return jsonify({"notificacoes": df_bd1.to_dict(orient="records")}), 200
    
    except Exception as e:
        print(f"Erro ao obter mensagens: {e}")
        return jsonify({"error": f"Erro interno: {e}"}), 500



# Running app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)


