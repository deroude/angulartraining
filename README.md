# Angular Training

## Prerequisites

### Tools and libraries

You will need to have the following items installed on your machine:

- Java 8 JDK
- Maven
- Docker [community edition](https://www.docker.com/community-edition)
- Node.js [LTE](https://nodejs.org/en/)
- A web friendly IDE, like [VSCode](https://code.visualstudio.com/)
- A MySQL browser, like [DBeaver](https://dbeaver.jkiss.org/)
- A REST client, like [Postman](https://www.getpostman.com/)

### Download and prepare REST service

Download the [Spring REST service](https://github.com/deroude/springrest).

Build the project with Maven: `maven install`.

Start the project with docker: `docker-compose up --build`.

This will start two docker containers: the MySQL container, listening at `mysql:3306` and the Spring REST container, listening at `localhost:7799`. On startup, the Spring project will also populate the DB with some initial data, so you check out the DB using your MySQL browser. You can also check out the REST service either in your browser or in your REST client. You will notice that most requests will fail, due to lack of authorization -- a GET request to `http://localhost:7799/public/articles` should work.

### Prepare the Angular tools

Test that your Node.js installation worked:

`node -v`

`npm -v`

Install Angular CLI:

`npm install -g @angular/cli`

Test that this worked:

`ng help`

Optionally, you may install another useful tool, `ncu`:

`npm install -g npm-check-updates`

## Project start

In your shell, `cd` into the parent folder, where you want your Angular project to live and run:

`ng new AngularTraining --style=scss` 

or any other name you want to give your project.

This will create all the basic files and folders required for a startup project.

It will also fetch all the dependencies needed for building, running and testing your project.

We add `--style=scss` to tell Angular that we want the default style files to be `scss`, not `css`, i.e. to use [SASS](http://sass-lang.com/).

When the setup is complete, `cd` into the project folder and run:

`ng serve`

This will compile the project source files in a web bundle, create a light web server, listening by default on port 4200, and start listening for changes on the source files, in order to refresh the browser whenever you hit save in your IDE.