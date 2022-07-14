# Next.js Teslo Shop

Para correr localmente, se necesita la base de datos.

```
docker-compose up -d
```

- el -d, significa **detached**

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

- MongoDb URL Local:

```
MONGO_URL=mongodb://localhost:27017/testlod
```

- reconstruir los modulos de node y levantar Next

```
yarn install
yarn dev
```

## Llenar la base de datos con informacion de pruebas

Llamar a:

```
http://localhost:3000/api/seed
```
