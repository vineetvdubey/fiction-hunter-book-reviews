# API Documentation

Non signed-in visitors do not have any authorization/role.
There are two possible roles in the system:

1. ADMIN
2. USER

ADMIN cannot be created via `signup user API`. All users created using the APIs have `USER` role by default.

Once a user logs in sucessfully, session based authentication is used.

<hr>
<br>

## Signup user

Used to sign up a new user.

Auth required: NO  
Required role: NONE

`POST` `/api/users`

### Request Data

```json
{
  "email": "[valid email address]",
  "userName": "[non empty name]",
  "password": "[password in plain text]"
}
```

### Success Response

Status code: `201`

```json
{
  "userId": "[id]"
}
```

### Error Response

Condition: Body missing, expected fields in body missing, user already exists  
Status code: `400`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Login user

Used to login a user.  

Auth required: NO  
Required role: NONE

`POST` `/api/sessions`

### Request Data

```json
{
  "email": "[valid email address]",
  "password": "[password in plain text]"
}
```

### Success Response

Status code: `200`

```json
{
  "userId": "[user id]",
  "role": "USER"
}
```

### Error Response

Condition: Body missing, expected fields in body missing, wrong credentials  
Status code: `400`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Logout user

Used to delete a session.

Auth required: NONE  
Required role: NONE

`DELETE` `/api/sessions/me`

### Success Response

Status code: `204`

<hr>
<br>

## Get details of logged in user

Gets the id, name and role of the logged in user. Can also be used to verify if the user is logged in.

Auth required: YES  
Required role: ADMIN/USER

`POST` `/api/users/me`

### Success Response

Status code: `200`

```json
{
  "userId": "[user id]",
  "userName": "[userName]",
  "role": "USER"
}
```

### Error Response

Condition: User is not logged in.  
Status code: `401`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Get books

Gets list of all books

Auth required: NO  
Required role: NONE

`GET` `/api/books`

### Success Response

Status code: `200`

```json
[
  {
    "bookId": "[book id]",
    "title": "[title]",
    "author": "[author]",
    "imageUrl": "[imageUrl]",
    "averageRating": "[averageRating]"
  },
  {
    ...
  }
]
```

<hr>
<br>

## Get selected book

Gets all available details about the selected book along with review comments.

Auth required: NO  
Required role: NONE

**`GET`** _`/api/books/:bookId`_

### Success Response

Status code: `200`

```
{
  "bookId": "[book id]",
  "title": "[title]",
  "author": "[author]",
  "description": "[description]",
  "imageUrl": "[imageUrl]",
  "averageRating": "[averageRating]",
  "reviews": [
    {
      "userId": "[userId of reviewer]",
      "userName": "[name of reviewer]",
      "message": "[review message]",
      "postedAt": "[epoch milliseconds]"
    },
    {
      ...
    }
  ]
```

<hr>
<br>

## Add book

_This is an ADMIN api._ Adds a new book to the collection for listing.

Auth required: YES  
Required role: ADMIN

**`POST`** _`/api/books`_

### Request Data

```json
{
  "title": "[title]",
  "author": "[author]",
  "description": "[description]",
  "imageUrl": "[imageUrl]"
}
```

### Success Response

Status code: `201`

```json
{
  "bookId": "[book id]"
}
```

<hr>
<br>

## Add Rating

Adds a rating to a book.

Auth required: YES  
Required role: USER/ADMIN

`PUT` `/api/books/:bookId/ratings`

### Request Data

```json
{
  "rating" : 5, ## rating from 1 to 5
}
```

### Success Response

Status code: `200`

### Error Response

Condition: User is not logged in.  
Status code: `401`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Delete Rating

Deletes logged in user's rating to a book.

Auth required: YES  
Required role: USER/ADMIN

`DELETE` `/api/books/:bookId/ratings/me`

### Success Response

Status code: `204`

### Error Response

Condition: User is not logged in.  
Status code: `401`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Add Review

Adds a review to a book.

Auth required: YES  
Required role: USER/ADMIN

`POST` `/api/books/:bookId/reviews`

### Request Data

```json
{
  "message" : "[review message]"
}
```

### Success Response

Status code: `200`

### Error Response

Condition: User is not logged in.  
Status code: `401`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>

## Delete Rating

Deletes logged in user's review to a book.

Auth required: YES  
Required role: USER/ADMIN

`DELETE` `/api/books/:bookId/reviews/me`

### Success Response

Status code: `204`

### Error Response

Condition: User is not logged in.  
Status code: `401`

```json
{
  "error": "[appropriate explanation]"
}
```

<hr>
<br>
