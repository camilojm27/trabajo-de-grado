import docker
import json

client = docker.from_env()


# class Singleton:
#     _instance = None

#     def __new__(cls, *args, **kwargs):
#         if not cls._instance:
#             cls._instance = super(Singleton, cls).__new__(cls, *args, **kwargs)
#         return cls._instance


def get_container():
    # Create a Docker client

    # List all containers
    containers = client.containers.list()

    # Convert container information to a list of dictionaries
    container_info_list = []
    for container in containers:
        container_info = {
            "Id": container.id,
            "Name": container.name,
            "Image": container.image.tags[0] if container.image.tags else None,
            "Status": container.status,
        }
        container_info_list.append(container_info)
        print(container_info)

    # Convert the list of dictionaries to JSON format
    containers_json = json.dumps(container_info_list)

    # Print the JSON representation of containers
    print(containers_json)
    return containers_json


# https://docker-py.readthedocs.io/en/stable/containers.html
def create_container(image, name, ports):
    client.containers.run(image=image, name=name, detach=True)
    print('Contenedor creado')
