# Use Ubuntu 24.04 as the base image
FROM ubuntu:24.04

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=1234
ENV POSTGRES_DB=tg

# Update and install dependencies
RUN apt-get update && apt-get install -y \
    software-properties-common \
    curl \
    git \
    unzip \
    nginx \
    supervisor \
    nano \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add PHP 8.3 repository
RUN add-apt-repository ppa:ondrej/php

# Install PHP 8.3 and extensions
RUN apt-get update && apt-get install -y \
    php8.3 \
    php8.3-fpm \
    php8.3-mysql \
    php8.3-pgsql \
    php8.3-sqlite3 \
    php8.3-gd \
    php8.3-curl \
    php8.3-imap \
    php8.3-mbstring \
    php8.3-xml \
    php8.3-zip \
    php8.3-bcmath \
    php8.3-soap \
    php8.3-intl \
    php8.3-readline \
    php8.3-ldap \
    php8.3-msgpack \
    php8.3-igbinary \
    php8.3-redis \
    php8.3-swoole \
    php8.3-memcached \
    php8.3-pcov \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install RabbitMQ
RUN apt-get update && apt-get install -y rabbitmq-server \
    && rabbitmq-plugins enable rabbitmq_management \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PostgreSQL
RUN apt-get update && apt-get install -y postgresql postgresql-contrib \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && service postgresql start \
    && su - postgres -c "psql --command \"CREATE USER $POSTGRES_USER WITH SUPERUSER PASSWORD '$POSTGRES_PASSWORD';\"" \
    && su - postgres -c "createdb -O $POSTGRES_USER $POSTGRES_DB"

# Set up Nginx
COPY nginx.conf /etc/nginx/sites-available/default

# Set up Supervisor configuration
COPY supervisor.conf /etc/supervisor/conf.d/platform.conf

# Set working directory
WORKDIR /var/www/html


# Copy Laravel files
COPY . /var/www/html

# Install Laravel dependencies
RUN composer install --no-interaction --no-dev --prefer-dist

RUN npm ci

RUN npm run build

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose ports
EXPOSE 80 5432 15672

# Set entrypoint
ENTRYPOINT ["/entrypoint.sh"]