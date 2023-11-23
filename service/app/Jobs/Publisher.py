import time
import pika
import json
from app.Models.Container import get_container
from app.Utils.Connection import connection


def send_data():

    channel = connection.channel()

    # Tiempo de vida del mensaje en milisegundos
    args = {"x-dead-letter-exchange": "amq.direct",
            "x-dead-letter-routing-key": "dead"}

    channel.queue_declare(queue='my_queue', durable=True, arguments=args)

    while True:
        data = get_container()
        channel.basic_publish(
            exchange='', routing_key='my_queue', body=json.dumps(data))
        print(" [x] Sent data")
        time.sleep(3)  # Espera 60 segundos

    connection.close()
