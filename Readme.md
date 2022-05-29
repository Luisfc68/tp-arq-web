# TP Arquitectura web
 - Autor: Luis Chavez
 - Legajo: 0106911
 - Descripción del trabajo: 
este trabajo consiste en una API de un servicio de comida donde existen dos tipos de usuarios, los usuarios cliente y restaurante. El usuario cliente puede realizar ordenes de comida para lo cual debe usar su saldo el cual puede recargar si lo necesita. El usuario restaurante puede realizar la gestion de los diferentes platos que ofrecen cada uno de sus restaurantes. Para ello se manejan las entidades usuario, restaurante, comida y orden. En la documentación de la API se encuentran ejemplos de las acciones que puede realizar cada usuario.

### Documentación
La documentación de los endpoints disponibles en esta API se enquentra [aquí](https://documenter.getpostman.com/view/15502523/Uz5CLHY7)

### Levantar el proyecto
Para levantar este proyecto hay que realizar los siguientes pasos:
1. Clonar este repositorio
2. Crear un archivo .env a la misma altura del package.json con las siguientes variables:
   - PORT: puerto al que va a escuchar la aplicaión. Por defecto 8080.
   - DB_NAME: nombre de la base de datos. Por defecto mongo.
   - DB_HOST: host de la base de datos. Por defecto localhost.
   - DB_PORT: puerto de la base de datos en dicho host. Por defecto 27017.
   - JWT_SECRET: secreto para firmar los json web tokens. No hay valor por defecto, es obligatorio
3. Ejecutar `npm install`
4. Ejecutar `npm start`

