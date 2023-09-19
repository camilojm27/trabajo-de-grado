# import docker
# import json
#
# # Create a Docker client
# client = docker.from_env()
#
# # List all containers
# containers = client.containers.list()
#
# # Convert container information to a list of dictionaries
# container_info_list = []
# for container in containers:
#     container_info = {
#         "Id": container.id,
#         "Name": container.name,
#         "Image": container.image.tags[0] if container.image.tags else None,
#         "Status": container.status,
#     }
#     container_info_list.append(container_info)
#
# # Convert the list of dictionaries to JSON format
# containers_json = json.dumps(container_info_list, indent=4)
#
# # Print the JSON representation of containers
# print(containers_json)

import pika

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='hello')

channel.basic_publish(exchange='', routing_key='hello', body='Hello World!')
print(" [x] Sent 'Hello World!'")
connection.close()
