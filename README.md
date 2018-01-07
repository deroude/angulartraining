# Angular Training

## Goals

- Construct an Angular 5 application, accomplishing the following tasks:
    - Navigate between views
    - Perform CRUD operations
    - Consume a REST service
    - Authenticate using an OAuth 2 service
- Become familiar with Web technologies:
    - Typescript & Rx
    - HTML 5
    - Bootstrap 4 visual elements
    - CSS / SASS

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

This will start two docker containers: the MySQL container, listening at `localhost:3306` and the Spring REST container, listening at `localhost:7799`. On startup, the Spring project will also populate the DB with some initial data, so you check out the DB using your MySQL browser. You can also check out the REST service either in your browser or in your REST client. You will notice that most requests will fail, due to lack of authorization -- a GET request to `http://localhost:7799/public/articles` should work.

Another usefull thing that will work is the REST documentation, at `http://localhost:7799/swagger-ui.html`.

These are just the public sections of our REST service. The other sections are protected by a OAuth 2 authorization service, which requires us to authenticate. Check out `springrest/src/main/resources/import.sql` to find the users and passwords we introduced by default.

Authentication with OAuth 2 is not quite as straightforward as session based authentication. It is a two step process:

- First, the _authentication_ service gets a username and password and returns a token.
- Second, the _resource_ service gets the token and performs the requested resource operation, if the token represents a user who's authorized for that operation.

For example, in Postman, we will need to set the following request:

- The request itself is a `GET` to `http://localhost:7799/api/articles`
- The Authorization is OAuth 2
    - We need to get a new access token, with the following properties:
        - Grant Type: `Password Credentials`
        - Access Token URL: `http://localhost:7799/oauth/token`
        - Username: `Meg`
        - Password: `lifeisdark`
        - Client ID: `springTraining`
        - Client Secret: `mostSecretClient`
        - Scope: `read write`
        - Client Authentication: `Send as Basic Auth header`

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

We said `compile`. Angular, since version 2, has starting using [Typescript](https://www.typescriptlang.org/) instead of plain Javascript. While having the advantage that it is type safe, Typescript cannot be run directly in the browser. It needs to be compiled into a Javascript flavor (currently ECMA 5). 

In your browser, hit `http://localhost:4200` to see your project start.

## Project anatomy

### package.json

This file is the Angular equivalent of `pom.xml` or `gradle.build`, in that it contains all the project dependencies. 

Every time you change these dependencies, you need to run `npm install`, which updates the project structure with the new or changed dependencies. All these dependecies go into a folder called `node_modules`, which is usually present in your `.gitignore` file.

Let's go ahead and add the following dependencies:

```
"bootstrap-4": "^4.0.0",
"@ng-bootstrap/ng-bootstrap": "^1.0.0-beta.5",
"font-awesome": "^4.7.0",
```

This will fetch the following libraries (you should usually keep these links open most of the time):

- [Bootstrap 4](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
- [NgBootstrap](https://ng-bootstrap.github.io/#/getting-started)
- [FontAwesome](http://fontawesome.io/icons/)

Let's also update the versions (for a normal project, you should do this with care):

`ncu -u`

And now let's fetch the new dependencies and see if it still works:

```
npm install
ng serve
```

### src/index.html

Angular applications are "one page apps". That's the _one_ page.

Except for the title, you should not need to change anything here. If you feel the urge to change anything, there's probably a better way.

### src/styles.scss

This is the main style file of the project. You should put here styles that apply to the _entire_ project. For example, you may want to import here the `bootstrap` and `fontawesome` styles:

```
@import "~bootstrap/scss/bootstrap";
@import "~font-awesome/css/font-awesome.css";
```

### src/app/module.ts

Angular is an IoC container, which means it is able to perform dependency injection, among other things. To do that, it needs a context, from which to inject objects. That context is this `module.ts` file. Any item that is not present directly or indirectly in `module.ts` cannot be injected.

### 