# Design Documentation

## MongoDB Schema

> ### **FictionHunter**

> ### **Book**
>
> book_id (indexed)  
> title  
> author  
> description  
> thumbnail_url  
> ratingCount  
> ratingValue

> ### **User**
>
> user_id (indexed)  
> password

> ### **Rating**
>
> book_id (indexed)  
> user_id (indexed)  
> rating

> ### **Review**
>
> book_id (indexed)  
> user_id (indexed)
> message

<br><hr><br>
