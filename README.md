# Full Stack JavaScript Techdegree v2 - REST API Project

This project was developed with REST API design, Node.js, Express to create API routes, the Sequelize ORM for data modeling, validation, and persistence and Postman for testing. With this API, authenticated users will be able to administer a school database containing information about courses: authorized users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database.



## Getting Started

 To get up and running with this project, run the following commands from the root of the folder that contains this README file.

 First, install the project's dependencies using `npm`.

 ```
 npm install

 ```

 Second, seed the SQLite database. The `seed` folder contains a starting set of data for the database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create the app's database and populate it with data

 ```
 npm run seed

 ```

 And lastly, start the application.

 ```
 npm start

 ```

 To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/). The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore the REST API.
