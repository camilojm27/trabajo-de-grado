import os
import requests
import uuid
import platform
from dotenv import load_dotenv, set_key
from dotenv import dotenv_values

from app.Utils.Connection import ping
from app.Utils.Utils import loading_indicator

hostname = platform.node()
client_id = os.getenv('CLIENT_ID')
rabbitmq_login = os.getenv("RABBITMQ_LOGIN")
rabbitmq_password = os.getenv("RABBITMQ_PASSWORD")
rabbitmq_host = os.getenv("RABBITMQ_HOST")
rabbitmq_port = os.getenv("RABBITMQ_PORT")
welcome_key = os.getenv("WELCOME_KEY")


def verify_env():
    if welcome_key is None or welcome_key == '':
        print("Welcome key is not defined")
        exit()
    if rabbitmq_login is None or rabbitmq_login == '':
        print("RabbitMQ login is not defined")
        exit()
    if rabbitmq_password is None or rabbitmq_password == '':
        print("RabbitMQ password is not defined")
        exit()
    if rabbitmq_host is None or rabbitmq_host == '':
        print("RabbitMQ host is not defined")
        exit()
    if rabbitmq_port is None or rabbitmq_port == '':
        print("RabbitMQ port is not defined")
        exit()
    if client_id is None or not uuid.UUID(client_id, version=4):
        print("Client ID is not defined")
        app_ping, rabbitmq_ping = ping()
        if app_ping is False:
            print("The server is not available")
            exit()
        if rabbitmq_ping is False:
            print("The RabbitMQ server is not available")
        print("Getting new credentials, please wait...")
        loading_indicator()
        get_credentials()


def get_credentials():
    if client_id is None or not uuid.UUID(client_id, version=4):
        # Make a request to the API to get the new value
        # add headers accept json to the resquest
        response = requests.post(os.environ.get('APP_URL') + 'api/nodes/',
                                 data={
                                     'hostname': hostname, 'welcome_key': 1234},
                                 headers={'Accept': 'application/json'})
        if response.status_code >= 400:
            print(response.json()['message'])
            if response.json()['message'] == 'The hostname has already been taken.':
                print("Please change the hostname and try again")
            exit()
        else:
            new_api_value = response.json()['id']
            print('CLIENT_ID=' + new_api_value)
            set_key(".env", 'CLIENT_ID', new_api_value)

            response = requests.get(os.environ.get('APP_URL') + '/api/nodes/credentials/' + new_api_value,
                                    headers={'Accept': 'application/json'})
            if response.status_code == 200:
                credentials = response.json()
                print(credentials)
                for var, valor in credentials.items():
                    set_key(".env", var, valor)
