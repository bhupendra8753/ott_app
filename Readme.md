Documentation of the Ott app:

1. App setup:
    To initiate the project in express nodejs run the command "npm init -y". It creates the package.json file.
    Install express typescript and other dependencies required by command "npm install <packageName>"
    To run project in typescript we have create tsconfig.json file by running command "npx tsc --init".
    In order to run the app we have to make few changes in tsconfig.json like we have give the rootDir, outDir. rootDir is loaction of our src folder where are our ts files are present and outDir is the location of the dist folder.

    To run the server execute two commands or you can paste it to the script tag in package.json file.
        npx tsc
        node dist/server.js
    
    To run Test cases we have to install jest, supertest. Create a file jest.config.js and give preset and env for testing.

    Run npx jest to run test cases. I have included it script tag of package.json so you can also run "npm run test"
    
2. Start MongoDB
    a.) Ensure that Mongodb is running on "mongodb://127.0.0.1:27017/ott-app" connection string in server.ts

3. API Documentation
    1. List all movies:
        a.) Enpoint : GET "/movies"
        b.) Sample response: 
            [
                {
                    "_id": "65572eb4ff5fdfd1f08f07ce",
                    "title": "Hasley",
                    "genre": "Comedy",
                    "rating": 4,
                    "streamingLink": "http://hasley.com",
                    "__v": 0
                },
                {
                    "_id": "65572ed3ff5fdfd1f08f07d0",
                    "title": "Rockstar",
                    "genre": "Comedy",
                    "rating": 4.5,
                    "streamingLink": "http://roackstar.com",
                    "__v": 0
                }
            ]
    
    2. Search for a movie:
        a.) Enpoint : GET "/search?q={query}"
        b.) Sample Request : GET "/search?q=Hasley"
        c.) Sample response : 
            [
                {
                    "_id": "65572eb4ff5fdfd1f08f07ce",
                    "title": "Hasley",
                    "genre": "Comedy",
                    "rating": 4,
                    "streamingLink": "http://hasley.com",
                    "__v": 0
                }
            ]

    3. Add a new Movie:
        a.) Endpoint: POST "/movies"
        b.) sample Request:
            {
                "title" : "new movie",
                "genre" : "Comdey",
                "rating" : 4.0,
                "streamingLink" : "http://movieLink.com"
            }

        c.) Response :
        [
            {
                "_id": "65572eb4ff5fdfd1f08f07cg",
                "title": "new movie",
                "genre": "Comedy",
                "rating": 4.0,
                "streamingLink": "http://movieLink.com",
                "__v": 0
            }
        ]

    4. Upadte a movie:
        a.) Enpoint: PUT "/movies/:id"
        b.) Sample Request:
            {
                "title" : "Updated movie",
                "genre" : "Comdey",
                "rating" : 4.0,
                "streamingLink" : "http://movieLink.com"
            }

        c.) Response :
                [
                    {
                        "_id": "65572eb4ff5fdfd1f08f07cg",
                        "title": "Updated movie",
                        "genre": "Comedy",
                        "rating": 4.0,
                        "streamingLink": "http://movieLink.com",
                        "__v": 0
                    }
                ]

    5. Delete a movie:
        a.) Enpoint : DELETE "/movies/:id"
        b.) Sample Request : DELETE "/movies/65572eb4ff5fdfd1f08f07cg"
        c.) Sample Response : 
            {
                "message" : "Movie Deleted Successfully!!"
            }