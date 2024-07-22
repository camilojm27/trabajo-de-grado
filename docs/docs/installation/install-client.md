---
sidebar_label: 'Instalacion del Cliente!'
---
# Cliente

Descarga el cliente o compila el codigo fuente usando el lenguaje go
el cliente puede ser ejecutado como un servicio systemd, si lo instalas desde los archivos .deb o .rpm

## Requisitos

- Docker x.y.z
- Go 1.22 (opcional para compilar el codigo)

acceder a la carpteta **service**, instalar las dependencias de go y compilar el codigo

```bash
cd trabajo-de-grado/service
go mod tidy
go build main.go
```
ejecutar el archivo compilado


## Configuracion

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
