import os
import requests
import uuid
from dotenv import load_dotenv, set_key
# Get the value of the client_id environment variable
client_id = os.getenv('CLIENT_ID')
print(client_id)
if client_id is None or not uuid.UUID(client_id, version=4):
    # Make a request to the API to get the new value
    # add headers accept json to the resquest

    response = requests.post('http://localhost:8000/api/nodes/',
                             data={'name': 'Node 1', 'hostname': 'aiden', 'welcome_key': 1234},
                             headers={'Accept': 'application/json'})
    if response.status_code >= 400:
        print(response.json()['message'])
    else:
        new_api_value = response.json()['id']
        print(new_api_value)

        response = requests.get('http://localhost:8000/api/nodes/credentials/' + new_api_value,
                                headers={'Accept': 'application/json'})
        if response.status_code == 200:
            credentials = response.json()
            print(credentials)
            for var, valor in credentials.items():
                set_key(".env", var, valor)
