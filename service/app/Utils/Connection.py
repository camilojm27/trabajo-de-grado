import os
import pika

rabbit_host = str(os.environ.get('RABBITMQ_HOST'))
connection = pika.BlockingConnection(
    pika.ConnectionParameters(rabbit_host))
