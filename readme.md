## Endpoints

List of Available Endpoints:
- `POST /movies`

### POST /movies
#### Description
- Create a movie

#### Response
_201 - Created_

- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
          "id": Integer,
          "title": String,
          "synopsis": String,
          "trailerUrl": String,
          "imgUrl": String,
          "rating": Integer,
          "genreId": Integer,
          "authorId": Integer,
          "updatedAt": Date,
          "createdAt": Date
        },
        ...
      ]
    }
    ```

_400 - Bad Request_
- Body
    ```json
    {
      "statusCode": 400,
      "error": {
        "message": [String, ...]
      }
    }
    ```

### Global Error
#### Response
_500 - Internal Server Error_
- Body
    ```json
    {
      "statusCode": 500,
      "error": {
        "message": "Internal Server Error"
      }
    }
    ```