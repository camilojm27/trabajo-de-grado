import argparse
parser = argparse.ArgumentParser(description='Cliente de la plataforma de gestión de contenedores')
parser.add_argument('-n', '--name', type=str, help='Nombre de la máquina')
parser.add_argument('-w', '--welcome', type=str, help='Contraseña de bienvenida')
parser.add_argument('-v', '--version', action='version', version='%(prog)s 1.0')

# RabbitMQ credentials
parser.add_argument('-H', '--rabbitmq-host', type=str, help='Host de RabbitMQ')
parser.add_argument('-u', '--rabbitmq-username', type=str, help='Nombre de usuario de RabbitMQ')
parser.add_argument('-p', '--rabbitmq-password', type=str, help='Contraseña de RabbitMQ')



arguments = parser.parse_args()
print(arguments)
