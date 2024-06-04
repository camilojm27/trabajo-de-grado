---
#sidebar_position: 6
#sidebar_label: 'Hi!'
#sidebar_position: 3
---

# Instalación!

A continuación se describen los **requisitos basicos**, para poder desplegar la plataforma. Estos pueden ser configurados e instalados en uno o multiples servidores, de acuerdo a las necesidades del proyecto.

Explicaremos la instalacón manual, o puedes ahorrar tiempo corriendo una imagen de docker

## Plataforma | Servidor Web

La aplicación web está desarrollada en el framework web de PHP Laravel, por lo tanto se deben cumplir todos sus requerimientos mencionados en https://laravel.com/docs/11.x/deployment adicionalmente a esto se requiere:

### Requisitos


<details>
  <summary>[PHP 8.2 - 8.3](https://www.php.net/) con las siguentes extenciones:</summary>
    - OpenSSL
    - PDO
    - Mbstring
    - Tokenizer
    - XML
    - Ctype
    - JSON
    - BCMath
    - Fileinfo
    - GD
    - Zip
    - Exif
    - PCRE
    - SQLite
    - Redis
    - AMQP

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="deb" label="Ubuntu | Debian" default>
    ```
    sudo apt install php-{mbstring, xml, curl}
    ```
  </TabItem>
  <TabItem value="rpm" label="Fedora | Redhat">
      ```
    sudo dnf install🍊
    ```
    </TabItem>
</Tabs>
</details>

- [Composer](https://getcomposer.org/)
- Base de datos [SQL](https://laravel.com/docs/11.x/database)
- Base de datos [Redis](https://docusaurus.io/docs/styling-layout) (opcional) 
- Nodejs [20 >](https://docusaurus.io/docs/search) with npm
- Protocolo AMQP Sobre el cliente de [Rabbitmq](https://docusaurus.io/)


You can also initialize a new project using your preferred project manager:

### Configuración

Descargar el repositorio de la aplicación
```
git clone https://github.com/camilojm27/trabajo-de-grado.git
```
acceder a la carpteta **platform**, e instalar las dependencias de php y de javascript
```
cd trabajo-de-grado/platform
composer install
npm install
```
realizar una copia del archivo .env.example y llamarlo .env
```
cp .env.example .env
```
Editar el archivo .env con la configuración a base de datos, rabbitmq, websockets, redis, correo electronico, etc...


## Cliente

Descarga el cliente o compila el codigo fuente usando el lenguaje go
el cliente puede ser ejecutado como un servicio systemd, si lo instalas desde los archivos .deb o .rpm
#### Requisitos
- Docker x.y.z
- Go 1.22 (opcional para compilar el codigo)
### Configuracion

1. Ejecutar la CLI del servicio para configurar la IP de la plataforma web, así como su contraseña de bienvenida.
```
pgc configure
```
Al realizar esto se crea un archivo .pgc.env con la configuración en el directorio ~/.HOME
2. Realizar el registro del cliente en la plataforma, si el cliente es aceptado, se guardara la información de la maquina y de docker.
```
pgc join
```
3. Iniciar el servicio 
```
pgc start
```


<!-- ```jsx title="/src/components/HelloCodeTitle.js"
cp .env.example .env
``` -->
