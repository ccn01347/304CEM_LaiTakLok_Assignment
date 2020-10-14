# 304CEM_LaiTakLok_Assignment
[304CEM] Web API Development Assignment(Lai Tak Lok 197370857)

# Prerequisition
- Cloudinary API
  - App Name
  - API Key
  - API Secret
- SendGrid API
  - API Key
  - Registered Email as Sender
  - Email Template Id
  
The project use dotenv to centralize the private constant. You should have your own ```.env``` file in the root folder(``` 304CEM_LaiTakLok_Assignment ```).
- Example .env file
```
CLOUDINARY_NAME='xxxxxx'
CLOUDINARY_APIKEY='xxxxxx'
CLOUDINARY_APISECRET='xxxxx'
SENDGRID_APIKEY='xxxxxxx'
SENDGRID_EMAILSENDER='xxxxx'
SENDGRID_VERIFICATIONTEMPLATE_ID='xxxxx'
```


# 1 Install Back-end & front-end
After you download the project, first redirect to repostory.

    cd 304CEM_LaiTakLok_Assignment
    npm install

    cd front-end
    npm install


# 2. Start server
    cd ../
    npm run watch

# 3. Start front-end
Open new tab of your command-promte
    
    cd front-end
    npm run server

# Config
By default, the server is running with port 4000 and the front-end with 8080. i.e.:

- Server url:
  - http://localhost:4000
- Front-end url:
  - http://localhost:8080/main
  
# API Documentation
  https://documenter.getpostman.com/view/13093604/TVRoY6u6

