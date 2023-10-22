## Endpoints

List of Available Endpoints:
- `POST /movies`
- `GET /movies`
- `GET /movies/:id`
- `DELETE /movies/:id`
- `GET /genres`
- `POST /register`
- `POST /login`
- `POST /google-login`
- `PUT /movies/:id`
- `PATCH /movies/:id`
- `GET /users`
- `POST /pub/register`
- `POST /pub/login`
- `POST /pub/google-login`
- `GET /pub/movies`
- `GET /pub/movies/:id`
- `GET /pub/genres`
- `POST /pub/qr-code`
- `GET /pub/favorites`
- `POST /pub/favorites`

## POST /movies
### Description
- Create a new movie

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- Body
    ```json
    {
      "title": String, // (validation: required)
      "synopsis": String, // (validation: required)
      "trailerUrl": String,
      "imgUrl": String,
      "rating": Integer, // (validation: min rating 1)
      "genreId": Integer,
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

## GET /movies
### Description
- Get all movies from database

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
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

## GET /movies/:id
### Description
- Get movie detail from database

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
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

### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
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
_403 - Forbidden_
- Body
    ```json
    {
      "statusCode": 403,
      "data": {
        "message": "Forbidden"
      },
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

### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
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

## POST /register
### Description
- Create a new user (role: 'admin')

#### Request
- Body
    ```json
    {
      "username": String,
      "email": String, // (unique constraint)
      "password": String, // (validation: required)
      "phoneNumber": String,
      "address": String
    }
    ```
### Response
_201 - Created_
- Body
    ```json
    {
      "statusCode": 201,
      "data": {
        "id": Integer,
        "email": String,
      },
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
      "statusCode": 400,
      "data": {
        "message": "Email already taken"
      },
    }
    ```

## POST /login
### Description
- Login into apps (admin)

#### Request
- Body
    ```json
    {
      "email": String, // (validation: required)
      "password": String, // (validation: required)
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "access_token": String
      },
    }
    ```
_401 - Unauthorized_
- Body
    ```json
    {
      "statusCode": 401,
      "data": {
        "error": "invalid username or email or password"
      },
    }
    ```

## POST /google-login
### Description
- Login or register (first-login) with google (role: staff)

#### Request
- Headers
    ```json
    {
      "google_token": String,
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "access_token": String
      },
    }
    ```

_201 - Created_
- Body
    ```json
    {
      "statusCode": 201,
      "data": {
        "access_token": String
      },
    }
    ```

## PUT /movies/:id
### Description
- Update movie details

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- Body
    ```json
    {
      "title": String, // (validation: required)
      "synopsis": String, // (validation: required)
      "trailerUrl": String,
      "imgUrl": String,
      "rating": Integer, // (validation: min rating 1)
      "genreId": Integer,
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "message": "Movie with id ${id} updated"
      },
    }
    ```
_403 - Forbidden_
- Body
    ```json
    {
      "statusCode": 403,
      "data": {
        "message": "Forbidden"
      },
    }
    ```
_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "data": {
        "message": "error not found"
      },
    }
    ```

## PATCH /movies/:id
### Description
- Update movie status

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- Body
    ```json
    {
      "status": String,
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "message": "Movie with id ${id} set to Active Inactive || Archived"
      },
    }
    ```
_403 - Forbidden_
- Body
    ```json
    {
      "statusCode": 403,
      "data": {
        "message": "Forbidden"
      },
    }
    ```
_404 - Not Found_
- Body
    ```json
    {
      "statusCode": 404,
      "data": {
        "message": "error not found"
      },
    }
    ```

## GET /users
### Description
- Get users detail

#### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```
- User
    ```json
    {
      "id": Integer,
    }
    ```
#### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
          "id": Integer,
          "username": String,
          "email": String,
          "password": String,
          "role": String,
          "phoneNumber": String,
          "address": String,
          "createdAt": Date,
          "updatedAt": Date
      },
    }
    ```

## POST /pub/register
### Description
- Register into public interface of movie apps

#### Request
- Body
    ```json
    {
      "username": String,
      "email": String, // (unique constraint)
      "password": String, // (validation: required)
      "phoneNumber": String,
      "address": String
    }
    ```
### Response
_201 - Created_
- Body
    ```json
    {
      "statusCode": 201,
      "data": {
        "id": Integer,
        "email": String,
      },
    }
    ```
_400 - Bad Request_
- Body
    ```json
    {
      "statusCode": 400,
      "data": {
        "message": "Email already taken"
      }
      OR
      {
        "message": "Email is required"
      }
      OR
      {
        "message": "Password is required"
      }
      OR
      {
        "message": "Minimal length of password is 5"
      },
    }
    ```

## POST /pub/login
### Description
- Login into apps via public interface

#### Request
- Body
    ```json
    {
      "email": String, // (validation: required)
      "password": String, // (validation: required)
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "access_token": String
      },
    }
    ```
_401 - Unauthorized_
- Body
    ```json
    {
      "statusCode": 401,
      "data": {
        "error": "invalid username or email or password"
      },
    }
    ```

## POST /pub/google-login
### Description
- Login or register with google in public interface

#### Request
- Headers
    ```json
    {
      "google_token": String,
    }
    ```
### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": {
        "access_token": String
      },
    }
    ```

_201 - Created_
- Body
    ```json
    {
      "statusCode": 201,
      "data": {
        "access_token": String
      },
    }
    ```

## GET /pub/movies
### Description
- Get all active movies from database with filter and pagination without authentication

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

## GET /pub/movies/:id
### Description
- Get movie detail from database without authentication

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

## GET /pub/genres
### Description
- Get all genres from database without authentication

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

## POST /pub/qr-code
### Description
- Generate a QR Code svg for detail movie page

### Request
- Body
  ```json
  {
    "url": String
  }
  ```

### Response
_200 - OK_
- Body
    ```json
    {
      "newFavorite": {
        "id": Integer,
        "CustomerId": Integer,
        "MovieId": Integer,
        "createdAt": Date,
        "updatedAt": Date
      },
      "isCreated": false
    }
    ```

_201 - Created_
- Body
    ```json
    {
      "newFavorite": {
        "id": Integer,
        "CustomerId": Integer,
        "MovieId": Integer,
        "createdAt": Date,
        "updatedAt": Date
      },
      "isCreated": true
    }
    ```

_404 - Not Found_
- Body
    ```json
    {
      "message": "error not found"
    }
    ```

## GET /pub/favorites
### Description
- Get all favorite movies by customer id

### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```

### Response
_200 - OK_
- Body
    ```json
    {
      "statusCode": 200,
      "data": [
        {
        "id": Integer,
        "CustomerId": Integer,
        "MovieId": Integer,
        "createdAt": String,
        "updatedAt": String,
        "Movie": {
            "id": Integer,
            "title": String,
            "synopsis": String,
            "trailerUrl": String,
            "imgUrl": String,
            "rating": Integer,
            "genreId": Integer,
            "authorId": Integer,
            "status": String,
            "createdAt": String,
            "updatedAt": String,
            "Genre": {
                "id": Number,
                "name": String,
                "createdAt": String,
                "updatedAt": String
            }
        }
    }
      ],
    }
    ```

## POST /pub/favorites
### Description
- Create a new favorite movies

### Request
- Headers
    ```json
    {
      "access_token": String
    }
    ```

## Global Error
#### Response
_401 - Unauthorized_
- Body
    ```json
    {
      "message": "Invalid Token"
    }
    ```
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

**deployed links**: 
- server: _https://movie-server.huseinhk.me_
- client-v1: _https://movie-app-client-31577.web.app_
- client-v2: _https://movie-client-v2.web.app_
- client-v3: _https://movie-client-v3.web.app_
