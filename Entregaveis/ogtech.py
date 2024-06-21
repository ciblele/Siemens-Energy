from datetime import datetime
import json
import os
import random
import time
from faker import Faker #gera dados fictícios
from confluent_kafka import Producer

# setando variáveis
topic = 'ogtech' 
# nome do topico criado anteriormente. Comando (criei outro pelo VSCode, mas esse foi pelo cmd): kafka-topics.bat --bootstrap-server localhost:9092 --topic ogtech --create 
conf = {
    'bootstrap.servers': 'localhost:9092'
}
pasta_destino = './json'
os.makedirs(pasta_destino, exist_ok=True)
lista_dados = []

# Um Producer é o responsável por enviar mensagens/registros para um tópico do Kafka
# Aqui está apenas ilustrativo porque o que realmente uso é o json criado abaixo
def envia_dados(data):
    producer = Producer(conf)
    try:
        producer.produce(topic, json.dumps(data).encode('utf-8'))
        producer.flush()
        print(f"Dados enviados com sucesso: {data}")
    except Exception as e:
        print(f"Erro no envio dos dados: {str(e)}")

# Função para gerar dados fictícios do equipamento da O&GTech
def gera_dados():
    fake = Faker()
    # Tinha feito assim para que ficasse enviando dados indefinidamente, mas para exportar um json, optei por um volume limitado :)
    # while True:
    data = {
        'timestamp': int(time.time()),  
        'sensor_id': fake.random_int(min=1, max=100),  
        'temperatura': round(random.uniform(-20, 80), 2),  
        'pressao': round(random.uniform(100, 1000), 2),  
        'umidade': round(random.uniform(0, 70), 2),  
        'status': random.choice(['normal', 'alerta', 'urgente']), 
        'fabricante': fake.company(),  
        'serial': fake.uuid4(), 
    }
        
    return data    
    # comentei pois para exportar o json nao preciso dessa função e nem do sleep
    #envia_dados(data)
    #time.sleep(1)  # Espera 1 segundo antes de enviar o próximo dado
        
def gerar_json():
    for i in range(25, -1, -1): 
        dados = gera_dados()
        lista_dados.append(dados)
        
    # Coloquei o nome exclusivo para o caso de gerar mais de um json
    nome_arq = f"{pasta_destino}/dados_{int(time.time())}.json"
    
    with open(nome_arq, 'w') as f:
        f.write(json.dumps(lista_dados) + '\n')
    
# Chamada para iniciar a geração de dados fictícios
if __name__ == '__main__':
    gerar_json()
