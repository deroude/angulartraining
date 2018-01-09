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

@[1-16](Imports)
@[19-25](Declarations)
@[27-32](Imports)
@[34](Providers)
@[35](Bootstrap)

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

## Authentication requirement

### When a login is requested

- It should be able to obtain authentication tokens, based on the credentials _we_ used in the REST client
- It should store the authentication token, because it will be used in _every_ request
- It should observe the authentication token expiry
- It should notify an authentication success or error

---

## Authentication requirement (cont'd)

### When a logout is requested

- It should clear the tokens stored
- It should notify the application that there is no longer an authorized user

---

## Authentication requirement (cont'd)

### When a regular request is made for a resource requiring an authenticated user

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