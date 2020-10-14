
- Response Structure


        status >> Status Code, 200 / 201 are success
        data >> Response data 
        error >> error message when occurred




- End Point
### /api/signup ###

    POST
    
  - Body
  - Required:

        username
        email
        pwd



- End Point
### /api/login ###

    POST
    
  - Body
  - Required:

        email
        pwd

- End Point
### /api/platformlogin

    POST
  - Body
  - Required:

        platform >> socail platform supported. currently "facebook" only
        email
        userid
        fbToken
        name
        avatarURL


- End Point
### /api/favoritelist

    POST
    
  - Body
  - Required:

        userid
        page
        limit


- End Point
### /api/isinfavoritelist

    GET
    
  - Params
  - Required:

        url
        userid
        access_token


- End Point
### /api/favoritelist

    PUT
    
  - Body
  - Required:

        userid
        url


- End Point
### /api/favoritelist

    DELETE
    
  - Body
  - Required:

        userid
        url


- End Point
### /api/publicstickers

    POST
    
- End Point
### /api/memberverify

    GET
    
  - Params
  - Required:

        email >> URL encoded required


- End Point
### /api/memberinfo

    POST
    
  - Body
  - Required:

        userid
        access_token


- End Point
### /api/membereditinfo

    POST
    
  - Body
  - Required:

        userid
        access_token
    
  - Optional:

        tousername
        toavatarURL
        toaboutme
        topwd

- End Point
### /api/forgetpassword

    POST
    
  - Body
  - Required:

        email


- End Point
### /api/uploadstickerjson

    POST
  - Body
  - Required:(form-data)

        userid
        access_token
        file

- End Point
### /api/uploadprofilepic

    POST
  - Body
  - Required:(form-data)

        userid
        access_token
        profilepic


