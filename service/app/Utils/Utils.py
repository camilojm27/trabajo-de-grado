import json
import sys
import time

from app.Models.Container import create_container


def callback(ch, method, properties, body):
    message = json.loads(body)
    data = message['data']
    print("Received: ", message)
    
    match message['action']:
        case 'CREATE':
            match message['model']:
                case 'container':
                    print('Creating container...')
                    #loading_indicator()
                    create_container(
                        data['image'], data['name'], data['attributes'], )

            




def loading_indicator():
    # Define the spinner characters
    spinner = ['-', '\\', '|', '/']

    # Set the interval for the spinner animation
    interval = 0.1

    try:
        start_time = time.time()
        while time.time() - start_time < 1:
            for char in spinner:
                sys.stdout.write('\r' + f'Loading {char}')
                sys.stdout.flush()
                time.sleep(interval)
    except KeyboardInterrupt:
        # Handle Ctrl+C to exit the loop gracefully
        print('\rLoading canceled.')
    finally:
        # Clear the line and move the cursor to the next line
        sys.stdout.write('\r' + ' ' * len('Loading ') + '\n')
        sys.stdout.flush()
