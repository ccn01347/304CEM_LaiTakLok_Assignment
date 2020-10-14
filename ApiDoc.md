
# Response Structure

        status >> Status Code, 200 / 201 are success
        data >> Response data 
        error >> error message when occurred


# End-point


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


### /api/platformlogin

    POST
  - Body
  - Required:

        platform >> social platform supported. currently "facebook" only
        email
        userid
        fbToken
        name
        avatarURL



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



### /api/favoritelist

    PUT
    
  - Body
  - Required:

        userid
        url



### /api/favoritelist

    DELETE
    
  - Body
  - Required:

        userid
        url



### /api/publicstickers

    POST
    

### /api/memberverify

    GET
    
  - Params
  - Required:

        email >> URL encoded required



### /api/memberinfo

    POST
    
  - Body
  - Required:

        userid
        access_token



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


### /api/forgetpassword

    POST
    
  - Body
  - Required:

        email



### /api/uploadstickerjson

    POST
  - Body
  - Required:(form-data)

        userid
        access_token
        file


### /api/uploadprofilepic

    POST
  - Body
  - Required:(form-data)

        userid
        access_token
        profilepic


