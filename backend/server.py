from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import requests
import json
import pandas as pd
import psycopg2
 
datahj = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
CORS(app)

# Função para criar conexão no banco
def conecta_db():
  #con = psycopg2.connect(host='localhost', 
  #                       database='supermercadoBD',
  #                       user='postgres', 
  #                       password='Valamiel@20')
  con = psycopg2.connect(host='localhost', 
                         database='superManeger',
                         user='postgres', 
                         password='147258')
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
  except (Exception, psycopg2.DatabaseError) as error:
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
    login = data['login']
    senha = data['senha']
    reg = consultar_db('select cpfop, opnome from public.operador where cpfop = \'' + login +'\' and senhaop = '+ str(senha))
    ger = consultar_db('select cpfge, gernome from public.gerente where cpfge = \'' + login +'\' and senhager = '+ str(senha))
    rep = consultar_db('select cpfrep, repnome from public.repositor where cpfrep = \'' + login +'\' and senharep = '+ str(senha))
    print("Dados banco:", reg)
    if(len(reg) > 0):
        df_bd = pd.DataFrame(reg, columns=['cpfop', 'opnome'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'option': 1,
                'cpfop': df_bd['cpfop'][0],
                'opnome': df_bd['opnome'][0]}
        result = 0
    elif(len(ger) > 0):
        df_bd = pd.DataFrame(ger, columns=['cpfge', 'gernome'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'option': 2,
                'cpfge': df_bd['cpfge'][0],
                'gernome': df_bd['gernome'][0]}
    elif(len(rep) > 0):
        df_bd = pd.DataFrame(rep, columns=['cpfrep', 'repnome'])
        df_bd.head()
        df_bd = df_bd.to_dict()
        data = {'error': False,
                'option': 3,
                'cpfrep': df_bd['cpfrep'][0],
                'repnome': df_bd['repnome'][0]}
    else:
       df_bd = {}
       data = {'error': True,
               'mensage': 'Não foi possivel encontrar o funcionario'}
    return data

@app.route('/api/criaEncomenda', methods=['POST'])
def create_encomenda():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    solicitante = data['solicitante']
    cdprod = data['cdprod']
    quantidade = data['quantidade']
    #primeiro pega produto baseado no cdprod
    #calcula valor
    valor = 0
    produto = consultar_db('select valor from public.produto where codbarras= \'' + cdprod +'\'')
    df_bd = pd.DataFrame(produto, columns=['valor'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd['valor'][0])
    valor = float(df_bd['valor'][0]) * float(quantidade)
    inserir_db('INSERT INTO ENCOMENDA (cdprod, datapedido, quantidade, valor, status, solicitante) VALUES ( \''+ cdprod +'\', \'' + str(datahj) + '\', '+ quantidade + ', ' + str(round(valor, 2)) + ', \'Aguardando autorização\', \'' + solicitante + '\')')
    
    return data

@app.route('/api/atualizaEncomenda', methods=['POST'])
def update_encomenda():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    status = data['status']
    encomenda = inserir_db('UPDATE ENCOMENDA SET STATUS = \'' + status +'\' WHERE IDENCOMENDA = ' + id)
    data = {'error': False}
    return data

@app.route('/api/atualizaEstoque', methods=['POST'])
def update_estoque():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    quantidade = data['quantidade']
    encomenda = inserir_db('UPDATE ESTOQUE SET QUANTATUALPROD = \'' + quantidade +'\' WHERE IDESTOQUE = ' + id)
    data = {'error': False}
    return data

@app.route('/api/atualizaPrateleira', methods=['POST'])
def update_prateleira():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    quantidade = data['quantidade']
    encomenda = inserir_db('UPDATE PRATELEIRA SET QUANTATUALPROD = \'' + quantidade +'\' WHERE IDPRAT = ' + id)
    data = {'error': False}
    return data

@app.route('/api/deletaEncomenda', methods=['POST'])
def delete_encomenda():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    encomenda = inserir_db('DELETE FROM ENCOMENDA WHERE idencomenda = ' + id)
    data = {'error': False}
    return data

@app.route('/api/getEncomendas', methods=['GET'])
def get_encomenda():
    encomenda = consultar_db('SELECT E.IDENCOMENDA, R.REPNOME, P.PRODNOME, E.DATAPEDIDO,'+
                             ' E.QUANTIDADE, E.VALOR, E.STATUS'+
                             ' FROM ENCOMENDA E, PRODUTO P, REPOSITOR R '+
                             'WHERE E.SOLICITANTE = R.CPFREP AND E.CDPROD = P.CODBARRAS')
    df_bd = pd.DataFrame(encomenda, columns=['idencomenda', 'repnome', 'prodnome', 'datapedido', 'quantidade', 'valor', 'status'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd

@app.route('/api/getEstoque', methods=['GET'])
def get_estoque():
    estoque = consultar_db('SELECT E.IDESTOQUE, P.PRODNOME, E.QUANTATUALPROD, E.SECAO ' +
                             'FROM ESTOQUE E, PRODUTO P '+
                             'WHERE E.CDPROD = P.CODBARRAS')
    df_bd = pd.DataFrame(estoque, columns=['idestoque', 'prodnome', 'quantatualprod', 'secao'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd

@app.route('/api/getPrateleira', methods=['GET'])
def get_prateleira():
    estoque = consultar_db('SELECT T.IDPRAT, T.SECAO, P.PRODNOME, T.QUANTATUALPROD '+
                            'FROM PRATELEIRA T, PRODUTO P '+
                            'WHERE T.CDPROD = P.CODBARRAS')
    df_bd = pd.DataFrame(estoque, columns=['idprat', 'secao', 'prodnome', 'quantatualprod'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd

@app.route('/api/criaChamado', methods=['POST'])
def create_chamado():
    chamado = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", chamado)
    cpffuncionario = '12345678910'
    nome = chamado['nome']
    departamento = chamado['departamento']
    titulo = chamado['titulo']
    assunto = chamado['assunto']
    inserir_db('INSERT INTO RECURSOSHUMANOS(cpffuncionario, nomefuncionario,'+
               ' departamento, titulo, assunto) '+
                ' VALUES ( \''+ cpffuncionario +'\', \'' + nome + '\', '+ departamento +', \'' + titulo + '\', \'' + assunto + '\')')
    
    return chamado

@app.route('/api/entraCaixa', methods=['POST'])
def entra_caixa():
    chamado = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", chamado)
    idope = chamado['idope']
    idcaixa = chamado['idcaixa']
    inserir_db('INSERT INTO OPERA'+
                ' VALUES ( \''+ str(idope) +'\', \'' + str(idcaixa) + '\', \''+ str(datahj) +'\', \''+ str(datahj) +'\')')
    
    return chamado

@app.route('/api/getChamado', methods=['GET'])
def get_chamado():
    estoque = consultar_db('SELECT * FROM RECURSOSHUMANOS')
    df_bd = pd.DataFrame(estoque, columns=['idchamado', 'cpffuncionario', 'nomefuncionario', 'departamento', 'titulo', 'assunto'])
    df_bd.head()
    df_bd = df_bd.to_dict()
    print("Dados banco:", df_bd)
    return df_bd


@app.route('/api/deletaChamado', methods=['POST'])
def delete_chamado():
    data = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", data)
    id = data['id']
    chamado = inserir_db('DELETE FROM RECURSOSHUMANOS WHERE idencomenda = ' + id)
    data = {'error': False}
    return data


@app.route('/api/getFuncionario', methods=['GET'])
def get_funcionario():
    operador = consultar_db('SELECT O.CPFOP, O.OPNOME, O.SALARIOOP, O.DATAINIOP, O.HORAINTER FROM OPERADOR O')
    repositor = consultar_db('SELECT R.CPFREP, R.REPNOME, R.SALARIOREP, R.DATAINIREP FROM REPOSITOR R')
    df_bd1 = pd.DataFrame(operador, columns=['cpfop', 'opnome', 'salarioop', 'datainiop', 'horainter'])
    df_bd2 = pd.DataFrame(repositor, columns=['cpfrep', 'repnome', 'salariorep', 'datainirep'])
    df_bd1.head()
    df_bd2.head()
    df_bd1 = df_bd1.to_dict()
    df_bd2 = df_bd2.to_dict()
    print("Dados banco op:", df_bd1)
    print("Dados banco rep:", df_bd2)

    dict_funcionarios = []
    
    for i in range(len(df_bd1['cpfop'])):
    #for operador in df_bd1:
        dict_funcionarios.append({'cpf': df_bd1['cpfop'][i],
            'nome': df_bd1['opnome'][i],
            'salario': df_bd1['salarioop'][i],
            'dataInicio': str(df_bd1['datainiop'][i]),
            'horaIntervalo': str(df_bd1['horainter'][i]),
            'funcao': 'Operador'})
        

    for i in range(len(df_bd2['cpfrep'])):
    #for repositor in df_bd2:
        dict_funcionarios.append({'cpf': df_bd2['cpfrep'][i],
          'nome': df_bd2['repnome'][i],
          'salario': df_bd2['salariorep'][i],
          'dataInicio': str(df_bd2['datainirep'][i]),
          'horaIntervalo': '12:15',
          'funcao': 'Repositor'})


    print("Dados retorno:", dict_funcionarios)
    return json.dumps(dict_funcionarios)

@app.route('/api/criaFuncionario', methods=['POST'])
def create_funcionario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    if(funcionario['funcao'] == 'Operador'):
        cpf = funcionario['cpf']
        nome = funcionario['nome']
        ##funcao = funcionario['funcao']
        senha = funcionario['senha']
        salario = funcionario['salario']
        ##datainiop = funcionario['datainiop']
        horainter =funcionario['intervalo']
        inserir_db('INSERT INTO OPERADOR(senhaop, opnome, cpfop, datainiop, salarioop, horainter) '+
                ' VALUES ( ' + senha + ', \'' + nome + '\',  \''+ cpf +'\',\'' + str(datahj) + '\', ' + salario + ',  \'' + horainter + '\')')
    if(funcionario['funcao'] == 'Repositor'):
        cpf = funcionario['cpf']
        nome = funcionario['nome']
        ##funcao = funcionario['funcao']
        senha = funcionario['senha']
        salario = funcionario['salario']
        setor = funcionario['setor']
        ##datainirep = funcionario['datainirep']
        ##horainter =funcionario['horainter']
        inserir_db('INSERT INTO REPOSITOR( senharep, repnome, cpfrep, datainirep, salariorep, setor) '+
                ' VALUES ( ' + senha + ', \'' + nome + '\', \''+ cpf +'\', \'' + str(datahj) + '\', ' + salario + ', \'' + setor+ '\')')

    return funcionario

@app.route('/api/deletaFuncionario', methods=['POST'])
def delete_funcionario():
    funcionario = request.json  # Os dados do formulário serão enviados como JSON
    print("Dados recebidos:", funcionario)
    if(funcionario['funcao'] == 'Operador'):
        cpfop = funcionario['cpf']
        funcionario = inserir_db('DELETE FROM OPERA WHERE idope = \'' + cpfop + '\'')
        funcionario = inserir_db('DELETE FROM OPERADOR WHERE cpfop = \'' + cpfop + '\'')
        
    elif(funcionario['funcao'] == 'Repositor'):
        cpfrep = funcionario['cpf']
        funcionario = inserir_db('DELETE FROM REPOSITOR WHERE cpfrep = \'' + cpfrep +'\'')
    funcionario = {'error': False}
    return funcionario

# Running app
if __name__ == '__main__':
    app.run(debug=True)


