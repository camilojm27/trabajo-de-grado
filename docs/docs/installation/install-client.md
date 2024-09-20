---
sidebar_label: "Cliente"
sidebar_position: 2
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
go build -v -o pgc main.go
```

ejecutar el archivo compilado

## Configuracion

1. Ejecutar la CLI del servicio para configurar el nodo

```
./pgc configure
```

La configuración pide los siguentes datos

- URL de la plataforma
- Clave de Bienvenida para poder agregar nodos
- Usuario que registra el nodo `el usuario debe registrarse primero en la plataforma`

:::info
El usuario administrador por defecto es test@example.com 1234578

Es recomendable cambiar el correo y contraseña
:::

Al realizar esto se crea un archivo .pgc.env con la configuración en el directorio ~/.HOME

2. Realizar el registro del cliente en la plataforma, si el cliente es aceptado, se guardara la información de la maquina y de docker.

```
./pgc join
```

3. Iniciar el servicio

```
./pgc start
```
