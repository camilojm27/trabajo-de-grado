---
#sidebar_position: 6
sidebar_label: "Plataforma (Docker)"
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Docker

Para instalar y ejecutar la aplicación utilizaremos el sistema proporcionado por Laravel llamado [Laravel Sail](https://laravel.com/docs/11.x/sail), que nos facilita la gestion

# Laravel Sail

Es una interfaz de línea de comandos ligera para interactuar con el entorno de desarrollo Docker. Sail proporciona un gran punto de partida para la construcción de una aplicación sin necesidad de experiencia previa en Docker.

Para utilizar esta herramienta, unicamente debemos instalar las dependencias de PHP del proyecto usando el gestor [composer](https://getcomposer.org/), tambien podemos usar una imagen de docker para composer si queremos.

:::info
Todos los siguentes comandos deben ser ejecutados en la carpeta platform
:::

<Tabs  groupId="manager">
  <TabItem value="docker" label="Docker">
En caso de que no tengas composer en el sistema, puedes instalar las dependencias con docker tambien

```bash
docker run --rm \
-u "$(id -u):$(id -g)" \
-v "$(pwd):/var/www/html" \
-w /var/www/html \
laravelsail/php83-composer:latest \
composer install --ignore-platform-reqs
```

  </TabItem>

  <TabItem value="coposer" label="Composer" default>
`composer install`

  </TabItem>

</Tabs>

<!-- <Tabs  groupId="manager">
  <TabItem value="docker" label="Docker">
```bash
    docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php83-composer:latest \
    php artisan sail:install
```
  </TabItem>
  <TabItem value="coposer" label="Composer" default>
`php artisan sail:install`

  </TabItem>
</Tabs> -->

Para ejecutar el contenedor ingresas el comando, este se encarga de generar los contenedores para el funcionamiento y de lanzar la aplicación, en caso de querer configurar los parametros puedes modificar el archivo docker-compose.yml

`./vendor/bin/sail up`

y la primera vez que corras el contenedor, tambien debes correr la migracion para popular la base de datos

`./vendor/bin/sail artisan migrate --seed`

para el funcionamiento de la interfaz web es necesario correr diferentes comandos, algunos de estos deben estar ejecutandose todo el tiempo ya que proporcionan las funcionalidades en tiempo real de la plataforma como la escucha de contenedores, metricas etc...

para esto pudes correr el script encargado o individualmente cada comando dentro del contenedor

<Tabs  groupId="manager">
  <TabItem value="script" label="Script">
Este script está diseñado para ejecutar comandos en un entorno de desarrollo utilizando Laravel Sail. Proporciona dos tipos de comandos:

- **Comandos que se ejecutan solo una vez** (como migraciones, generación de claves y la instalación de dependencias npm).
- **Comandos que se ejecutan siempre**, como el servidor de desarrollo y otros procesos en segundo plano.

Además, permite controlar qué comandos ejecutar mediante argumentos de línea de comandos o interactuando con el usuario.

## Uso del Script

### Opciones de Línea de Comandos

El script acepta las siguientes opciones para controlar su comportamiento:

- `-s`: Ejecutar solo la migración y seed de la base de datos.
- `-i`: Generar la clave de la aplicación (`artisan key:generate`).
- `-k`: Instalar las dependencias de npm.
- `-n`: Ejecutar todos los comandos de la primera ejecución (migrar, generar clave e instalar npm).
- `-m`: Saltar los comandos de la primera ejecución y solo ejecutar los comandos principales (como `npm run dev`).

Manejo de Procesos en Segundo Plano

Este script inicia varios procesos en segundo plano, como `npm run dev` y otros servicios (AMQP, métricas, etc.). Si desea detener todos los procesos, puede hacerlo con `Ctrl+C`, y el script se encargará de limpiar los procesos en segundo plano.

  </TabItem>

  <TabItem value="manual" label="Manual" default>
:::info
Recuerda que para usar comandos dentro de sail, el contenedor se debe estar ejecutando con `./vendor/bin/sail up -d`
:::

```bash
  ./vendor/bin/sail php artisan serve
  ./vendor/bin/sail php artisan reverb:start
  ./vendor/bin/sail php artisan amqp:metrics
  ./vendor/bin/sail php artisan amqp:consume
  ./vendor/bin/sail npm run dev
```

Si no vas a realizar cambios en la interfaz web, puedes remplazar el ultimo comando por
`./vendor/bin/sail npm run build`

  </TabItem>

</Tabs>

# Variables de entorno

copia el archivo .env.docker a .env y modifica los valores a tu gusto.
Es necesario que ingreses los valores que quieras para identificar el servidor de websockets laravel reverb

```
REVERB_APP_ID=mi-app-id
REVERB_APP_KEY=clave de mi aplicación
REVERB_APP_SECRET=mi-secreto-app
```
