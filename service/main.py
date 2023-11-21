import multiprocessing
from app.Jobs.Subscriber import receive_data
from app.Jobs.Publisher import send_data
import pika
import json
import time
from app.Models.Container import get_container


# containers_json = getContainer()
# connection = pika.BlockingConnection(
#     pika.ConnectionParameters(host='localhost'))
# channel = connection.channel()

# channel.queue_declare(queue='hello')

# channel.basic_publish(exchange='', routing_key='hello', body=containers_json)
# print(" [x] Sent 'Hello World!'")
# connection.close()


if __name__ == "__main__":

    # Create two processes for producer and consumer
    # producer_process = multiprocessing.Process(target=send_data)
    consumer_process = multiprocessing.Process(target=receive_data)

    # Start both processes
    # producer_process.start()
    consumer_process.start()

    # Wait for both processes to finish
    consumer_process.join()

    # producer_process.join()
