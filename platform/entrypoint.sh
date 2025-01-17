#!/bin/bash
set -e

FLAG_FILE="/var/www/html/first_run_done.flag"

# Start PHP-FPM
service php8.3-fpm start

# Start Nginx
service nginx start

# Start PostgreSQL
service postgresql start

# Start RabbitMQ
service rabbitmq-server start

# Check if migrations have already run
if [ ! -f "$FLAG_FILE" ]; then
  echo "Running migrations..."

  php artisan migrate --force
  php artisan key:generate

  echo "Creating flag file..."
  touch "$FLAG_FILE"
else
fi

# Start Supervisor
/usr/bin/supervisord -n -c /etc/supervisor/supervisord.conf
