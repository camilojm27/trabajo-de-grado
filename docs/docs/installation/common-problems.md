---
sidebar_position: 4
sidebar_label: "Solución de Problemas Comunes"
---

# Solución de Problemas Comunes

1. **No se ejecutan los comando de metricas y escucha a RabbitMQ**: Verifica que RabbitMQ esté funcionando correctamente dentro de Docker y que las credenciales en `.env` sean correctas. Espera hasta que Rabbitmq haya terminado de iniciar COMPLETAMENTE antes de lanzar el script o los comandos de `amqp:metrics` y `amqp:consume`
2. **La aplicación no se muestra correctamente**: La aplicación hace uso de los siguentes puertos, asegurate de que el servidor permita su funcionamiento fuera de LocalHost

- 5173 javascript hot reload server (solo en modo de desarrollo)
- 80 http
- 443 https
- 5672 rabbitmq
- 8080 websockets

## Referencias y Recursos Adicionales

- [Documentación oficial de Laravel](https://laravel.com/docs)
- [Laravel Sail](https://laravel.com/docs/sail)
- [RabbitMQ](https://www.rabbitmq.com/documentation.html)
- [Laravel WebSockets (Reverb)](https://laravel.com/docs/11.x/reverb)

Para más información o soporte, consulta la documentación oficial de cada tecnología o abre un issue en el repositorio del proyecto.
