# knowledgeGraphUPB

###### App uses the following:
i) Node Js Express - For creating api end points
ii) React JS - For creating frontend
iii) Cytoscape - For displaying graphs.

#### Setting Up the Enviroment:

[x] Make Sure You Have Neo4j Installed.

[x] Import the file "database.dump" in your Neo4j DBMS with the following command:
```
".\bin\neo4j-admin load --from=your-file-location\database.dump --database=neo4j --force"
```

[x] Start the Noe4j Server before running the app


#### Steps to run the app:
1. Run ```npm install``` in the root folder and client/ folder. This will install the dependencies for express app and react front end app.
2. Alternatively, user can also run ```npm run install-app``` from the root folder. This will install dependencies for both root folder and client folder.
3. Update the database config in .env file
4. Run ```npm start``` in root folder to start express api and client projects.
