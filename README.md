# 304CEM_LaiTakLok_Assignment
[304CEM] Web API Development Assignment(Lai Tak Lok 197370857)

# Getting Start
## Prerequisition
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


## 1. Install Back-end & front-end
After you download the project, first redirect to repostory.

    cd 304CEM_LaiTakLok_Assignment
    npm install

    cd front-end
    npm install


## 2. Start server
    cd ../
    npm run watch

## 3. Start front-end
Open new tab of your command-promte
    
    cd front-end
    npm run server

# Config
By default, the server is running with port 4000 and the front-end with 8080. i.e.:

- Server url:
  - http://localhost:4000
- Front-end url:
  - http://localhost:8080/main
  
# Database Structure
- Name: 304CEM_LTL
  - member_signup
  - member_favourite
  - member_upload
  - server_general
  
# API Documentation
  https://documenter.getpostman.com/view/13093604/TVRoY6u6
  
# Features:
  https://youtu.be/kqvQjFTbwNg
1. Website
2. Signup + Password verification
3. SendGrid Email Services Integration + Email Verification
4. Login Sessions, Cookies and Access token
5. Cloudinary Api Integration
6. Search
7. Add favorite List
8. Read Favorite List + Pagination
9. Remove Item in Favorite List
10. Download file
11. Upload + Cloudinary Integration + Json format verification
12. 24hours update / Force fetching cloudinary
13. Read Member profile
14. Edit Member Profile
15. Upload Profile Image + Size limitation
16. Change Password
17. Logout clear sessions.
18. Forget password
19. Facebook Login
20. NodeJS + ExpreeJS + MongoDB
21. VueJS + bootstrap, Desktop & Mobile

