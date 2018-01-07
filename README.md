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

> We said `compile`. Angular, since version 2, has started using [Typescript](https://www.typescriptlang.org/) instead of plain Javascript. While having the advantage that it is type safe, Typescript cannot be run directly in the browser. It needs to be compiled into a Javascript flavor (currently ECMA 5). 

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

> We need the vanilla _Bootstrap 4_ library which contains the `.scss` style sheets. We also need _NgBootstrap_, which is an Angular native rewrite of the Bootstrap javascript component logic.

Let's also update the versions (for a normal project, you should do this with care):

`ncu -u`

And now let's fetch the new dependencies and see if it still works:

```
npm install
ng serve
```

### src/index.html

Angular applications are "one page apps". That's the _one_ page.

> Except for the title, you should not need to change anything here. If you feel the urge to change anything, there's probably a better way.

### src/styles.scss

This is the main style file of the project. You should put here styles that apply to the _entire_ project. For example, you may want to import here the `bootstrap` and `fontawesome` styles:

```
@import "~bootstrap/scss/bootstrap";
@import "~font-awesome/css/font-awesome.css";
```

### src/favicon.ico

This is the icon that will appear in your web browser tab where the application is loaded. While traditionally it was a 16x16 px ico file, modern browsers support png icons and animations, though that option is less standardized. Feel free to play around with web icon editors such as [this](http://www.favicon.cc/).

### src/app/app.module.ts

Angular is an IoC container, which means it is able to perform dependency injection, among other things. To do that, it needs a context, from which to inject objects. That context is this `app.module.ts` file. Any item that is not present directly or indirectly in `app.module.ts` cannot be injected.

We _do_ have, at this point, a module that is not present in `app.module.ts` -- NgBootstrap. So, even though we did mention it in our `package.json`, it can still not be used. As per their setup specifications, we need to add the following to our `imports` section in `app.module.ts` to make it work:

```
NgbModule.forRoot()
```

We need to import the class also (by now, your IDE probably already complained about this):

```
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
```

> Each external library that you import in your Angular project should specify how it needs to be included in the `app.module.ts` file.

> In general, imports in Angular `.ts` files will look for the paths relative to the file itself _OR_ the `node_modules` folder.

### src/app/app.component.*

This is an Angular component that you see loaded in your browser.

Notice the following things about it:

- It is declared in the `declarations` section of `app.module.ts`.
- It has a `@Component` [annotation](https://angular.io/api/core/Component) above the class, with the following items:
    - `selector` - this is an html selector used to inject this component in other templates. This is an element selector, so this component can be injected using `<app-root></app-root>`. In fact, it is injected just so in `index.html`. Other types of selectors are:
        - attribute: `[my-component]`, which would allow you to inject it as `<div my-component></div>`
        - class: `.my-component`, which would allow you to inject it as `<div class='my-component'></div>`
    - `templateUrl` - this is an html file representing the visual part of the component. You can consider the component as consisting of a controller (the `.ts` file) and a view (the `.html` file and, optionally, the `.scss` files)
    - `styleUrls` - this is an array of `.css` or `.scss` files that should be loaded with this component. Be advised that these style sheets will be loaded _only_ with this component and will be removed as it is no longer loaded by the renderer.

### src/environments/

This folder is the Angular equivalent of a properties file, like `application.yml` in Spring.

There are multiple such files, that will be used when `ng build` will be invoked with a switch, such as `--prod`.

> In a production environment, there is no need to deploy `.ts` files, since browsers don't know typescript. We deploy only `.js` files, which are needed by the browser to run the application. More to the point, we will deploy a single `.js` file, which is a packaged, compressed (or _minified_) version of our compiled code, enhanced for best size and performance.

To use the environment variables in any typescript class, you need to import the environment like this:

```
import { environment } from './relative/path/to/environments/environment';
```

## Working with components

So, the Angular CLI made one component for us. Our application will surely need more. Let's agree on a (pseudo) visual structure:

```
<navbar>
    <logo />
    <menu>
        <menu-item />
        <menu-item />
        ...
    </menu>
    <login>...</login>
</navbar>
<content>
...
</content>
```

By Angular's logic, we need:

- a _menu_ component containing a (possibly dynamic) array of items
- a _login_ component which begins as an inline form with username, password and a 'Login' button; after a succesful login, it turns into a 'Logout' button. If the login fails, it should display some indication of the error.

The navbar and the logo are just static visual elements, they can stay in `app.component`.

The main content is represented by the components which are going to be loaded based on navigation, so it's not a _single_ component, it's _any_ component.

Change the `app.component.html` file to this code:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="/">Angular Training</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
    [attr.aria-expanded]="!isCollapsed" aria-label="Toggle navigation" (click)="isCollapsed = !isCollapsed">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent" [ngbCollapse]="isCollapsed">
    <ul class="navbar-nav mr-auto"></ul>
    <app-login class="navbar-nav navbar-right"></app-login>
  </div>
</nav>
<div class="container-fluid">

</div>
```

A few words about the notations you may not recognize in this template:

Square `[]` or round `()` parantheses represent a concept called 'binding'.

- `[property]='var'` means the value of `property` will be updated in the template as soon as the class attribute `var` changes in the controller.
    - some `properties` are innate to the html elements, such as `attr` and `class`; Angular allows the developer to bind boolean values to html element attributes and classes, with the semantic: _'this element has or doesn't have this attribute (or class) depending on the value of `var`'_
- `(some_event)='callback($event)` means that when `some_event` is activated by the user in the template, it needs to trigger the method `callback(event:any)` in the controller, passing the browser event as the argument `event`. While that is a common usage, the binding can also trigger an immediate, inline action, such as is the case in the above template.
- `{{var}}` is a simple printing of the class attribute `var`, which will be update when the attribute changes in the controller.

So, for this template to work, we should add the `isCollapsed` class attribute 

Let's start with the _login_ component.

First, let's create a new folder, inside `/src/app`, called `components` and `cd` into it.

To create a new component using Angular CLI, you can run:

`ng generate component login`

or, shorter:

`ng g c login`

This will create a new folder with the name `login`, put there the `.ts` and `.html` file, along with the unit test file, and add the component to the `app.module.ts`, to make it useable.

For now, let's just make the `.html` file look good; we'll link the loose ends later.

```html
<form class="form-inline" role="form" novalidate>
  <div class="input-group mr-2">
    <div class="input-group-prepend">
      <i class="input-group-text fa fa-user"></i>
    </div>
    <input id="username" type="text" class="form-control form-control-sm" name="username" required>
  </div>
  <div class="input-group mr-2">
    <div class="input-group-prepend">
      <i class="input-group-text fa fa-lock"></i>
    </div>
    <input id="password" type="password" class="form-control form-control-sm" name="password" value="" required>
  </div>
  <button type="submit" class="btn btn-light btn-sm">Login</button>
</form>
```

## Routing

## Services

## Observables