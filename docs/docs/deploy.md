---
sidebar_position: 4
sidebar_label: "Despligue a Producción"
---

# Despligue a Producción

Esta imagen de docker contiene toda la configuración de la aplicación

- Clona el repositorio

### Configuración del Entorno

Dentro de la carpeta platform

1. Copia el archivo `.env.docker` a `.env`:
   ```
   cp .env.example .env
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

REVERB_APP_KEY=
REVERB_APP_SECRET=

- Construlle la imagen

` docker build -t plataforma-gestion-contenedores .`

- Correr la imagen

`docker run -d -p 80:80 -p 5432:5432 -p 15672:15672 -p 5672:5672 --name plataforma-gestion-contenedores plataforma-gestion-contenedores`

- Entrar a la imagen para ejecutar la migración en la base de datos y crear la

```bash
docker exec -it plataforma-gestion-contenedores /bin/bash
php artisan key:generate
php artisan migrate
```
