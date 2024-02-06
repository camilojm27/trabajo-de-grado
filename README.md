# Plataforma de Gestion de Contenedores

En un mundo cada vez más digital y descentralizado el uso de contenedores y máquinas virtuales, se ha
convertido en algo crucial dentro de cada proyecto de software, debido a que estas tecnologías permiten la
creación de entornos aislados y reproducibles, permitiendo así mayor seguridad, velocidad de desarrollo y
facilidad de despliegue. Debido a la importancia que tienen estas tecnologías en la industria de la Ingeniería de
Software este trabajo de grado busca facilitar la administración de contenedores en entornos de computación
distribuida sobre diferentes equipos dentro de una red, logrando así una mejora en los procesos de gestión deeste tipo de recursos basados en contenedores. Así pues, este trabajo de grado propone una aplicación web
desde la cual se pueda realizar la administración de los contenedores, así como también obtener información
general de ciertas características de los sistemas de cómputo que corren estos contenedores tales como: uso de
red, RAM, CPU, sistema operativo etc.
La plataforma consta de 2 partes

1. Un servicio encargado de realizar toda la gestión de los contenedores en la máquina anfitriona (crear,
   eliminar, editar), enviar la información del sistema y conectarse con el servidor central (Aplicación Web)
   para poder realizar la gestión.
2. Una aplicación web desde la que el usuario podrá manejar a través de una interfaz gráfica cada
   contenedor de la máquina anfitriona, y obtener la información del sistema y de los contenedores en
   tiempo real.

Cuando definimos la gestión de contenedores el usuario podrá realizar las siguientes acciones:

- Crear contenedores a partir de imágenes públicas o usando docker compose
- Iniciar, detener y reiniciar contenedores
- Ver los registros de los contenedores
- Eliminar contenedores
- Configurar algunos parámetros de los contenedores como redes y volúmenes
- Monitorear es estado de los contenedores
- Monitorear el sistema operativo
- Ver registros de la aplicación
