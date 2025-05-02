# Nebula HRMS

**Nebula HRMS** es un software que gestiona y automatiza procesos de recursos humanos. Centraliza información, agiliza trámites y permite un mejor control sobre empleados.

---

## Tabla de contenidos

- [Avances](#avances)  
- [Especificaciones de APIs](./Manuals_Documents/API_Specifications.pdf) 
- [Guía para desplegar una aplicación en Node.js utilizando la instancia EC2 de AWS](#gu%C3%ADa-para-desplegar-una-aplicaci%C3%B3n-en-nodejs-utilizando-la-instancia-ec2-de-aws)

    - [Creación del servidor](#creaci%C3%B3n-del-servidor)  
    - [Instalación de paquetes necesarios](#instalaci%C3%B3n-de-paquetes-necesarios)  
    - [Descarga de repositorio](#descarga-de-repositorio)  
    - [Levantar base de datos](#levantar-base-de-datos)  
    - [Llenado del archivo .env](#llenado-del-archivo-env)  
    - [Ejecutar aplicación de forma persistente](#ejecutar-aplicaci%C3%B3n-de-forma-persistente)  
    - [Instalación de nginx](#instalaci%C3%B3n-de-nginx)  
    - [Levantar phpMyAdmin](#levantar-phpmyadmin)  
    - [Conclusión](#conclusi%C3%B3n)
---

## Avances

### Avance 6
- **Video**: [Ver en Google Drive](https://drive.google.com/file/d/1GD6aT8StCZazNQ4Foosu2sHSsAacSNk0/view?usp=sharing)  
- **Carpeta en el repo**: [Carpeta](./Avances/Avance6/)
  
### Avance 5
- **Video**: [Ver en Google Drive](https://drive.google.com/file/d/1L6aVgs3Do0e3bt590I8TmBSqEui0l3Yz/view?usp=sharing)  
- **Presentación**: [Canva](https://www.canva.com/design/DAGkBFMvakE/fBqcN19ocpqrOPAcjIHrHw/view?utm_content=DAGkBFMvakE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h7c048e600a)
- **Carpeta en el repo**: [Carpeta](./Avances/Avance5/)

### Avance 4
- **Video**: [Ver en Google Drive](https://drive.google.com/file/d/1GJ4_aTF3IpcAPxaIvF6cufCfHIEG8ue9/view?usp=sharing)  
- **Presentación**: [Canva](https://www.canva.com/design/DAGi9LO-ZsY/VrgtTlMeKkwUGgB56XBsFg/view?utm_content=DAGi9LO-ZsY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha1a861828a)
- **Carpeta en el repo**: [Carpeta](./Avances/Avance4/)

### Avance 2
- **Video**: [Ver en Google Drive](https://drive.google.com/file/d/1MmiPaTIbasVb8nWND5HCcoITv5EZ4jgD/view?usp=sharing)  
- **Presentación**: [Canva](https://www.canva.com/design/DAGgRgMhVZM/cmbIIe9p2FrsPUUS0AxETA/view?utm_content=DAGgRgMhVZM&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h4d25878ccb#1)
- **Carpeta en el repo**: [Carpeta](./Avances/Avance2/)
---

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
npm start app.js
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
sudo mariadb
```

Posteriormente se crea la base de datos, una vez está creada se bede pegar un script que se tenga anteriormente.
```
create database nombreDeTuBaseDeDatos;
```
Dentro de mariadb crearemos nuestro usuario con un comando parecido (recuerda sustituir tu información correspondiente):

```sql
CREATE USER 'usuario'@'%' IDENTIFIED BY 'diadepinu_314';
GRANT ALL PRIVILEGES ON *.* TO 'usuario'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

Teniendo la base de datos, se ocuparía habilitar el puerto para que se pueda acceder.

En la configuración de mariadb permitir que se pueda acceder a dicho puerto, por lo que correr éste comando para editar su configuración (se debe salir de la consola de mariadb con `exit`):

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

## Llenado del archivo .env:
El archivo .env contiene información sensible, por esa razón no se subió al repositorio. Sin embargo, es necesario para la ejecución de nuestro programa. Es debido a esto que se tiene que crear manualmente.

Para crear el archivo, dentro de la carpeta de workcells ejecutamos el comando touch .env para crear el archivo:
```bash
touch .env
```
Con nuestro editor de texto le añadimos lo siguiente:

```bash
GOOGLE_CLIENT_ID = [TU TOKEN DE GOOGLE AUTH]
GOOGLE_CLIENT_SECRET = [TU TOKEN DE GOOGLE AUTH]
REDIRECT = 'http://localhost:3000/redirect'

SECRET = [TU TOKEN DE SESIÓN]

MAIL_USERNAME = [TU CORREO DE GOOGLE AUTH]
MAIL_PASSWORD = [TU CONTRASEÑA DE GOOGLE AUTH]
OAUTH_CLIENTID = ''
OAUTH_CLIENT_SECRET = ''
OAUTH_REFRESH_TOKEN = ''

WHATSAPP_TOKEN = [TU TOKEN DE WHATSAPP API]

DATABASE_URL = [LA IP DE TU SERVIDOR]
DATABASE_USER = [EL USUARIO DE TU BASE DE DATOS]
DATABASE_PASSWORD = [LA CONTRASEÑA DE TU BASE DE DATOS]
DATABASE_NAME  = 'nebula'
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

## Levantar phpMyAdmin
Primeramente instalar paquetes necesarios:
```bash
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
sudo apt install phpmyadmin php-mbstring php-zip php-gd php-json php-curl php-mysql php8.2 php8.2-mbstring php8.2-fpm php8.2-mysql -y
```

Luego se tienen que habilitar las extensiones de php:

```bash
sudo phpenmod mbstring
sudo systemctl enable --now php8.2-fpm
sudo systemctl restart php8.2-fpm
```
Se crea el enlace simbólico de la carpeta de phpMyAdmin:
```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
```
Ya solo faltaría modificar nginx para aceptar la ruta con:
```bash
sudo nano /etc/nginx/sites-available/default
```
Y añadir:
```nginx
    location /phpmyadmin {
        alias /usr/share/phpmyadmin/;
        index index.php index.html index.htm;

        location ~ ^/phpmyadmin/(.+\.php)$ {
            alias /usr/share/phpmyadmin/$1;
            include fastcgi-params;
            fastcgi_pass unix:/run/php/php8.2-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME /usr/share/phpmyadmin/$1;
        }

        location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
            alias /usr/share/phpmyadmin/$1;
        }
    }
```
Luego habilitamos los parámetros de nginx al correr éste comando:
```bash
sudo nano /etc/nginx/fastcgi-params
```
E introducir esto adentro:
```bash
fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_FILENAME    $document_root$fastcgi_script_name;
fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only:
fastcgi_param  SCRIPT_FILENAME    $request_filename;

# Prevents URIs with the front controller from being passed to PHP.
fastcgi_param  PATH_INFO          $fastcgi_path_info;
fastcgi_param  PATH_TRANSLATED    $document_root$fastcgi_path_info;
```
Y faltaría reiniciar nginx para actualizar los cambios:
```bash
sudo systemctl restart nginx  
```
## Conclusión

Con estos pasos, deberías poder desplegar tu aplicación Node.js en una instancia EC2 de AWS y acceder a ella de forma segura. Recuerda que es importante mantener tu servidor y tus aplicaciones actualizadas para garantizar la seguridad y el rendimiento óptimo.
