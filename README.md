# Effectively
A website for project and time schedule management.
## Setting up project with pre-built resources
Clone this repository and navigate to the root of the project.

To host the the effectively website one needs to have the following programs installed:
* Java Runtime Environment (version 11 or above)
* PostgreSQL (version 11.7 or above)
* Nginx (or any other web server capable to host static files and proxy specific routes to a different origin)

#### Database
The backend server requires a postgreSQL database to function.
The setup of the database will vary depending depending on what OS you're running on.
For installation on Windows you can follow [this](https://www.postgresqltutorial.com/install-postgresql) tutorial.
For [mac](https://www.postgresql.org/download/macosx/) and for other POSIX based system you'll just have to google for it.

The database is required to have the name 'kangaroo' and the user of the database needs to have the name 'postgres' and a password of your own choosing.

To actually setup the required tables and triggers, run the command `psql -f Database\ Setup.txt kangaroo postgres`.

#### Backend
To start the backend run the command `./backend-1.0/bin/backend` if you're on MAC OS or linux and `.\backend-1.0\bin\backend.bat` if you're running Windows. 

The password needed for the backend to connect to database can either be passed in as a command line argument (i.e. `./backend-1.0/bin/backend password` or `.\backend-1.0\bin\backend.bat password`). If no password is passed in, then the program will ask you to enter it.

THe backend should now be able to serve API calls on localhost:8000

#### Nginx
Now that you got the backend up and running we need to setup Nginx to handle the serving of the static frontend files and the proxying of the API related routes to the backend server.

Start by locating the `sites-available` directory that holds the `default` file for configuring the web server, the location will vary depending on the system but it's commonly found in `/etc/nginx` on POSIX systems.

The `sites-available/default` file should hold a row that specifies where static files are served from. It should look something like this `root /var/www/html;`. 

Remove the existing `index.html` file from the folder (i.e. `sudo rm /var/www/html/index.html`)

Now copy over the files from frontend-static into that path (i.e. in this case `sudo cp frontend-static/* /var/www/html -R`).

To now set up the proxy for the backend add the following lines to the `sites-available/default` file below the `location / { ... }` block.
```
location ~* (week|note|timeline|projects) {
    proxy_pass http://localhost:8000;
}
```
Now restart nginx (on systemd based systems it's done through `sudo systemctl restart nginx.service`).

#### Testing
If everything was done correctly you should now be able to navigate to `localhost` in your web browser (google chrome is recommended) and see the site up and running.

## Building the resources yourself
If you wish to build the resources from source then you'll need to have the following pieces of software installed:
* node.js (preferably version 14 or newer)
* npm (node package manager) (version 6.14 or newer)
* Java Development Kit (preferably version 11 or newer)

Start by clearing out the `pre-built` directory where we'll put our resources (i.e. `rm -R pre-built/*`).

### Building the frontend resources
To build the frontend run this series of commands:
* `cd frontend`
* `npm install`
* `npm run build`
* `cp build/ ../pre-built/frontend-static -R`
* `cd ..`

### Building the backend resources
* `cd backend`
* `./gradlew build -x test` if you are on a POSIX system.
`.\gradlew.bat build -x test` if you are on a Windows system.
* Unzip the content of the `build/distributions/backend-1.0.zip` in the `pre-built` folder (i.e. if you're using the unzip command; `unzip build/distributions/backend-1.0.zip -d ../pre-built/`)
* `cd ..`

### Copy the database configurations
`cp backend/src/Database\ Setup.txt pre-built/`

Now all of the resources required to run the server can be found within the `pre-built` directory in the root of the project.
