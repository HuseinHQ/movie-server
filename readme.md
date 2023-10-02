## Endpoints

List of Available Endpoints:
- `POST /movies`
- `GET /movies`
- `GET /movies/:id`

### POST /movies
#### Description
- Create a new movie

#### Request
- Body
    ```json
    {
      "title": String, // (validation: required)
      "synopsis": String, // (validation: required)
      "trailerUrl": String,
      "imgUrl": String,
      "rating": Integer, // (validation: min rating 1)
      "genreId": Integer,
      "authorId": Integer,
    }
    ```
#### Response
_201 - Created_

- Body
    ```json
    {
      "statusCode": 201,
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

### GET /movies
#### Description
- Get all movies from database

#### Response
_200 - OK_

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
          "createdAt": Date,
          "updatedAt": Date
        },
        ...
      ]
    }
    ```

### GET /movies/:id
#### Description
- Get movie detail from database

#### Response
_200 - OK_

- Body
    ```json
    {
      "statusCode": 200,
      "data": {
          "id": Integer,
          "title": String,
          "synopsis": String,
          "trailerUrl": String,
          "imgUrl": String,
          "rating": Integer,
          "genreId": Integer,
          "authorId": Integer,
          "createdAt": Date,
          "updatedAt": Date
        },
    }
    ```
_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "error": {
        "message": "error not found"
      }
    }
    ```

## DELETE /movies/:id
### Description
- Delete one movie by id from database

### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "message": "Movies success to delete"
      }
    }
    ```

_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "data": {
        "message": "error not found"
      }
    }
    ```

## GET /genres
### Description
- Get all genres from database

### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
            "id": Integer,
            "name": String,
            "createdAt": Date,
            "updatedAt": Date
        },
        ...
      ]
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