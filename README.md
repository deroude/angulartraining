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

> We said `compile`. Angular, since version 2, has started using [Typescript](https://www.typescriptlang.org/) instead of plain Javascript. Typescript has the advantage that it is type safe, however it cannot be run directly in the browser. It needs to be compiled into a Javascript flavor (currently ECMA 5). 

In your browser, hit `http://localhost:4200` to see your project start.

## Project anatomy

### package.json

This file is the Angular equivalent of `pom.xml` or `gradle.build`, in that it contains all the project dependencies. 

Every time you change these dependencies, you need to run `npm install`, which updates the project structure with the new or changed dependencies. All these dependecies go into a folder called `node_modules`. When you commit your code, you will not upload this folder, so it will usually be mentioned in your `.gitignore` file.

Let's go ahead and add the following dependencies:

```
"bootstrap-4": "^4.0.0",
"@ng-bootstrap/ng-bootstrap": "^1.0.0-beta.5",
"font-awesome": "^4.7.0",
"ngx-cookie-service": "^1.0.9"
```

Aside for the uninteresting cookie service, this will fetch the following libraries (you should usually keep these links open most of the time):

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

This is the Angular component that you see loaded in your browser, the only componennt so far.

Notice the following things about it:

- It is declared in the `declarations` section of `app.module.ts`.
- Since it is the entry point of our application, it is also declared in the `bootstrap` section of `app.module.ts`.
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

> The classes and html structure you see here is specific to Bootstrap. You will find it in the navbar section of either Bootstrap of NgBootstrap.

A few words about the notations you may not recognize in this template:

Square `[]` or round `()` parantheses represent a concept called 'binding'.

- `[property]='var'` means the value of `property` will be updated in the template as soon as the class attribute `var` changes in the controller.
    - some `properties` are innate to the html elements, such as `attr` and `class`; Angular allows the developer to bind boolean values to html element attributes and classes, with the semantic: _'this element has or doesn't have this attribute (or class) depending on the value of `var`'_
- `(some_event)='callback($event)` means that when `some_event` is activated by the user in the template, it needs to trigger the method `callback(event:any)` in the controller, passing the browser event as the argument `event`. While that is a common usage, the binding can also trigger an immediate, inline action, such as is the case in the above template.
- `{{var}}` is a simple printing of the class attribute `var`, which will be updated when the attribute changes in the controller.

So, for this template to work, we should add the `isCollapsed` class attribute:

```typescript
isCollapsed:boolean=true;
```
> Collapsed or not doesn't really matter when the page is loaded in a wide window, such as your laptop full screen. It will become active only the page is loaded on a narrow screen, such as a mobile phone, or a smaller window. We want the menu items to start off as collapsed in that case, hence the initialization value `true`.

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

Our application has a navbar, which is persistent regardless of the page content. It also has a section we called 'content', with an obvious intention: we want to click on links on the menu and expect stuff to load in the content section. In Angular, this is called routing. The content is represented by various components and the navigation itself is declared in the `app.module.ts`. 

We have two tables in our DB: `Users` and `Articles`. Since we intend to make this a CRUD application, we'll have two corresponding pages, that will display these tables.

We also need a 'Home' page, to say hello to anonymous visitors, as well as a 'Not Found' page, if a user tries to access a wrong URL.

### Step 1: Content components

First, let's create the components used to represent our page content: we will in fact repeat the steps we did for the `login` component:

```
cd src/app/components
ng g c home
ng g c article-list
ng g c user-list
ng g c not-found
```

### Step 2: the Routes

Next, we need to define the navigation, in `app.module.ts`. Now, our `app.module.ts` is already pretty large as it is, and we expect the routes list to grow, so we will put it in another `.module.ts` file instead -- called `app-routing.module.ts`:

```typescript
import { HomeComponent } from './components/home/home.component';
import { ArticleListComponent } from './components/article-list/article-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UserListComponent } from './components/user-list/user-list.component';

const appRoutes: Routes = [
  { path: 'users', component: UserListComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: '', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ]
})
export class AppRoutingModule { }
```

Note that this new module exports something: the `RouterModule` we just constructed with our routes. So, we need to import it into our main `app.module.ts` -- by adding `AppRoutingModule` to the `imports` section.

> You may need to stop the `ng serve` watch cycle and restart it: a new module will not be picked up automatically.

### Step 3: the `router-outlet`

We still haven't told our `app.component` _where_ we want the content to be loaded. Change the html code to:

```html
<div class="container-fluid">
  <router-outlet><router-outlet>
</div>
```

At this point, you may point your browser to `http://localhost:4200/users` for example. The new route should kick in and you should see your `user-list` component.

### Step 4: the `router-link`-s

Now all you have to do is wire the paths in the menu links. We won't use traditional `<a href='...'>` links, because we don't the whole html page to reload. We want to load _only_ the content.

Change your menu list in `app.component.html` to the following:

```html
<ul class="navbar-nav mr-auto">
    <li class="nav-item" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <a routerLink="/" class="nav-link" >Home</a>
    </li>
    <li class="nav-item"  routerLinkActive="active">
        <a routerLink="/users" class="nav-link">Users</a>
    </li>
    <li class="nav-item" routerLinkActive="active">
        <a routerLink="/articles" class="nav-link" >Articles</a>
    </li>
</ul>
```

A few words about this setup:

- `routerLink` is the path _inside_ the application routing module, corresponding to a component that should be loaded as the page content
- `routerLinkActive` is a css class that should be applied to the element if it corresponds to the currently loaded content; notice that it doesn't need to be applied to the _link_element; it can be applied to any parent element in the hierarchy. Now, if you navigate in your browser, you should see the color of the active link change slightly as the Bootstrap `active` class is applied to it.
- `[routerLinkActiveOptions]="{exact: true}"` is a trick that prevents the empty path from matching all the other paths as well (and keeping the 'Home' button lit all the time)

## Services

So far we haven't exchanged any data with the REST API. If our application is to do any useful work, we'll need that very soon. 

We want to separate the business of discussing with the server from the business of displaying the results, so we are not going to make REST calls in the controllers, we will define specialized services to take care of that -- and we will inject them into our controllers. Remember, Angular is a IoC container, so we can do that.

Services need to be declared in the `app.module.ts`, but not in the `declarations` or `imports` sections we have used so far, but in the `providers` section.

We have a service that we can declare already. It was brought to us with the cookie library we added from `package.json`. So, we will add an import to the `app.module.ts` file:

```typescript
import { CookieService } from 'ngx-cookie-service';
```

Then we will add the service in the `providers` section:

```typescript
providers: [CookieService]
```

Since our services will definitely use `HttpClient`, we should also add that to our `app.module.ts`.

The import is:

```typescript
import { HttpClientModule } from '@angular/common/http';
```

Since this is a module, we add it in the `imports` section.

### Authentication

Remember that most of our resources are protected on the REST API side. We won't be able to access much without being authenticated. 

Have you seen the authentication token returned by the OAuth authorization server? If you put that json into a Typescript class, it would look like this:

```typescript
export class AuthToken {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
}
```

We will need that. Let's save it as `src/app/domain/auth.token.ts`.

And let's set some expectations for our authentication service:

- When a login is requested
  - It should be able to obtain authentication tokens, based on the credentials _we_ used in the REST client
  - It should store the authentication token, because it will be used in _every_ request
  - It should observe the authentication token expiry
  - It should notify an authentication success or error
- When a logout is requested
  - It should clear the tokens stored
  - It should notify the application that there is no longer an authorized user
- When a regular request is made for a resource requiring an authenticated user
  - It should verify that an authentication token is stored
  - If an authentication token is not present, but a refresh token is present, a new authentication token should be requested based on the refresh token
  - If neither an authentication token, nor a refresh token are stored, the request should be rejected

#### The service class

We will start by creating the service class. Create a new folder under `src/app` called `services` and `cd` into it. Then tell Angular CLI to generate a service for you:

```
ng generate service auth
```

or, shorter:

```
ng g s auth
```

Notice that, unlike the components, the service was not automatically added to `app.module.ts`, so we'll need to do it manually -- in the `providers` section.

The CLI gave us a blank constructor, but we will need some injected resources, for starters an `HttpClient` to connect to the REST API and `CookieService` for token storage.

```typescript
constructor(
        private _http: HttpClient, private _cookie: CookieService) {
    }
```

#### Cookies

Next, let's add some methods to help us with the cookies:

```typescript
    private getAuth(): string {
        return this._cookie.get("auth");
    }

    private getRefresh(): string {
        return this._cookie.get("refresh");
    }

    private setAuth(a: AuthToken): void {
        this._cookie.set("auth", a.access_token, new Date(new Date().getTime() + a.expires_in * 1000));
        this._cookie.set("refresh", a.refresh_token);
    }
```

Notice that the authentication token has an expiry timer, that's how the OAuth server works. That timer is expressed in seconds. We don't want to take care of that, so we just set the similar expiry timer on the cookie, and let the browser take care of it.

#### Observables

In the service expectations we listed above, we mentioned a few times the word 'notify'. That means the rest of the application will not wait for a user to be authenticated. It will just go about its business and change its behavior asynchronously, based on this service's status.

The most popular framework responsible for such interactions is [ReactiveX](http://reactivex.io/rxjs/) and is used extensively in Angular.

The base object encapsulating this pattern is `Observable`. While Java also has a similar pattern by this name, you will find this javascript philosophy closer to the `Future` threading pattern. Javascript is (so far) single threaded. Asynchronicity is therefore used as a best surrogate for multi-threading.

There is a variety of `Observables`. The one that is closest to our goals is the `BehaviorSubject`, because:

- It is a `Subject`, which means it can be triggered an arbitrary amount of times, using `next(...)`
- It can be given an initial value
- If a subscriber arrives later, it still gets the latest value (with compliments)

We will also need the `Observable` as well, because the `HttpClient` uses it. Because the framework is rather heavy, the operations that can be done with `Observables` don't come bundled in a single import, instead we need to import each of them separately. So, our import section will need the following:

```typescript
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
```

And our notification subject will be defined as a member of our class like this:

```typescript
public authenticated: BehaviorSubject<boolean> = new BehaviorSubject(this._cookie.check("auth"));
```

#### Environment

Remember (from project anatomy) that we can use the `environment.ts` file to store application parameters (like secrets or keys). The authentication process takes two sets of credentials: 

- the user credentials, that will be input by, well, the user
- the application credentials (clientID and clientSecret) -- to us these are rather irrelevant, since we are the only ones authenticating on this server; to Facebook OAuth, these are quite relevant though.

So, let's fill our `environment.ts` and `environment.prod.ts` with details about our REST API and authentication details:

```typescript
  oauthClientId:"springTraining",
  oauthClientSecret:"mostSecretClient",
  rootPath:"http://localhost:7799/",
  oauthTokenPath:"oauth/token"
```

And let's import the `environment` into our service class:

```typescript
import { environment } from './../../environments/environment';
```

Now let's add the main methods:

#### Login

```typescript
public login(username: string, password: string): Observable<string> {
        let params:string="username="+username+"&password="+password+"&grant_type=password";
        let headers = new HttpHeaders()
            .set('Content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + btoa(environment.oauthClientId + ":" + environment.oauthClientSecret));
        return this._http.post<AuthToken>(environment.rootPath + environment.oauthTokenPath, params.toString(), { headers: headers })
            .map(re => {
                this.setAuth(re);
                this.authenticated.next(true);
                return re.access_token;
            }).catch(this.handleError);
    }

private handleError(error: Response) {
        return Observable.throw(error.json()['error'] || 'Login error');
    }

```

Step by step, this is what this does:

- constructs the params and the headers for a request, using the `username`/`password` arguments, as well as the `environment` variables
- sends a `post` request to the OAuth url and returns a 'future', or 'promise', or in our terminology an `Observable` with the following semantic:
  - if the POST request returns a successful answer, we will do the following:
    - store the auth and refresh tokens
    - notify everyone subscribed to `authenticated` that there is an authenticated user
    - notify everyone subscribed to `login` and giving them the auth token
  - if the POST request fails, we will throw an error (thus notifying anyone subscribed to `login` that the authentication has failed)

#### Refresh

```typescript
private refreshAccessToken(): Observable<string> {
        if (!this.getRefresh()) {
            return;
        }
        let params:string = "refresh_token="+this.getRefresh()+"&grant_type=refresh_token";
        let headers = new HttpHeaders()
            .set('Content-type', 'application/x-www-form-urlencoded')
            .set('Authorization', 'Basic ' + btoa(environment.oauthClientId + ":" + environment.oauthClientSecret));
        return this._http.post<AuthToken>(environment.rootPath + environment.oauthTokenPath, params, { headers: headers })
            .map(re => {
                this.setAuth(re);
                this.authenticated.next(true);
                return re.access_token;
            });
    }
```

This is rather similar to the previous listing: we are using the stored refresh token to obtain a new access token via a POST request.

#### Logout

```typescript
    public logout(): void {
        this._cookie.delete("auth");
        this._cookie.delete("refresh");
        this.authenticated.next(false);
    }
```

We just clear the storage and notify anyone subscribing to `authenticated` that the user is no longer authenticated.

#### Check credentials

The REST service will not allow an unauthenticated user to access resources. So, each request will need to be accompanied by an authentication token.

```typescript
public checkCredentials(): Observable<string> {
        if (this.getAuth()) {
            return Observable.of(this.getAuth());
        } else {
            if (this.getRefresh()) {
                return this.refreshAccessToken();
            } else {
                return Observable.of(null);
            }
        }
    }
```

Basically, this does just as we set our expectation: return the stored authentication token, if it exists; attempts to obtain a new one if a refresh token exists; return null if neither case is possible.

#### Wire in the `login.component`

Now that we have a working Authentication Service, let's use it in the Login component.

##### Inject the service

Our service is declared as a provider in the `app.module.ts` so we can inject it in the `login.component.ts` constructor:

```typescript
constructor(private authSvc: AuthService) { }
```

##### Login / Logout switch

We want the login form to be displayed if the user is _not_ authenticated; otherwise, we want to display the logout button.

Right now, we only have the login form. We should make that conditional:

```html
<form class="form-inline" role="form" novalidate *ngIf="!(authSvc.authenticated|async)">
```

It might not look like it, but there are a lot of new things in this line of code.

The first is `*ngIf`: that's a directive used by Angular to determine whether or not to render this element (the _entire_ element, with its whole hierarchy of children) -- based on a boolean condition from the controller's class members. In our case, we access the `authSvc` we injected in the constructor (thus it is automatically a class member), and drill down to its `authenticated` member.

But wait, `authenticated` is not a boolean, it is a `BehaviorSubject<boolean>`, or, more generally speaking, an `Observable<boolean>`. Which is why we have the `async` [Pipe](https://angular.io/api/common/AsyncPipe). 

[Pipes](https://angular.io/guide/pipes) are Angular's way of transforming data directly into the view. There are a variety of built in such pipes, performing date, string, or number formatting -- and you can build your own as well. The `async` pipe is somewhat special, in that it basically subscribes the view to an `Observable` or `Promise` and refreshes it when the subscription is triggered with a new value.

In our case, the `BehaviorSubject` will trigger immediately with a `false` value, then every time the authentication status changes.

To finish the task at hand, let's also add a `Logout` button:

```html
<button type="button" class="btn btn-light btn-sm" *ngIf="authSvc.authenticated|async">Logout</button>
```

##### Wiring the login form

The first key word of this task is 'form'.

To handle forms in Angular, we need the respective module brought in `app.module.ts`: add `FormsModule` to the `imports` section.

Next, if we are going to bind our simple html form to something in our controller, that 'something' needs to be defined, in the shape of a model. So, we are going to add the `User` class to our domain folder:

```typescript
export class User{
    username:string;
    password?:string;
    name?:string;
    status?:string;
    role?:string;
    id?:number;
}
```

Notice the `?` mark on all members except the `username`. This tells Typescript that only `username` is mandatory, the `User` object is valid though in the absence of any other member.

Now that we have the domain object defined, let's create one in the `login.component.ts`, that we will bind to the form:

```typescript
private user:User=new User();
```

And we can bind that to the inputs in the form, by adding `[(ngModel)]='user.username'` to the username input and `[(ngModel)]='user.password'` to the password input.

We talked a bit earlier about binding, but this is a chance to see it in action. Having both `[]` and `()` means we have double binding: anything we type in the inputs goes straight to the controller; if the controller updates the `user` member, that update goes straight to the view.

We also need a method that gets called when the form is submitted (and another method that's called when the logout button is pressed):

```typescript
login(): void {
        this.authSvc.login(this.user.username, this.user.password).subscribe(token=>console.log(token));
    }

logout(): void {
        this.authSvc.logout();
    }
```

Note that for now we are not doing anything with the token received when we login, just printing it on the browser's console. But in the (near) future we will replace that with something useful. The logout doesn't need a similar treatment, because it is synchronous. We don't need to notify the REST service of our intention to logout, because it never carried any notion of us being logged in to begin with. 

Next, bind these two actions to the template elements, i.e. add `(ngSubmit)='login()` to the `form` element and `(click)='logout()'` to the logout button.

Note that if you login, then refresh the page, the logged in state persists, because the auth token is stored in the `auth` cookie.