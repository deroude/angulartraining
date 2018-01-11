# Angular 5 Startup

### Presented for MindIT

---

## Goals

- Construct an Angular 5 application:
    - Navigate between views
    - Perform CRUD operations
    - Consume a REST service
    - Authenticate using an OAuth 2 service
- Become familiar with Web technologies:
    - Typescript & Rx
    - HTML 5
    - Bootstrap 4 visual elements
    - CSS / SASS

---

## Start

```
ng new AngularTraining --style=scss` 

ng serve
```

Yup, that simple. Now point your browser to `http//localhost:4200`.

---?code=package.json&lang=json&title=package.json

@[14-30](Build dependencies)
@[32-51](Dev dependencies)

---?code=src/index.html&lang=html&title=index.html

@[5](Title)
@[6](Base)
@[8](Viewport)
@[9](Favicon)
@[12](App root)

---?code=src/app/app.module.ts&lang=typescript&title=app.module.ts

@[1-17](Imports)
@[20-28](Declarations)
@[29-36](Imports)
@[37](Providers)
@[38](Bootstrap)
@[39](Entry components)

---?code=src/app/app.component.ts&lang=typescript&title=app.component.ts

@[4](Selector)
@[5](Template)
@[6](Style)

---?code=src/app/app.component.html&lang=html&title=app.component.html

@[1-21](Navbar)
@[7-20](Collapsible)
@[19](Login)
@[22](Content)

---

## Create the login form

```
ng g c login
```

What this does:

- create folder
- create `login.component.ts`
- create `login.component.html`
- create `login.component.scss`
- create `login.component.spec.ts`
- add component to `app.module.ts`

---?code=src/app/components/login/login.component.html&lang=html&title=login.component.html

@[2-7](Input group)
@[3-5](Font awesome additions)

---

## Routing

- Content components
- Routing module
- Router outlet
- Router link

---?code=src/app/app-routing.module.ts&lang=typescript&title=app-routing.module.ts

@[8-13](The routes)

---?code=src/app/app.component.html&lang=html&title=app.component.html

@[23](Router outlet)
@[9-17](Router links)

---

## Authentication

### When a login is requested

- It should be able to obtain authentication tokens, based on the credentials _we_ used in the REST client
- It should store the authentication token, because it will be used in _every_ request
- It should observe the authentication token expiry
- It should notify an authentication success or error

---

## Authentication (cont'd)

### When a logout is requested

- It should clear the tokens stored
- It should notify the application that there is no longer an authorized user

---

## Authentication (cont'd)

### When a regular request is made

- It should verify that an authentication token is stored
- If an authentication token is not present, but a refresh token is present, a new authentication token should be requested based on the refresh token
- If neither an authentication token, nor a refresh token are stored, the request should be rejected

---?code=src/app/services/auth.service.ts&lang=typescript&title=auth.service.ts

@[18-20](constructor)
@[73-84](Cookie handling)
@[22-33](login)
@[69-71](Error handler)
@[35-49](refresh)
@[51-55](logout)
@[57-67](Check credentials)

---?code=src/app/components/login/login.component.html&lang=html&title=login.component.html

@[1](form element)
@[6,12](ngModel)

---

## REST

- `GET /gidgets` = 'I want a list of gidgets'
- `GET /gidgets/11` = 'I want gidget with ID 11'
- `POST /gidgets [...]` = 'Create a new gidget'
- `PUT /gidgets/11 [...]` = 'Update gidget 11'
- `DELETE /gidget/11` = 'Delete gidget 11'

---

## REST (cont'd)

- `HTTP 2xx` = OK(-ish)
- `HTTP 400` = Bad request
- `HTTP 401` = Not authorized
- `HTTP 404` = Not found
- `HTTP 500` = Server error

---?code=src/app/services/rest.service.ts&lang=typescript&title=rest.service.ts

@[13](constructor)
@[15-31](getList)
@[33-45](getOne)
@[47-59](delete)
@[61-73](update)
@[75-89](create)

---

## CRUD

- Table
- Pagination
- Sort
- Filter / Search
- Delete selected
- Modal editor for New / Selected

---?code=src/app/components/user-list/user-list.component.ts&lang=typescript&title=user-list.component.ts

@[18](Constructor)
@[20-25](Members)
@[27](Communication with Editor)
@[29-35](OnInit)
@[38-45](Load from REST)
@[47-55](Sort)
@[67-70](Create)
@[57-61](Update)
@[63-65](Delete)

---?code=src/app/components/user-list/user-list.component.html&lang=html&title=user-list.component.html

@[1-8](Control bar)
@[2-3](Pagination)
@[4-5](Search)
@[6](Delete)
@[7](New)
@[10-21](Header)
@[13,15,17,19](Font Awesome sort icons logic)
@[22-29](Table body)

---?code=src/app/components/user-editor/user-editor.component.ts&lang=typescript&title=user-editor.component.ts

@[14-15](Constructor)
@[17-21](Inputs)
@[31-39](Form creation)
@[40-56](Form submit)
@[58-61](Visual field validation)

---?code=src/app/components/user-editor/user-editor.component.html&lang=html&title=user-editor.component.html

@[1] (Form binding)
@[11,19](Control reconciliation)

---
## Challenge 1:

- Routing can make use of a `CanLoad` and a [`CanActivate`](https://angular.io/api/router/CanActivate) interface implementation to choose whether or not a user can navigate to a certain page/component. Use this to restrict navigation to `Users` and `Articles` only for logged in users.
- Do not show the links in the menu for anonymous users.
- Use `Router` to navigate to `/` when a route cannot be activated.

---
## Challenge 2:

Build a CRUD for the `Articles` section.

---
## Challenge 3:

Build a 'blog' on the `Home` page.

An anonymous user should see only articles returned under `/public/articles` path of the REST API, while a logged in user should see all the articles.

Order by date descending.

---
## Challenge 4:

```typescript
Dumi.present.subscribe(is=>{
    if(is){
        challenges.next("Build Dumi's component");
    }
});
```

---
## Challenge 5:

Translation challenge: 

- Build a service that retrieves key value pairs
- Build a component that switches languages
- Build a [pipe](https://angular.io/guide/pipes) that uses the service to translate items on page

---
## Challenge 6:

Use [ngx-charts](https://github.com/swimlane/ngx-charts) to build the following charts:
- Articles / user (bar)
- Active / Inactive users (pie)
- Admin / Regular users (pie)