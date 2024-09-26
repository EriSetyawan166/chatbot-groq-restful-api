# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username" : "twily",
  "password" : "rahasia",
  "name" : "Twilight Sparkle"
}
```

Response Body (Success) : 

```json
{
  "data" : {
    "username" : "twily",
    "name" : "Twilight Sparkle",
    "created_at" : "2024-01-01T00:00:00.000Z", 
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username" : "twily",
  "password" : "rahasia"
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "twily",
    "name" : "Twilight Sparkle",
    "token" : "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : {
    "username" : "twily",
    "name" : "Twilight Sparkle"
  }
}
```

Response Body (Failed) :

```json
{
  "errors" : "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :
- Authorization: token

Request Body :

```json
{
  "password" : "rahasia", // optional, if want to change password
  "name" : "Twilight Sparkle" // optional, if want to change name
}
```

Response Body (Success) :

```json
{
  "data" : {
    "username" : "twily",
    "name" : "Twilight Sparkle"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :
- Authorization: token

Response Body (Success) :

```json
{
  "data" : true
}
```