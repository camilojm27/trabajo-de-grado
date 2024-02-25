import docker
import json

client = docker.from_env()


def get_container() -> list:

    containers = client.containers.list(sparse=True, all=True)
    container_info_list = []
    for container in containers:
        container_info_list.append(container.attrs)
        print(json.dumps(container.attrs, indent=4))

    print(container_info_list)
    return container_info_list


# https://docker-py.readthedocs.io/en/stable/containers.html
def create_container(image, name, attributes):
    print(attributes)
    client.containers.run(image=image, name=name, detach=True)
    print('Contenedor creado')
