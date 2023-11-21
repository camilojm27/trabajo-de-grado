import json

from app.Models.Container import create_container


def callback(ch, method, properties, body):
    message = json.loads(body)
    print("Received: ", message)

    create_container(message['image'], message['name'], message['ports'])
