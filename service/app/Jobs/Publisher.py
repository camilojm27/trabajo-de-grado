import os
import time
import pika
import json
from app.Models.Container import get_container
from app.Utils.Connection import connection


def send_data():
    routing_key = 'general'
    channel = connection().channel()

    # Tiempo de vida del mensaje en milisegundos
    args = {"x-dead-letter-exchange": "amq.direct",
            "x-dead-letter-routing-key": "dead"}

    channel.queue_declare(queue=routing_key, durable=False)
    client_id = os.getenv('CLIENT_ID')
    while True:
        data = {
            'context': 'containers',
            'node_id': client_id,
            'containers': get_container()
        }
        channel.basic_publish(exchange='', routing_key=routing_key, body=json.dumps(data))
        print(" [x] Sent data")
        time.sleep(5)  # Espera 60 segundos

    connection.close()
