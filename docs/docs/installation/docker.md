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
2. Abre el archivo `.env` con tu editor de texto preferido y configura las siguientes variables:

   - `APP_NAME`: Nombre de tu aplicación
   - `APP_URL`: URL de tu aplicación (por defecto: http://localhost)
   - `DB_PASSWORD`: Contraseña para la base de datos PostgreSQL
   - `REVERB_APP_ID`: Identificador único para tu aplicación Reverb
   - `REVERB_APP_KEY`: Clave de aplicación para Reverb
   - `REVERB_APP_SECRET`: Secreto de aplicación para Reverb

   Ejemplo de configuración de Reverb:

   ```
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

### Migración de la Base de Datos

Una vez que los contenedores estén en funcionamiento, ejecuta las migraciones y siembra la base de datos:

```bash
./vendor/bin/sail artisan migrate --seed
```

### Configuración de WebSockets

Asegúrate de que las variables de entorno para Reverb (`REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`) estén correctamente configuradas en tu archivo `.env`.

## Ejecución de Servicios Adicionales

Para el funcionamiento completo de la plataforma, necesitas ejecutar varios servicios. Puedes hacerlo manualmente o utilizando el script proporcionado.
<Tabs groupId="scrips">
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
<TabItem value="script" label="Script">

## Uso del Script de Automatización

Se proporciona un script para automatizar la ejecución de estos servicios. El script ofrece varias opciones:

- `-s`: Ejecuta solo la migración y siembra de la base de datos.
- `-i`: Genera la clave de la aplicación.
- `-k`: Instala las dependencias de npm.
- `-n`: Ejecuta todos los comandos de primera ejecución (migrar, generar clave, instalar npm).
- `-m`: Salta los comandos de primera ejecución y solo ejecuta los comandos principales.

Para utilizar el script:

1. Dale permisos de ejecución:

   ```bash
   chmod +x start.docker.dev.sh
   ```

2. Ejecútalo con las opciones deseadas:
   ```bash
   ./start.docker.dev.sh -n
   ```

El script manejará la ejecución de todos los procesos necesarios y los mantendrá en segundo plano. Puedes detener todos los procesos con `Ctrl+C`.
</TabItem>
</Tabs>

## Solución de Problemas Comunes

1. **Error de conexión a la base de datos**: Verifica que las credenciales en `.env` coincidan con las configuradas en `docker-compose.yml`.

2. **Los WebSockets no funcionan**: Asegúrate de que las variables de Reverb estén correctamente configuradas y que el servicio `reverb:start` esté en ejecución.

3. **Errores de AMQP**: Verifica que RabbitMQ esté funcionando correctamente dentro de Docker y que las credenciales en `.env` sean correctas. Espera hasta que Rabbitmq haya terminado de iniciar antes de lanzar los comandos de `amqp:metrics` y `amqp:consume`

## Referencias y Recursos Adicionales

- [Documentación oficial de Laravel](https://laravel.com/docs)
- [Laravel Sail](https://laravel.com/docs/sail)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [Laravel WebSockets (Reverb)](https://laravel.com/docs/11.x/reverb)

Para más información o soporte, consulta la documentación oficial de cada tecnología o abre un issue en el repositorio del proyecto.
