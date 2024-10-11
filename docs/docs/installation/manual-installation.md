---
sidebar_label: "Plataforma (manual)"
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guía de Instalación

Esta guía proporciona instrucciones detalladas para instalar y configurar las dependencias requeridas para el funcionamiento de la plataforma

## Base de Datos: PostgreSQL

:::info
Puedes usar cualquier base de datos SQL, ya que son compatibles con laravel, asegurate de instalar la extensión php para tu base de datos y de modificar el archivo .env, por ejemplo si quiero usar mysql debo instalar la extension php-mysql y configurar la variable `DB_CONNECTION` con `mysql`
:::
<Tabs groupId="operating-systems">
<TabItem value="ubuntu" label="Ubuntu/Debian">

Instalar PostgreSQL

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

Iniciar el servicio de PostgreSQL

```bash

sudo systemctl start postgresql
sudo systemctl enable postgresql
```

Crear una base de datos y un usuario (puedes usar el usuario postgres si deseas)

```bash

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
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
sudo dnf install nodejs npm
```

  </TabItem>
  <TabItem value="docker" label="Docker">
Tambien ejecutar nodejs o npm desde docker, el siguente comando es un ejemplo

```bash
docker run -it --rm node:20-slim node -v
```

  </TabItem>
</Tabs>

## PHP 8.2 y 8.3

Si tu distribución no provee php 8.2 u 8.3 debes instalar un repositorio externo como:

- https://php.watch/articles/php-8.3-install-upgrade-on-debian-ubuntu

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
# Instalar PHP y extensiones requeridas
sudo apt update
sudo apt install php php-{cli,fpm,pgsql,mbstring,xml,curl,zip,gd,bcmath,ldap,redis,amqp}

```

  </TabItem>
  <TabItem value="fedora" label="Fedora/RedHat">

```bash
# Instalar PHP y extensiones requeridas
sudo dnf install php php-{cli,fpm,pgsql,mbstring,xml,curl,zip,gd,redis,amqp}

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
  Puedes ejecutar composer desde docker, el siguente comando es un ejemplo

```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    composer --version
```

  </TabItem>
</Tabs>

<!-- ## Redis

<Tabs groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu/Debian">

```bash
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
</Tabs> -->

<!-- # Configuración de Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379 -->

## RabbitMQ

La plataforma utiliza el protocolo AMQP 9-0-1 con la implementación de rabbitmq, es necesario tener instalado:

- RabbitMQ 3.12 o mayor
- Habilitar el plugin de administración web

tambien puedes acceder a rabbitmq a travez de proveedores como [CloudAMQP](https://www.cloudamqp.com/) y [Stackhero](https://www.stackhero.io/)

<Tabs  groupId="operating-systems">
  <TabItem value="ubuntu" label="Ubuntu | Debian" default>
  Puedes instalar rabbitmq a travez de APT, si deseas la ultima versión utiliza los repositorios de rabbitmq https://www.rabbitmq.com/docs/install-debian
    ```bash
    sudo apt install rabbitmq-server
    sudo rabbitmq-plugins enable rabbitmq_management
    sudo systemctl restart rabbitmq-server
    sudo systemctl enable rabbitmq-server
````

  </TabItem>
  <TabItem value="fedora" label="Fedora | RedHat">
  Puedes instalar rabbitmq a travez de APT, si deseas la ultima versión utiliza los repositorios de rabbitmq https://www.rabbitmq.com/docs/install-rpm
      ```
    sudo dnf install rabbitmq-server
        sudo rabbitmq-plugins enable rabbitmq_management
    sudo systemctl restart rabbitmq-server
    sudo systemctl enable rabbitmq-server
    ```
    </TabItem>
      <TabItem value="docker" label="Docker">
      ```bash
    docker run --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
    ```
    </TabItem>
</Tabs>
## Configuración para el archivo .env de Laravel

Después de instalar las dependencias, necesitas configurar el archivo `.env` de tu aplicación. El archivo .env contiene muchos parametros que se pueden modificar en la aplicación, sin embargo los más importantes son:

```env
# Configuración de la base de datos
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=tg
DB_USERNAME=miusuario
DB_PASSWORD=micontraseña


# Configuración de RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_VHOST=/
RABBITMQ_LOGIN=guest
RABBITMQ_PASSWORD=guest

# Configuración de Reverb (WebSockets)
RABBITMQ_PUBLIC_HOST_IP= IP Publica del servidor de rabbitmq, es muy importante que esté bien configurado este valor ya que sin él los clientes no se pueden conectar.

#En estas variables de entorno puedes poner cualquier valor, unicamente se piden para poder identificar la aplicación y poder cifrar la conección de #websockets.

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
