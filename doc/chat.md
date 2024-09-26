# Chat API Spec

## Create Chat

Endpoint: POST /api/chat_sessions/:chatSessionId/chats

Headers: 
- Authorization: token

Request Body :

```json
{
  "sender" : "user",
  "message" : "Hello Bot",
}
```

Response Body

```json
{
  "data" : {
    "id" : 1,
    "sender" : "user",
    "message" : "Hello Bot",
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

Response Body (Failed when connecting to the bot api) :

```json
{
  "errors" : "Service Unavailable"
}
```

## Get Chat

Endpoint : GET /api/chat_sessions/:chatSessionId/chats  

Headers :
- Authorization: token

Response Body

```json
{
  "data" : [
    {
      "id" : 1,
      "sender" : "user",
      "message" : "Hello Bot",
      "created_at" : "2024-01-01T00:00:00.000Z",
    },
    {
      "id" : 2,
      "sender" : "ai",
      "message" : "Hello Human",
      "created_at" : "2024-01-01T00:00:00.000Z",
    }
  ]
}
```