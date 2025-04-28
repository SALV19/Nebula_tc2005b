 # Guía para desplegar una aplicación en Node.js utilizando la instancia EC2 de AWS

## Creación del servidor

Para desplegar una aplicación en Node.js, es necesario contar con un servidor. En este caso, utilizaremos una instancia EC2 de AWS.

Para esta guía asumiremos que utilizas **Ubuntu** como sistema operativo, por lo que se recomienda seleccionar dicha distribución al momento de la creación.

Una vez creado el servidor, accede a su consola, ya sea mediante **SSH** o utilizando la consola web proporcionada por tu proveedor.

-------

Estos son los pasos para crear una instancia EC2 en AWS:

1\. Haz clic en el campo "Buscar" y escribe "EC2"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/559f4efc-505e-4320-a599-ea25c9ba57bd/ascreenshot.jpeg?tl_px=0,0&br_px=2182,1219&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=243,-8)


2\. Haz clic en "EC2"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/a307e1e4-c51b-4e28-b81d-775a52b98327/ascreenshot.jpeg?tl_px=0,0&br_px=2182,1219&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=411,88)


3\. Haz clic en "Lanzar instancia"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/144803d0-5dde-4182-bde5-21490be98b5f/ascreenshot.jpeg?tl_px=0,184&br_px=1700,1135&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=505,277)


4\. Escribe un nombre y haz clic en la opción de "Ubuntu"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/5f523276-848b-4fc0-85c5-94136037a88b/ascreenshot.jpeg?tl_px=0,376&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=256,394)


5\. Haz clic en "Lanzar instancia"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/60755868-afe2-4e84-a437-b43b3b984b12/ascreenshot.jpeg?tl_px=0,376&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=976,416)


6\. En caso de tener una llave, haz clic en "Seleccionar" (no es obligatorio)

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/8997eaa3-5cb7-42b5-b394-0080d116b6e6/ascreenshot.jpeg?tl_px=0,376&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=486,313)


7\. Haz clic en "Lanzar instancia"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/ed958968-9c49-4942-9228-c9b63d634b6a/ascreenshot.jpeg?tl_px=0,376&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=720,371)


8\. Haz clic en "Instancias"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/385ad766-bc98-40d7-af55-fdfbef98d834/ascreenshot.jpeg?tl_px=0,0&br_px=2182,1219&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=95,25)


9\. Haz clic en la instancia que acabas de crear

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/21f4b1e2-1d65-4a85-891b-b44af6157148/ascreenshot.jpeg?tl_px=218,106&br_px=1918,1057&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=524,277)


10\. Haz clic en "Conectar"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/586cee1b-f6e5-4240-86fb-da3f5d7e704a/ascreenshot.jpeg?tl_px=0,0&br_px=1700,950&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=484,191)


11\. Haz clic en "Conectar"

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/d7547c95-fd0d-4aa2-9505-ba97e8770f28/ascreenshot.jpeg?tl_px=620,723&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=1312,433)


12\. Ahora, ya tienes acceso a la consola de tu servidor

![](https://ajeuwbhvhr.cloudimg.io/colony-recorder.s3.amazonaws.com/files/2025-04-23/4251fb54-45fa-4a5d-964b-96a8593fe14f/ascreenshot.jpeg?tl_px=0,376&br_px=2182,1596&force_format=jpeg&q=100&width=1120.0&wat=1&wat_opacity=1&wat_gravity=northwest&wat_url=https://colony-recorder.s3.amazonaws.com/images/watermarks/F43F5E_standard.png&wat_pad=400,431)

## Instalación de paquetes necesarios

Antes de continuar, asegúrate de instalar los paquetes necesarios para ejecutar la aplicación.

Puedes hacerlo con el siguiente comando (o su equivalente de acuerdo a la distribución que hayas escogido):

```bash
sudo apt update # para actualizar el gestor de paquetes
sudo apt install git nodejs npm mariadb-server nginx ufw -y
```

 - `git`: para poder hacer clone y poder actualizar el repo.
 - `nodejs`: para poder levantar el servidor.
 - `npm`: para poder descargar las dependencias del repo.
 - `mariadb-server`: como nuestro gestor de base de datos.
 - `nginx`: como nuestro proxy.
 - `ufw`: para manejar el fiewall.

## Descarga de repositorio

No es estrictamente necesario, pero es recomendable crear una carpeta donde incluirás tu proyecto para tener más organización en tu servidor.

```bash
mkdir 'proyectos'
cd 'proyectos'
```

Dentro de nuestra carpeta, hacemos un `git clone` hacia nuestro repositorio, para poderlo tener de manera local y corremos la siguiente línea en la consola de nuestro servidor.

```bash
git clone https://github.com/miUsuario/miRepo
```

Posteriormente, crear los archivos necesarios que no estén en el repositorio, como un `.env`.

Para hacer ésto puedes usar los siguientes comandos:
 - `pwd`: verificar en qué ruta nos encontramos en ese momento.
 - `mkdir`: crear una carpeta.
 - `touch` crear un archivo.
 - `nano` para editar el archivo y pegarle lo que lleva.

Con todos los archivos necesarios, instalamos las dependencias necesarias y corremos nuestro proyecto para corroborar que todo funciona.

```bash
npm install
npm run
```

## Levantar base de datos

Primeramente tenemos que habilitar y arrancar nuestro gestor de base de datos con:

```bash
sudo systemctl enable mariadb
sudo systemctl start mariadb
```

Ahora, ocupamos crear nuestras credenciales, por lo que corremos la configuración inicial de nuestro gestor (contestamos de acuerdo a lo que queramos):

```bash
sudo mysql_secure_installation
```

Ahora crearemos nuestro usuario en la base de datos, por lo que corremos el script siguiente para acceder a nuestro gestor de base de datos:

```bash
mariadb
```

Dentro de mariadb crearemos nuestro usuario con un comando parecido (recuerda sustituir tu información correspondiente):

```sql
CREATE USER 'usuario'@'%' IDENTIFIED BY 'diadepinu_314';
GRANT ALL PRIVILEGES ON *.* TO 'usuario'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Posteriormente se crea la base de datos, por lo que se recomendaría pegar un script que se tenga anteriormente para ésto.

Teniendo la base de datos, se ocuparía habilitar el puerto para que se pueda acceder.

En la configuración de mariadb permitir que se pueda acceder a dicho puerto, por lo que correr éste comando para editar su configuración:

```bash
sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

Y ahí buscar `bind-address = 127.0.0.1` y cambiarlo a `bind-address = 0.0.0.0`.

Posteriormente reiniciar mariadb.

```bash
sudo systemctl restart mariadb
```

Habilitar el puerto 3306 en el firewall:

```bash
sudo systemctl enable ufw
sudo systemctl start ufw # Habilitar el firewall
sudo ufw allow 3306/tcp
```

## Ejecutar aplicación de forma persistente

Para éste punto ya podemos acceder a nuestro proyecto al acceder a nuestro puerto, en caso de no poder, intentar con:

```bash
sudo ufw allow 3000/tcp # O el puerto que estés usando
```

En caso de que no se pueda, es posible que el servicio que aloja el servidor tenga su propio firewall, por lo que ahí también se tendrían que habilitar los puertos 3306 y el que usemos para nuestro proyecto.

Para correr la aplicación de forma persistente, dentro de nuestra carpeta del repo, se va a ocupar instalar otro paquete, ésto lo hacemos con:

```bash
npm install pm2
```

Y lo ejecutamos con:
```bash
sudo npx pm2 start app.js
```

En caso de querer parar el proyecto lo hacemos con:

```bash
sudo npx pm2 delete all
```

## Instalación de nginx

Si quisiéramos acceder directamente a través del puerto 443 u 80, vamos a ocupar **nginx**; por lo que se va a modificar su configuración con:

```bash
sudo nano /etc/nginx/sites-available/default
```

Dependiendo del tipo de conexión que quisiéramos tener se ocupan hacer distintas cosas:

 1. **Conexión HTTP**

    Se tiene que tener éste contenido:

    ```nginx
    server {
        listen 80; # Para la conexión HTTP

        # Aquí va tu dominio o dirección IP
        server_name _;  # Cambia por tu dominio o IP

        location / {
            proxy_pass http://localhost:3000;  # Redirige a tu aplicación en el puerto 3000
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    Para corroborar que el archivo está escrito correctamente, correr:

    ```bash
    sudo nginx -t
    ```

    En caso de que esté escrito correctamente, correr:

    ```bash
    sudo systemctl restart nginx
    ```

 1. **Conexión HTTPS con certificado SSL autofirmado**

    Para realizar éste tipo de conexión no es necesario nada, lo único negativo es que la primera vez que el usuario entre a la página, le dirá que no es segura.

    Antes de modificar nginx, ocupamos generar nuestro certificado, y para hacerlo vamos a ocupar instalar ciertos paquetes.

    ```bash
    sudo apt install openssl
    ```

    Primeramente vamos a ocupar generar la clave privada con:

    ```bash
    openssl genpkey -algorithm RSA -out /etc/ssl/private/server.key
    ```

    Luego, vamos a generar el certificado autofirmado con:

    ```bash
    openssl req -new -key /etc/ssl/private/server.key -out /etc/ssl/certs/server.csr
    ```

    Y posteriormente, generar el archivo que va a usar nginx (éste certificado dura 1 año):

    ```bash
    openssl x509 -req -in /etc/ssl/certs/server.csr -signkey /etc/ssl/private/server.key -out /etc/ssl/certs/server.crt -days 365
    ```

    Ya solo restaría volver a modificar nginx para indicar que se va a usar un certificado ssl y reiniciarlo. Por lo que seguiremos los siguientes pasos:

    Primeramente vamos a volver a editar el archivo de nginx:

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Y le añadiremos éste contenido:

    ```nginx
    server {
        listen 80;
        server_name _;

        return 301 https://$host$request_uri; # Manda solicitudes HTTP a HTTPS
    }

    server {
        listen 443 ssl;
        server_name _;

        ssl_certificate /etc/ssl/certs/server.crt;
        ssl_certificate_key /etc/ssl/private/server.key;

        location / {
            proxy_pass http://localhost:3000;  # Redirige a tu aplicación en el puerto 3000
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    Para corroborar que el archivo está escrito correctamente, correr:

    ```bash
    sudo nginx -t
    ```

    En caso de que esté escrito correctamente, correr:

    ```bash
    sudo systemctl restart nginx
    ```

 1. **Conexión HTTPS con certificado SSL y conexión segura**

    Para realizar éste tipo de conexión es necesario contar con un dominio o subdominio.

    Antes de modificar nginx, ocupamos generar nuestro certificado, y para hacerlo vamos a ocupar instalar ciertos paquetes.

    ```bash
    sudo apt install certbot python3-certbot-nginx
    ```

    Primeramente vamos a generar el certificado SSL

    ```bash
    sudo certbot --nginx -d tudominio.com
    ```

    Posiblemente muestre un error de que no se pudo instalar, no hay problema ya que eso lo haremos manualmente; mientras diga que el certificad se guardó, podemos pasar al siguiente paso.

    Ya solo restaría volver a modificar nginx para indicar que se va a usar un certificado ssl y reiniciarlo. Por lo que seguiremos los siguientes pasos:

    Primeramente vamos a volver a editar el archivo de nginx:

    ```bash
    sudo nano /etc/nginx/sites-available/default
    ```

    Y le añadiremos éste contenido:

    Solo asegúrate de modificar `tudominio.com` a tu dominio. Tienes que editarlo en los `server_name` y `ssl_certificate`'s.

    ```nginx
    server {
        listen 80;
        server_name tudominio.com;

        return 301 https://$host$request_uri; # Redirige todo el tráfico HTTP a HTTPS
    }

    server {
        listen 443 ssl;
        server_name tudominio.com;

        ssl_certificate /etc/letsencrypt/live/tudominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tudominio.com/privkey.pem;

        # Opciones de seguridad adicionales
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'HIGH:!aNULL:!MD5';
        ssl_prefer_server_ciphers on;

        location / {
            proxy_pass http://localhost:3000;  # Redirige a tu aplicación en el puerto 3000
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

    

    Para corroborar que el archivo está escrito correctamente, correr:

    ```bash
    sudo nginx -t
    ```

    En caso de que esté escrito correctamente, correr:

    ```bash
    sudo systemctl restart nginx
    ```

## Conclusión

Con estos pasos, deberías poder desplegar tu aplicación Node.js en una instancia EC2 de AWS y acceder a ella de forma segura. Recuerda que es importante mantener tu servidor y tus aplicaciones actualizadas para garantizar la seguridad y el rendimiento óptimo.