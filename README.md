# Stuff Ranker

This app was made to help people rank stuff, especially songs by a given artist.

It lets users create a category they want to rank and then uses an iterative scoring algorithm based on a series of 1-on-1 matchups to determine the user's ranking of the items in the category.

If you indicate that a category is a list of songs and provide the artist who sang the songs (only one artist per category currently supported), the app will pull 30 second samples of each song from the Spotify to help users make their decisions.

# Running the app

There are two parts to running the app locally: the spring boot backend and the Angular frontend.

## The Backend

First, to use the backend application, you need to set up a postgres DB and connect it to the app. you can configure the connection to the database by editing fields in `src/main/resources/application.properties`. For example, the app is currently configured to look for a database called `ranker` on port 5432 as the user `rankeruser`. You should probably also set up a password for the user, which you can provide as a command line argument when you run the app so it's not saved in any config files.

I run the spring boot backend from Eclipse, but you can alo compile the Java app to a jar and execute it from the command line:

```
mvn package -DskipTests=true
```

That command will produce a jar file in the target folder called stuff-ranker-0.0.1-SNAPSHOT.jar

To run the jar, use this command with your DB password:

```
java -jar target/stuff-ranker-0.0.1-SNAPSHOT.jar --spring.datasource.password={your password}
```

It should start running on port 9001.

## The Frontend

To run the frontend app, simply go to the directory `src/main/resources/angular-ranker` and run this command

```
ng serve
```

The app will run on port 4200 and look for a backend connection on port 9001.
