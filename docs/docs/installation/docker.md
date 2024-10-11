---
#sidebar_position: 6
sidebar_label: "Plataforma (Docker)"
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Guía de Instalación y Configuración de Laravel con Docker

## Introducción

Esta guía proporciona instrucciones detalladas para instalar y configurar una aplicación Laravel que utiliza Docker, RabbitMQ y Laravel Reverb para WebSockets. La aplicación está diseñada para ofrecer una plataforma robusta de gestión de contenedores con funcionalidades en tiempo real.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

## Instalación

### Clonar el Repositorio

1. Abre una terminal y navega al directorio donde deseas clonar el proyecto.
2. Ejecuta el siguiente comando:
   ```
   git clone https://github.com/camilojm27/trabajo-de-grado.git
   ```
3. Ingresa al directorio del proyecto:
   ```
   cd trabajo-de-grado/platform
   ```

### Configuración del Entorno

1. Copia el archivo `.env.docker` a `.env`:
   ```
   cp .env.docker .env
   ```
2. Abre el archivo `.env` y configura las siguientes variables obligatorias:

En estas variables de entorno puedes poner cualquier valor, unicamente se piden para poder identificar la aplicación y poder cifrar la conección de websockets.

   <!-- - `APP_NAME`: Nombre de tu aplicación
   - `APP_URL`: URL de tu aplicación (por defecto: http://localhost)
   - `DB_PASSWORD`: Contraseña para la base de datos PostgreSQL -->

- `RABBITMQ_PUBLIC_HOST_IP`: IP Publica del servidor de rabbitmq, es muy importante que esté bien configurado este valor ya que sin él los clientes no se pueden conectar.
- `REVERB_APP_ID`: Identificador único para tu aplicación Reverb
- `REVERB_APP_KEY`: Clave de aplicación para Reverb
- `REVERB_APP_SECRET`: Secreto de aplicación para Reverb
- `REVERB_HOST`: Host publico de la aplicación

Ejemplo de configuración de Reverb:

```

REVERB_HOST= IP PUBLICA DE LA APLICACIÓN
REVERB_APP_ID=mi-app-plataforma
REVERB_APP_KEY=reverb_key_123456789
REVERB_APP_SECRET=reverb_secret_abcdefghijk
```

### Instalación de Dependencias

Utiliza uno de los siguientes métodos para instalar las dependencias de PHP:

<Tabs groupId="manager">
  <TabItem value="docker" label="Docker">

Si no tienes Composer instalado en tu sistema, puedes usar Docker para instalar las dependencias:

```bash
docker run --rm \
-u "$(id -u):$(id -g)" \
-v "$(pwd):/var/www/html" \
-w /var/www/html \
laravelsail/php83-composer:latest \
composer install --ignore-platform-reqs
```

  </TabItem>
  <TabItem value="composer" label="Composer" default>

Si tienes Composer instalado localmente, simplemente ejecuta:

```bash
composer install
```

  </TabItem>
</Tabs>

### Configuración de Laravel Sail

Laravel Sail se instalará automáticamente como parte de las dependencias del proyecto.

## Ejecución de la Aplicación

### Iniciar Contenedores

Para iniciar todos los contenedores definidos en el `docker-compose.yml`, ejecuta:

```bash
./vendor/bin/sail up -d
```

El flag `-d` ejecuta los contenedores en modo "detached", permitiéndote seguir usando la terminal.

## Ejecución de Servicios Adicionales

Para el funcionamiento completo de la plataforma, necesitas ejecutar varios servicios. Puedes hacerlo manualmente o utilizando el script proporcionado.
<Tabs groupId="scrips">
<TabItem value="script" label="Script">

## Uso del Script de Automatización

Se proporciona un script para automatizar la ejecución de comandos necesarios para que la aplicación funcione correctamente

El script ofrece las siguentes opciones:

- `-f`: Ejecutarlo solo la primera vez que ejecute la aplicación en el contenedor este comando ejecuta las funcionalidades basicas del script y adicionalmente realiza:

  - Migración de base de datos `php artisan migrate --seed`
  - Generación de la clave de la aplicación `php artisan key:generate`
  - Instalar las dependencias de JavaScript `npm install`
  - Transpilar el código de Typescript a Javascript minificado listo para producción `npm run build`

- `-p`: (Modo "Producción") Ejecuta los comandos necesarios para el funcionamiento de la aplicación, usando unicamente el javascrip transpilado. Proporciona un mayor rendimiento a la aplicación pero no actualiza cambios realizados en JavaScript.

Para utilizar el script:

1. Dale permisos de ejecución:

   ```bash
   chmod +x start.docker.dev.sh
   ```

2. Ejecútalo la primera vez:
   ```bash
   ./vendor/bin/sail shell start.docker.dev.sh -f
   ```
3. En adelante:
   ```bash
   ./vendor/bin/sail shell start.docker.dev.sh
   ```

El script manejará la ejecución de todos los procesos necesarios y los mantendrá en segundo plano. Puedes detener todos los procesos con `Ctrl+C`.
</TabItem>
<TabItem value="manual" label="Manual">

### Ejecución Manual

Abre varias terminales y ejecuta cada uno de estos comandos en una terminal separada:

1. Servidor Laravel:

   ```bash
   ./vendor/bin/sail php artisan serve
   ```

2. Servidor WebSocket Reverb:

   ```bash
   ./vendor/bin/sail php artisan reverb:start
   ```

3. Consumidor de métricas AMQP:

   ```bash
   ./vendor/bin/sail php artisan amqp:metrics
   ```

4. Consumidor AMQP general:

   ```bash
   ./vendor/bin/sail php artisan amqp:consume
   ```

5. Compilación de assets (en modo de desarrollo):

   ```bash
   ./vendor/bin/sail npm run dev
   ```

   O para producción:

   ```bash
   ./vendor/bin/sail npm run build
   ```

</TabItem>
</Tabs>
