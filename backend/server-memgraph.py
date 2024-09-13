from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import json
import pandas as pd

#A biblioteca do Memgraph (Não sei porque é o neo4j mas funciona) 
from neo4j import GraphDatabase
 
datahj = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)
#CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

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

def node_to_dict(node):
    """Converte um objeto Node do Neo4j para um dicionário."""
    return dict(node)

##################   ROTAS   ######################
 
@app.route('/api/login', methods=['POST'])
def send_data():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    login = data['usuario']
    senha = data['senha']
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + login + '", senha: "' + str(senha)+ '"}) RETURN n.nome AS nome, n.usuario AS usuario')
    print("Dados banco:")
    for record in reg:
        print(record["nome"])
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
    #Tirar dados que não sao usados aqui e coloca-los só ao atualizar 
    #img = "..."
    #desc = "..."
    #color = "..."
    reg_already_exist, summary_already_exist, keys_already_exist = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}) RETURN n.nome AS nome, n.usuario AS usuario')
    if (reg_already_exist):
        return reg_already_exist
    else:
        reg, summary, keys = consultar_db('CREATE (n:Usuario {usuario: "' + username + '", nome: "' + nome + '", senha: "' + senha + '"})')
        return reg

@app.route('/api/entraComunidade', methods=['POST'])
def entrar_em_comunidade():
    usuario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", usuario)
    username = usuario['usuario']
    comunidade = usuario['comunidade']

    reg_community, summary_community, keys_community = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade + '"}) RETURN c')
    reg_already_exist, summary_already_exist, keys_already_exist = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"})-[rel:ESTA_EM]->(c:Comunidade {nome: "'+ comunidade + '"}) RETURN rel')

    if (reg_already_exist):
        return reg_already_exist
    else:
        if(reg_community):
            reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}), (c:Comunidade {nome: "'+ comunidade + '"}) CREATE (n)-[rel:ESTA_EM]->(c) RETURN rel')
        else:
            reg_community, summary_community, keys_community = consultar_db('CREATE (c:Comunidade {nome: "'+ comunidade + '"}) RETURN c')
            reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + username + '"}), (c:Comunidade {nome: "'+ comunidade + '"}) CREATE (n)-[rel:ESTA_EM]->(c) RETURN rel')
   
    return reg

@app.route('/api/deletaUsuario', methods=['POST'])
def delete_usuario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    username = funcionario['usuario']
    reg, summary, keys = consultar_db('DELETE (n:Usuario) WHERE n.usuario = "' + username + '" RETURN n')  
    reg = {'error': False}
    return reg

@app.route('/api/getUsuarios', methods=['GET'])
def get_usuarios():
    reg, summary, keys = consultar_db('MATCH (n:Usuario) RETURN n')
    df_bd1 = pd.DataFrame(reg, columns=['usuario', 'nome', 'senha', 'descricao', 'avatar', 'cor'])
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
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[:ESTA_EM]->(c:Comunidade) RETURN c')
    df_bd1 = pd.DataFrame(reg, columns=['id','nome'])
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
    reg, summary, keys = consultar_db('MATCH (n:Usuario {usuario: "' + id_user +'"})-[rel:ESTA_EM]->(c:Comunidade: {nome: "'+ comunidade +'"}) DELETE rel')
    print("Dados retorno:", reg)
    return json.dumps(reg)

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
    reg, summary, keys = consultar_db('MATCH (n:Usuario {id: "' + username + '"}) SET n.nome = "' + nome + '", n.senha = "' + senha + ', n.avatar = "' + img + '", n.descricao = "' + desc +  '", n.color = "'+ color +'"})')
   
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
   
    return post

@app.route('/api/getPublicacoes', methods=['GET'])
def get_publicacoes():
    try:
        # data_received = request.json  # Os dados do formulário serão enviados como JSON
        # comunidade = data_received['comunidade']
        comunidade = request.args.get('comunidade')
        reg, summary, keys = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})<-[:PERTENCE_A]-(p:Publicacao) RETURN p')

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
                'data': post_node['data']
            }
            posts.append(propriedades)


        # Verificar se as mensagens estão sendo extraídas corretamente
        print("Mensagens extraídas:", posts)

        df_bd1 = pd.DataFrame(posts, columns=['id', 'usuario', 'nome', 'imagem', 'conteudo', 'data'])
        return jsonify({"posts": df_bd1.to_dict(orient="records")}), 200
    
    except Exception as e:
        print(f"Erro ao obter posts: {e}")
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
            return jsonify({"status": "success", "data": "Curtida feita com sucesso!"}), 200
    
    except Exception as e:
        print("Erro:", e)
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/api/getCurtidas', methods=['GET'])
def get_curtidas():
    data_received = request.json  # Os dados do formulário serão enviados como JSON
    postagem = data_received['idPost']
    reg, summary, keys = consultar_db('MATCH (p:Publicacao {id: "'+ postagem +'"})<-[:CURTIU]-(n:Usuario) RETURN n')
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
    conteudo = post['conteudo']
    date = post['data']
    id_post = post['idPost']
  
    reg, summary, keys = consultar_db('MATCH (n:Usuario), (p:Publicacao) WHERE n.usuario = "' + usuario + '" AND p.id = "' + id_post +'" CREATE (n:Usuario )-[:COMENTOU {id: "' + id_comentario + '", conteudo: "' + conteudo + '", data: "'+ date +'"}]->(p:Publicacao)')
   
    return reg

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
        print("Mensagem criada:", reg)

        # Relacionar a mensagem à conversa da comunidade
        msg, summary_msg, keys_msg = consultar_db('MATCH (c:Comunidade {nome: "'+ comunidade +'"})  OPTIONAL MATCH (c)-[:TEM_CONVERSA]->(n:Conversa) WITH c, n MERGE (m:Mensagem {id: "'+ id_message +'"}) MERGE (m)-[:EM]->(n) RETURN m')
        msgs = [node_to_dict(record['m']) for record in msg]
        msg_received = msgs[-1]  # Assume que o último registro contém a mensagem
        print("Mensagem relacionada à conversa:", msg_received)
        
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


# Running app
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)


