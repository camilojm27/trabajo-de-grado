import os

from app.Utils.Utils import callback
from app.Utils.Connection import connection


def receive_data():
    # Establish a connection
    client_id = os.getenv('CLIENT_ID')
    channel = connection().channel()

    # Declare the exchange and queue
    channel.exchange_declare(exchange='amq.direct', durable=True)
    result = channel.queue_declare(queue=client_id, exclusive=False)
    queue_name = result.method.queue

    # Bind the queue to the exchange
    channel.queue_bind(exchange='amq.direct', queue=queue_name)

    # Set up a consumer and start consuming
    channel.basic_consume(
        queue=queue_name, on_message_callback=callback, auto_ack=True)

    print("Waiting for messages. To exit, press Ctrl+C")

    channel.start_consuming()
