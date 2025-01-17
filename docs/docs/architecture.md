---
sidebar_position: 2
sidebar_label: "Arquitectura"
---

# Arquitectura de la Plataforma

## Visión General

La plataforma está diseñada siguiendo una arquitectura distribuida que consta de dos componentes principales:

1. **Servicio Cliente (Nodo)**: Un servicio desarrollado en Go que se ejecuta en cada máquina que se desea administrar.
2. **Plataforma Web (Servidor Central)**: Una aplicación web desarrollada en Laravel que actúa como punto central de control.

## Componentes del Sistema

### Servicio Cliente

El servicio cliente está desarrollado en Go y tiene las siguientes responsabilidades:

- Interfaz con Docker Engine a través de la API de Docker
- Recopilación de métricas del sistema (CPU, memoria, red)
- Comunicación con el servidor central mediante AMQP
- Manejo de operaciones en contenedores locales
- Gestión de la seguridad y autenticación con el servidor

#### Características principales:

- Comunicación asíncrona con RabbitMQ
- Monitoreo continuo de recursos del sistema
- Operaciones atómicas en contenedores
- Manejo de logs y eventos del sistema

### Plataforma Web

La plataforma web está construida con Laravel y proporciona:

- Interfaz de usuario para gestión de contenedores
- Panel de administración centralizado
- Sistema de autenticación y autorización
- API RESTful para comunicación con servicios cliente
- Visualización de métricas en tiempo real

#### Componentes clave:

1. **Backend (Laravel)**:

   - API RESTful
   - Gestión de usuarios y permisos
   - Procesamiento de métricas
   - Gestión de eventos en tiempo real

2. **Frontend**:

   - Interfaz de usuario reactiva
   - Visualización de métricas en tiempo real
   - Panel de control interactivo

3. **Base de Datos**:
   - PostgreSQL para almacenamiento persistente
   - Caché para datos frecuentemente accedidos

## Comunicación entre Componentes

### Protocolos Utilizados

1. **AMQP (RabbitMQ)**:

   - Comunicación asíncrona entre nodos y servidor
   - Publicación de métricas y eventos
   - Cola de comandos para nodos

2. **WebSockets (Laravel Reverb)**:

   - Actualizaciones en tiempo real en la interfaz web
   - Notificaciones de eventos del sistema
   - Estado de los contenedores en tiempo real

3. **HTTP/HTTPS**:
   - API RESTful para operaciones CRUD
   - Autenticación y autorización
   - Transferencia de archivos y configuraciones

### Flujo de Datos

1. **Métricas y Estados**:

   ```mermaid
   graph LR
   A[Nodo] -->|AMQP| B[RabbitMQ]
   B -->|Consumidor| C[Laravel]
   C -->|WebSocket| D[Frontend]
   ```

2. **Comandos y Control**:
   ```mermaid
   graph LR
   A[Frontend] -->|HTTP| B[Laravel API]
   B -->|AMQP| C[RabbitMQ]
   C -->|AMQP| D[Nodo]
   ```

## Seguridad

La plataforma implementa múltiples capas de seguridad:

1. **Autenticación**:

   - JWT para API
   - Sesiones Laravel para interfaz web
   - Tokens de acceso para nodos

2. **Comunicación**:

   - SSL/TLS para HTTP
   - AMQP con autenticación
   - WebSockets seguros

3. **Autorización**:
   - RBAC (Control de Acceso Basado en Roles)
   - Políticas de acceso por nodo
   - Auditoría de operaciones

## Escalabilidad

La arquitectura está diseñada para ser escalable:

- Múltiples nodos pueden conectarse al servidor central
- RabbitMQ permite balanceo de carga de mensajes
- Base de datos puede ser replicada
- Frontend puede ser servido desde CDN

## Monitoreo y Logging

El sistema incluye capacidades completas de monitoreo:

1. **Métricas del Sistema**:

   - Uso de CPU y memoria
   - Estadísticas de red
   - Estado de contenedores

2. **Logs**:

   - Logs de aplicación
   - Logs de contenedores
   - Eventos del sistema

3. **Alertas**:
   - Notificaciones en tiempo real
   - Alertas por correo
   - Webhooks para integración con sistemas externos
