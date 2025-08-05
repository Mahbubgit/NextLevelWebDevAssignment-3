# NextLevelWebDevAssignment-3

***********************************************************************************************
1. GitHub Repository Link: https://github.com/Mahbubgit/NextLevelWebDevAssignment-3
2. Live Deployment Link: next-level-web-dev-assignment-3-beryl.vercel.app
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

	a) Create Book API [POST /api/books]: To Create a Book, use POST API with the following sample data.

        {
        "title": "The Theory of Everything",
        "author": "Stephen Hawking",
        "genre": "SCIENCE",
        "isbn": "9780553380163",
        "description": "An overview of cosmology and black holes.",
        "copies": 5,
        "available": true
        }

	b) Get All Books API [GET /api/books]: To get all books, use this API. You can filtering data with sorting and limit. For filtering data you use genre as 'SCIENCE' or 'FANTASY', sort by 'asc' or 'desc' and limit to show number of results. The following requests are used to filter data.

        i) http://localhost:5000/api/books
        -- to show all data

        ii)http://localhost:5000/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
        --To show highest 5 numbers of data whose genre is FANTASY, sort by created time (when the data is inserted) and sort order is descending.

        iii)http://localhost:5000/api/books?filter=SCIENCE&sortBy=createdAt&sort=asc&limit=3
        --To show highest 3 numbers of data whose genre is SCIENCE, sort by created time (when the data is inserted) and sort order is ascending.

	c) Get Book by ID [GET /api/books/:bookId]: To get a particular book, use this API. You can retrieved a particular book information by filtering with bookId. You can use the following request:

        => http://localhost:5000/api/books/688cf41def0d1858c73bc2ab
    Here, 688cf41def0d1858c73bc2ab is a bookId.

	d) Update a Book by ID [PUT or PATCH /api/books/:bookId]: To update a particular book, you have to use this API. You can update only the copies value by this API with bookId. You can use the following request:

        => http://localhost:5000/api/books/688e4d03f404f0daf55dbe00
    Here, 688cf41def0d1858c73bc2ab is a bookId and the input value will be raw JSON mode like:
        {
        "copies": 55
        }

	e) Delete a Book by ID [DELETE /api/books/:bookId]: To delete a particular book, you have to use this API. You can delete a book by this API with bookId. You can use the following request:

        => http://localhost:5000/api/books/688e4d03f404f0daf55dbe00
    Here, 688cf41def0d1858c73bc2ab is a bookId that to be deleted.

# 📂 9. Update borrow.interface.ts, borrow.model.ts and borrow.controller.ts files as requirement of assignment.

	a) Borrow a Book [POST /api/borrow]: To Create a Borrow information, use this API. The following JSON data can be used as request:

        {
        "book": "64ab3f9e2a4b5c6d7e8f9012",
        "quantity": 2,
        "dueDate": "2025-07-18T00:00:00.000Z"
        }

Some business logics are involved when create a borrow information into borrows collection. They are as follows:

	i) Verify the book has enough available copies.
	ii) Deduct the requested quantity from the book’s copies.
	iii) If copies become 0, update available to false (implement this using a static method).
	iv) Save the borrow record with all relevant details.

	b) Borrowed Books Summary Using Aggregation [GET /api/borrow]: To return a summary of borrowed books, including
    Total borrowed quantity per book (totalQuantity) and Book details with title and isbn, use this API.

# 📂 10. Check all API's using Postman.
# 📂 11. Then deploy the Assignment into Vercel website.
# 📂 12. Get Live Deployment Link from vercel.
# 📂 13. Check all API's using Live Deployment Link into incognito mode.