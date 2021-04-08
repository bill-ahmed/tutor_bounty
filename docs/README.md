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
- request: `POST /logout`
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

## User Posting API

### Get list of postings
- description: Get a list of postings based on provided criteria
- request: `GET /api/userPostings/`
    - query:
      - sort: (string) what to sort by
      - search: (string) search query
      - priceStart: (string) minimum price
      - priceEnd: (string) max price
      - dateStart: (date) earliest possible datew
      - dateEnd: (date) furthest possible date
      - duration: (string) length of the meeting required
      - category: (string) what category it belongs in

- response: 200
  - content-type: `application/json`
  - body: Array<\object>
    - title: (string) title of posting
    - description: (string) details about the posting
    - startDate: (date) Date to start at
    - startTime: (date) Time to start at
    - duration: (string) Number of hours 
    - category: (string) Which category is belongs to
    - value: (number) The monetary value in dollars (USD)



- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 500
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
      --data '{ "search": "some title" }'
       http://localhost:3000/api/userPostings'
```

### New Posting
- description: Create a new posting
- request: `POST /api/userPostings/new`
    - content-type: `application/json`
    - body: object
      - title: (string) title of posting
      - description: (string) details about the posting
      - startDate: (date) Date to start at
      - startTime: (date) Time to start at
      - duration: (string) Number of hours 
      - category: (string) Which category is belongs to
      - value: (number) The monetary value in dollars (USD)

- response: 200
  - body: N/A

- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 500
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
      --data '{ "title": "hi", "description": "bye", "value": "420" }'
       http://localhost:3000/api/userPostings/new'
```

### Detailed posting info
- description: Get detailed info about a posting
- request: `GET /api/userPostings/:id`

- response: 200
    - content-type: `application/json`
    - body: object
      - title: (string) title of posting
      - description: (string) details about the posting
      - startDate: (date) Date to start at
      - startTime: (date) Time to start at
      - duration: (string) Number of hours 
      - category: (string) Which category is belongs to
      - value: (number) The monetary value in dollars (USD)

- response: 404
  - body: N/A
``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
       http://localhost:3000/api/userPostings/12345'
```

### Accept a user posting
- description: Allow another user to accept a posting with given id
- request: `POST /api/userPostings/:id/accept`

- response: 200
  - body: N/A

- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 404
  - body: N/A

- response: 500
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
       http://localhost:3000/api/userPostings/12345/accept'
```

## User Meeting API

### List of my meetings
- description: Get list of meetings for current user
- request: `GET /api/meetings/myMeetings`

- response: 200
  - content-type: `application/json`
  - body: Array<\object>
    - host: (string) ID of the host
    - tutor: (string) ID of the tutor
    - user_posting: (object) Same as what's given by `/api/userPostings/:id`
    - completed: (boolean) Whether meeting has ended or not

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
       http://localhost:3000/api/meetings/myMeetings'
```

### Details about a meeting
- description: Detailed info about meeting with given id
- request: `GET /api/meetings/:id`

- response: 200
  - content-type: `application/json`
  - body: object
    - host: (string) ID of the host
    - tutor: (string) ID of the tutor
    - user_posting: (object) Same as what's given by `/api/userPostings/:id`
    - completed: (boolean) Whether meeting has ended or not

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
       http://localhost:3000/api/meetings/123456'
```

### Send a message
- description: Send given message to everyone in the meeting room
- request: `POST /api/meetings/:id/sendMessage`
  - content-type: `application/json`
  - body: object
    - message: (string) the message to send, maximum allowed length is 2000 characters

- response: 200
  - body: N/A

- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 500
  - body: N/A

``` 
$ curl -H "Content-Type: application/json"\ 
      -X POST\
      --data '{ "message": "hello world" }'\
       http://localhost:3000/api/meetings/123456/sendMessage'
```

### Get messages
- description: Get last 15 messages that were sent in the room, with pagination support
- request: `GET /api/meetings/:id/messages?page=0`

- response: 200
  - content-type: `application/json`
  - body: Array<\object>
    - user_meeting: (string) id of the meeting
    - to: (string) id of the person it was sent to
    - from: (string) id of the person it was from
    - content: (string) body of the message

``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
      --data '{ "message": "hello world" }'\
       http://localhost:3000/api/meetings/123456/sendMessage'
```


### Rate meeting
- description: Give the other person a rating from 1-5
- request: `GET /api/meetings/:id/rate`
  - content-type: `application/json`
  - body: object
    - rating: (number) between 1-5 rating

- response: 200
- response: 400
  - content-type: `application/json`
  - body: object
    - { msg: string }[]

- response: 500
``` 
$ curl -H "Content-Type: application/json"\ 
      -X GET\
      --data '{ "message": "hello world" }'\
       http://localhost:3000/api/meetings/123456/sendMessage'
```