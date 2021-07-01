# API Documentation  

Non signed-in visitors do not have any authorization/role.
There are two possible roles in the system:
1. ADMIN
2. USER
   
ADMIN cannot be created via `signup user API`. All users created using the APIs have `USER` role by default.

Once a user logs in sucessfully, session based authentication is used.  
<hr>

## Signup user
Used to sign up a new user.  

Auth required: NO  
Required role: NONE  

`POST` `/api/users`  

### Request Data
```json
{
    "email": "[valid email address]",
    "name": "[non empty name]",
    "password": "[password in plain text]"
}
```  

### Success Response
Status code: `200`  
```json
{
    "user_id": "[id]"
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

## Login user
Used to login a user.  
<br>

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
    "user_id": "[user id]",
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

## Logout user
Used to delete a session.  

Auth required: NONE  
Required role: NONE

`DELETE` `/api/sessions`

### Success Response
Status code: `204`  
<hr>

## Get details of logged in user
Gets the id, name and role of the logged in user. Can also be used to verify if the user is logged in.

Auth required: YES  
Required role: NONE

`POST` `/api/users/me`

### Success Response
Status code: `200`  
```json
{
    "id": "[user id]",
    "name": "[name]",
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
    "id": "[book id]",
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

## Get selected book
Gets all available details about the selected book along with review comments.  

Auth required: NO  
Required role: NONE  

**`GET`** *`/api/books/:bookId`*  

### Success Response
Status code: `200`  
```json
{
  "id": "[id]",
  "title": "[title]",
  "author": "[author]",
  "description": "[description]",
  "imageUrl": "[imageUrl]",
  "averageRating": "[averageRating]",
  "reviews": [
    {
      "id": "[review id]",
      "name": "[name of reviewer]",
      "message": "[review message]",
      "reviewedAt": "[timstamp of review]"
    },
    {
      ...
    }
  ],
  "myReviewId" : "[user's review id for this book]"
```
Conditions for `myReviewId`:  
   - *myReviewId*  key will not appear for non logged-in users.
   - *myReviewId* key will have an empty string for logged in users who haven't reviewed the book.
   - *myReviewId* key will have the reviewdId for those users who have reviewed the book.

<hr>

## Add book
*This is an ADMIN api.* Adds a new book to the collection for listing.

Auth required: YES  
Required role: ADMIN

`POST` `/api/books`

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
  "id": "[book id]"
}
```
<hr>
