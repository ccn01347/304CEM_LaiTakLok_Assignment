
# Response Structure

        status >> Status Code, 200 / 201 are success
        data >> Response data 
        error >> error message when occurred


# End-point


### ```POST```/api/signup
  - Body
  - Required:

        username
        email
        pwd



### ```POST``` /api/login    
  - Body
  - Required:

        email
        pwd


### ```POST``` /api/platformlogin
  - Body
  - Required:

        platform >> social platform supported. currently "facebook" only
        email
        userid
        fbToken
        name
        avatarURL



### ```POST``` /api/favoritelist
    
  - Body
  - Required:

        userid
        page
        limit


### ```GET``` /api/isinfavoritelist
  - Params
  - Required:

        url
        userid
        access_token



### ```PUT``` /api/favoritelist 
  - Body
  - Required:

        userid
        url



### ```DELETE``` /api/favoritelist 
  - Body
  - Required:

        userid
        url



### ```POST``` /api/publicstickers
    

### ```GET``` /api/memberverify
  - Params
  - Required:

        email >> URL encoded required



### ```POST``` /api/memberinfo
  - Body
  - Required:

        userid
        access_token



### ```POST``` /api/membereditinfo
  - Body
  - Required:

        userid
        access_token
    
  - Optional:

        tousername
        toavatarURL
        toaboutme
        topwd


### ```POST``` /api/forgetpassword
  - Body
  - Required:

        email



### ```POST``` /api/uploadstickerjson
  - Body
  - Required:(form-data)

        userid
        access_token
        file


### ```POST``` /api/uploadprofilepic
  - Body
  - Required:(form-data)

        userid
        access_token
        profilepic


