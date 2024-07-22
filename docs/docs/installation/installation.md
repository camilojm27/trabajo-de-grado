---
sidebar_label: 'Hi!'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Instalación!

A continuación se describen los **requisitos basicos**, para poder desplegar la plataforma. Estos pueden ser configurados e instalados en uno o multiples servidores, de acuerdo a las necesidades del proyecto.

Explicaremos la instalacón manual, o puedes ahorrar tiempo corriendo una imagen de docker

## RabbitMQ

La plataforma utiliza el protocolo AMQP 9-0-1 con la implementación de rabbitmq, es necesario tener instalado:

- RabbitMQ 3.12 o mayor
- Habilitar el plugin de administración web

tambien puedes acceder a rabbitmq a travez de proveedores como [CloudAMQP](https://www.cloudamqp.com/) y [Stackhero](https://www.stackhero.io/)

<Tabs  groupId="operating-systems">
  <TabItem value="docker" label="Docker">
  latest RabbitMQ 3.13
      ```bash
    docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.13-management
    ```
    </TabItem>
  <TabItem value="deb" label="Ubuntu | Debian" default>
  Copia en la terminal el siguente script de bash, el cual instalara los repositorios para earlang y rabbitMQ
  Te recomendamos leer la guia de rabbitmq para mayor información https://www.rabbitmq.com/docs/install-debian
    ```bash
#!/bin/sh

sudo apt-get install curl gnupg apt-transport-https -y

## Team RabbitMQ's main signing key

curl -1sLf "https://keys.openpgp.org/vks/v1/by-fingerprint/0A9AF2115F4687BD29803A206B73A36E6026DFCA" | sudo gpg --dearmor | sudo tee /usr/share/keyrings/com.rabbitmq.team.gpg > /dev/null

## Community mirror of Cloudsmith: modern Erlang repository

curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-erlang.E495BB49CC4BBE5B.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg > /dev/null

## Community mirror of Cloudsmith: RabbitMQ repository

curl -1sLf https://github.com/rabbitmq/signing-keys/releases/download/3.0/cloudsmith.rabbitmq-server.9F4587F226208342.key | sudo gpg --dearmor | sudo tee /usr/share/keyrings/rabbitmq.9F4587F226208342.gpg > /dev/null

## Add apt repositories maintained by Team RabbitMQ

sudo tee /etc/apt/sources.list.d/rabbitmq.list <<EOF

## Provides modern Erlang/OTP releases

##

deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main

# another mirror for redundancy

deb [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa2.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.E495BB49CC4BBE5B.gpg] https://ppa2.novemberain.com/rabbitmq/rabbitmq-erlang/deb/ubuntu jammy main

## Provides RabbitMQ

##

deb [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa1.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main

# another mirror for redundancy

deb [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa2.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
deb-src [signed-by=/usr/share/keyrings/rabbitmq.9F4587F226208342.gpg] https://ppa2.novemberain.com/rabbitmq/rabbitmq-server/deb/ubuntu jammy main
EOF

## Update package indices

sudo apt-get update -y

## Install Erlang packages

sudo apt-get install -y erlang-base \
 erlang-asn1 erlang-crypto erlang-eldap erlang-ftp erlang-inets \
 erlang-mnesia erlang-os-mon erlang-parsetools erlang-public-key \
 erlang-runtime-tools erlang-snmp erlang-ssl \
 erlang-syntax-tools erlang-tftp erlang-tools erlang-xmerl

## Install rabbitmq-server and its dependencies

sudo apt-get install rabbitmq-server -y --fix-missing

````

All steps covered below are **mandatory** unless otherwise specified.
### Install Essential Dependencies

```bash
sudo apt-get update -y

sudo apt-get install curl gnupg -y
````

  </TabItem>
  <TabItem value="rpm" label="Fedora | RedHat">
  Te recomendamos leer la guia de rabbitmq para mayor información https://www.rabbitmq.com/docs/install-rpm
      ```
    sudo dnf install rabbitmq-server
    ```
    </TabItem>
</Tabs>

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

<Tabs  groupId="operating-systems">
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

No se abordara como realizar la instalacion de las siguentes ya que son muy comunes en el desarrollo web y varia la instalación en cada plataforma
- [Composer](https://getcomposer.org/)
- Base de datos [SQL](https://laravel.com/docs/11.x/database)
- Base de datos [Redis](https://docusaurus.io/docs/styling-layout) (opcional)
- Nodejs [20 o mayor ](https://docusaurus.io/docs/search) con npm
- [Rabbitmq](https://docusaurus.io/)


### Instalación de dependencias

Descargar el repositorio de la aplicación

```
git clone https://github.com/camilojm27/trabajo-de-grado.git
```

acceder a la carpteta **platform**, e instalar las dependencias de php y de javascript

```
cd trabajo-de-grado/platform
composer install
npm install
npm run build
```
realizar una copia del archivo .env.example y llamarlo .env

```
cp .env.example .env
```

Editar el archivo .env con la configuración a base de datos, rabbitmq, websockets, redis, correo electronico, etc...
La configuracion de la plataforma se explica más adelante



<!-- ```jsx title="/src/components/HelloCodeTitle.js"
cp .env.example .env
``` -->
