# Tutor Bounty REST API Documentation
Note that not all endpoints are documented. This is because some are used internally by the app and _should not_ (in general) be used by an individual. Examples include the callback URL for Google OAuth, an endpoint for PeerJS internals, etc.

## Authentication API

### Log in
- description: login as a user
- request: `POST /api/login`
    - content-type: `application/json`
    - body: object
      - email: (string) email to sign in as
      - password: (string) password for the account

- response: 200
    - body: N/A

- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 404
- response: 500

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
      --data '{ "email": "alice", "password": "securePass" }'
       http://localhost:3000/api/login'
```


### Sign up
- description: sign up a new user
- request: `POST /signup`
    - content-type: `application/json`
    - body: object
      - name: (string) Name of the person
      - username: (string) username to create
      - email: (string) Email of the person
      - password: (string) password for the account
      - confirmPassword: (string) same as password for the account

- response: 200
    - body: N/A

- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 500

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
      --data '{ "username": "alice", "password": "securePass", "confirmPassword": "securePass" "name": "a", "email": "a@a.ca" }'
       http://localhost:3000/api/signup'
```

### Google Auth
- description: Sign in with google
- request: `GET /api/auth/google`

- response: 300

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
       http://localhost:3000/api/auth/google'
```

### Logout
- description: sign up a new user
- request: `POST /signup`
- response: 200
    - body: N/A

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
       http://localhost:3000/api/logout'
```

### Current User
- description: Get info about currently signed in user
- request: `GET /api/currentUser`
- response: 200
    - body: N/A
    - content-type: `application/json`
    - body: object
      - username: (string) username of person
      - name: (string) name of the person
      - email: (string) email of person

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
       http://localhost:3000/api/currentUser'
```
