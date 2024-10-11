#!/bin/bash
set -e

# Start PHP-FPM
service php8.3-fpm start

# Start Nginx
service nginx start

# Start PostgreSQL
service postgresql start

# Start RabbitMQ
service rabbitmq-server start

# Start Supervisor 
/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf