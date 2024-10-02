---
sidebar_label: "Plataforma (manual)"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guía de Instalación Mejorada para Dependencias de la Plataforma

Esta guía proporciona instrucciones detalladas para instalar y configurar las dependencias requeridas para la Plataforma de Gestión de Contenedores. Cubre PostgreSQL, Node.js, PHP con extensiones, Composer y Redis en Ubuntu/Debian, Fedora/RedHat y Docker.

## Base de Datos: PostgreSQL

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Iniciar el servicio de PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear una base de datos y un usuario
sudo -u postgres psql
CREATE DATABASE tg;
CREATE USER miusuario WITH ENCRYPTED PASSWORD 'micontraseña';
GRANT ALL PRIVILEGES ON DATABASE tg TO miusuario;
\q
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar PostgreSQL
sudo dnf install postgresql postgresql-server
sudo postgresql-setup --initdb

# Iniciar el servicio de PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Crear una base de datos y un usuario
sudo -u postgres psql
CREATE DATABASE tg;
CREATE USER miusuario WITH ENCRYPTED PASSWORD 'micontraseña';
GRANT ALL PRIVILEGES ON DATABASE tg TO miusuario;
\q
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```bash
# Ejecutar contenedor de PostgreSQL
docker run --name postgres-db -e POSTGRES_PASSWORD=micontraseña -e POSTGRES_DB=tg -p 5432:5432 -d postgres

# Crear un usuario (opcional, ya que el usuario por defecto es 'postgres')
docker exec -it postgres-db psql -U postgres
CREATE USER miusuario WITH ENCRYPTED PASSWORD 'micontraseña';
GRANT ALL PRIVILEGES ON DATABASE tg TO miusuario;
\q
```

  </TabItem>
</Tabs>

## Node.js y npm

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar Node.js y npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar Node.js y npm
sudo dnf install nodejs
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```bash
# Usar Node.js en tu Dockerfile
FROM node:20

# O ejecutar un contenedor de Node.js
docker run -it --rm node:20 node -v
```

  </TabItem>
</Tabs>

## PHP con Extensiones

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar PHP y extensiones requeridas
sudo apt update
sudo apt install php8.2 php8.2-{cli,fpm,pgsql,mbstring,xml,curl,zip,gd,bcmath,ldap,redis,amqp}

# Instalar PECL y la extensión AMQP
sudo apt install php-pear
sudo pecl install amqp
sudo echo "extension=amqp.so" > /etc/php/8.2/mods-available/amqp.ini
sudo phpenmod amqp
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar PHP y extensiones requeridas
sudo dnf install php php-{cli,fpm,pgsql,mbstring,xml,curl,zip,gd,bcmath,ldap,redis,amqp}

# Instalar PECL y la extensión AMQP
sudo dnf install php-pear
sudo pecl install amqp
sudo echo "extension=amqp.so" > /etc/php.d/40-amqp.ini
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```dockerfile
# Usar esto en tu Dockerfile
FROM php:8.2-fpm

# Instalar dependencias y extensiones de PHP
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libgd-dev \
    librabbitmq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring xml curl zip gd bcmath ldap \
    && pecl install redis amqp \
    && docker-php-ext-enable redis amqp
```

  </TabItem>
</Tabs>

## Composer

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar Composer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```dockerfile
# Usar esto en tu Dockerfile
FROM php:8.2-fpm

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

  </TabItem>
</Tabs>

## Redis

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar Redis
sudo apt update
sudo apt install redis-server

# Iniciar el servicio de Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verificar la instalación
redis-cli ping
# Debería responder con "PONG"
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar Redis
sudo dnf install redis

# Iniciar el servicio de Redis
sudo systemctl start redis
sudo systemctl enable redis

# Verificar la instalación
redis-cli ping
# Debería responder con "PONG"
```

  </TabItem>
  <TabItem value="docker" label="Docker">

```bash
# Ejecutar contenedor de Redis
docker run --name redis-cache -p 6379:6379 -d redis

# Verificar la instalación
docker exec -it redis-cache redis-cli ping
# Debería responder con "PONG"
```

  </TabItem>
</Tabs>

## Configuración para el archivo .env de Laravel

Después de instalar las dependencias, necesitas configurar el archivo `.env` de tu aplicación Laravel. Aquí tienes una explicación de las configuraciones clave:

```env
# Configuración de la base de datos
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tg
DB_USERNAME=miusuario
DB_PASSWORD=micontraseña

# Configuración de Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Configuración de RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
RABBITMQ_LOGIN=guest
RABBITMQ_PASSWORD=guest

# Configuración de Reverb (WebSockets)
REVERB_APP_ID=tu_app_id
REVERB_APP_KEY=tu_app_key
REVERB_APP_SECRET=tu_app_secret
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http
```

Asegúrate de reemplazar los valores de ejemplo con tus detalles de configuración reales. Por ejemplo:

1. Establece `DB_USERNAME` y `DB_PASSWORD` con el usuario y contraseña de PostgreSQL que creaste.
2. Si estás usando un host diferente para PostgreSQL (por ejemplo, un contenedor Docker), actualiza `DB_HOST` en consecuencia.
3. Configura los ajustes de RabbitMQ según tu instalación. Si estás usando la configuración por defecto, los valores proporcionados deberían funcionar.
4. Para Reverb (WebSockets), necesitarás generar los valores de `REVERB_APP_ID`, `REVERB_APP_KEY`, y `REVERB_APP_SECRET`. Consulta la documentación de Reverb para obtener instrucciones sobre cómo generar estos valores.
5. Para Redis, si has cambiado la configuración por defecto, actualiza `REDIS_HOST`, `REDIS_PASSWORD`, y `REDIS_PORT` según sea necesario.

Recuerda ejecutar `php artisan config:cache` después de hacer cambios en tu archivo `.env` para asegurarte de que los cambios surtan efecto.
