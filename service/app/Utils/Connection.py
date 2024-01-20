import os
import pika
import requests
from typing import Tuple
import requests


def ping() -> Tuple[bool, bool]:
    response = requests.get(os.environ.get('APP_URL') + '/api/ping/')
    return response.status_code == 200, connection().is_open


def connection(): return pika.BlockingConnection(
    pika.ConnectionParameters(host=os.environ.get('RABBITMQ_HOST')))
