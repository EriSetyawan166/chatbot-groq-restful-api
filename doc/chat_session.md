# Chat Session API Spec

## Create Chat Session

Endpoint: POST /api/chat_sessions

Headers: 
- Authorization: token

Request Body :

```json
{
  "title" : "new chat",
}
```

Response Body :

```json
{
  "data" : {
    "id" : 1,
    "title" : "new chat",
    "is_active" : "true",
    "created_at" : "2024-01-01T00:00:00.000Z", 
  } 
}
```

Response Body (Failed Authorization token not matching) :

```json
{
  "errors" : "Unauthorized"
}
```

Response Body (Failed Invalid Request) :

```json
{
  "errors" : "Bad Request"
}
```

Response Body (Failed Not Found) :

```json
{
  "errors" : "Not Found"
}
```

## Get Chat Session

Endpoint : GET /api/chat_sessions/:sessionId

Headers :
- Authorization: token

Response Body :

```json
{
  "data" : {
    "id" : 1,
    "title" : "new chat",
    "is_active" : "true",
    "created_at" : "2024-01-01T00:00:00.000Z", 
  } 
}
```

Response Body (Failed Authorization token not matching) :

```json
{
  "errors" : "Unauthorized"
}
```

Response Body (Failed Invalid Request) :

```json
{
  "errors" : "Bad Request"
}
```

Response Body (Failed Not Found) :

```json
{
  "errors" : "Not Found"
}
```

## Update Chat Session

Endpoint : PUT /api/contacts/:contactId

Headers :
- Authorization: token

Request Body :

```json
{
  "title" : "new chat updated",
}
```

Response Body :

```json
{
  "data" : {
    "id" : 1,
    "title" : "new chat updated",
    "is_active" : "true",
    "created_at" : "2024-01-01T00:00:00.000Z", 
  } 
}
```

Response Body (Failed Authorization token not matching) :

```json
{
  "errors" : "Unauthorized"
}
```

Response Body (Failed Invalid Request) :

```json
{
  "errors" : "Bad Request"
}
```

Response Body (Failed Not Found) :

```json
{
  "errors" : "Not Found"
}
```

## Remove Chat Session

Endpoint : DELETE /api/chat_session/:chatSessionId

Headers :
- Authorization: token

Response Body :

```json
{
  "data" : true
}
```

Response Body (Failed Authorization token not matching) :

```json
{
  "errors" : "Unauthorized"
}
```

Response Body (Failed Invalid Request) :

```json
{
  "errors" : "Bad Request"
}
```

Response Body (Failed Not Found) :

```json
{
  "errors" : "Not Found"
}
```