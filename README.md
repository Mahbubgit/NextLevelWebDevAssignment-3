# NextLevelWebDevAssignment-3

***********************************************************************************************
1. GitHub Repository Link: https://github.com/Mahbubgit/NextLevelWebDevAssignment-3
2. Live Deployment Link: next-level-web-development-assignme.vercel.app
3. Video Explanation: 
***********************************************************************************************
# Features of this application and procedures to setup the project locally.

# 📂 1.Initialize project

  a) Create a new repository into github for Assignment-3

    =>echo "# NextLevelWebDevAssignment-3" >> README.md
    =>git init
    =>git add README.md
    =>git commit -m "empty"
    =>git branch -M main
    =>git remote add origin 
    =>git push -u origin main

 b) Create package.json file

    =>npm init -y

# 📂 2.Install dependencies

    =>npm i -D typescript
    =>npm i express
    =>npm i -g typescript
    =>tsc --init
    =>npm i express mongoose
    =>npm i --save-dev @types/express
    =>npm i ts-node-dev
    =>npm i zod
    =>npm i dotenv

=>update "scripts" section in package.json file adding the following

    "dev" : "ts-node-dev --respawn --transpile-only src/server.ts",

# 📂 3. Initialize TypeScript

    =>npx tsc --init

# 📂 4. Update tsconfig.json file

    "outDir": "./dist/",
    "rootDir": "./src/",

# 📂 5. Create Folders and files for project structure as below

    /dist
    /src
        /app
            /controllers
                book.controller.ts
                borrow.controller.ts
            /interfaces
                book.interface.ts
                borrow.interface.ts
            /models
                book.model.ts
                borrow.model.ts
        app.ts
        server.ts
    .gitignore
    .env
    .vercel.json

=>Update .gitignore file as below

    node_modules
    .vercel
    .env

=>Update .env file as below

    NODE_ENV=development
    PORT=5000
    DB_USER=********
    DB_PASS=********

=>Update .vercel.json file as below [During Deployment into Vercel]

    {
        "version": 2,
        "builds": [
            {
                "src": "dist/server.js",
                "use": "@vercel/node"
            }
        ],
        "routes": [
            {
                "src": "/(.*)",
                "dest": "dist/server.js"
            }
        ]
    }

# 📂 6. Create a new Database into MongoDB Atlas and name it as: 'library-management-app'

Connecting String Like:

    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.izigbyf.mongodb.net/library-management-app?retryWrites=true&w=majority&appName=Cluster0`;

# 📂 7. Update app.ts and server.ts files as required.
# 📂 8. Update book.interface.ts, book.model.ts and book.controller.ts files as requirement of assignment.
# 📂 9. Update borrow.interface.ts, borrow.model.ts and borrow.controller.ts files as requirement of assignment.
# 📂 10. Check all API's using Postman.
# 📂 11. Install Vercel and Deploy the Assignment into vercel website.
# 📂 12. Get Live Deployment Link from vercel.
# 📂 13. Check all API's using Live Deployment Link into incognito mode whether they works properly or not.
