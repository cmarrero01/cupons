Cupons
==================

Consideraciones:
Cupone esta desarrollado para ser instalado bajo ubuntu 12.04

Software e instalaciones necesarias:

	- INSTALACION DE MONGODB:
	Cupone utiliza mongodb como motor de base de datos para instalarlo
	sobre ubuntu 12.04 correr los siguientes comandos

		sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
		echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
		sudo apt-get update
		sudo apt-get install mongodb-10gen

	- INSTALACION PHANTOMJS
	cupone utiliza phantomjs para crear los archivos jpg de cada cupon creado 
	para instalarlo corra los siguientes comandos:

		cd /usr/local/share
		wget http://phantomjs.googlecode.com/files/phantomjs-1.9.2-linux-x86_64.tar.bz2
		tar xjf phantomjs-1.9.2-linux-x86_64.tar.bz2
		sudo ln -s /usr/local/share/phantomjs-1.9.2-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
		sudo ln -s /usr/local/share/phantomjs-1.9.2-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
		sudo ln -s /usr/local/share/phantomjs-1.9.2-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

	- INSTALAR IMAGEMAGICK
	cupone utiliza imagemagick para realizar la conversion de las imagenes que se suben tanto al negocio
	como a las ofertas, cada imagen se convierte a diferentes tamaños para evitar mucho peso en el sistema
	para instalar imagemagick siga los siguientes comandos:
		
		sudo apt-get install libmagickwand-dev imagemagick

	- INSTALACION DE NODEJS
	cupone esta programado sobre node.js por lo que debe estar instalado, para instalarlo seguir los siguientes
	comandos:
		
		sudo apt-get update
		sudo apt-get install -y python-software-properties python g++ make
		sudo add-apt-repository ppa:chris-lea/node.js
		sudo apt-get update
		sudo apt-get install nodejs

	- CONFIGURACION DE SMTP
	cupone utiliza un cliente smtp para emitir emails cuando un usuario se registra y para diversas funciones mas
	existen dos archivos en donde se configura los datos del smtp:
	
		cupone/server/public/home.js
		cupone/server/public/ofertas.js

	- CONFIGURACION DE IP:
	Para el correcto funcionamiento del sistema, es necesario modificar la IP del sistema, del siguiente archivo
		cupone/server/public/ofertas.js linea: 139 (http://23.253.41.15/createCupon).. 
	por la IP o dominio que el sistema tenga.
	

INSTALAR Cupone:

	Una vez instaladas todas las dependencias se puede iniciar de las siguientes maneras:
		
		MANUALMENTE:
		- cd cupone
		- sudo node server.js

		BACKGROUND:
		- cd cupone
		- sudo npm install pm2 -g
		- sudo pm2 start server.js --name cupone

		Para poder ver los logos, correro sudo pm2 logs

********************************************
IMPORTANTE
********************************************

Si no existe una base de datos, la instalacion la generara por su cuenta, cada collection estara
vacia, para migrar bases de datos se debe hacer a traves de un software externo como (RoboMongo) o por consola
de la siguiente manera:

	Exportar un modelo:
	mongoexport -db cupone -user "user" -password "password" -collection "nombre_de_modelo" -out "nombre_de_modelo.json"

	importar un modelo:
	mongoimport -db cupone -user "user" -password "password" -collection "nombre_de_modelo" -file "nombre_de_modelo.json"

Con robomongo es mas sencillo ya que haciendo click derecho sobre una collection se puede copiar la misma a otra base de datos
muy facilmente.

