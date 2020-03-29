# Heroku Setup


### DB

https://elements.heroku.com/addons/heroku-postgresql

Adding to the config:

```
{
...
   "db": {
    "host": "****.amazonaws.com",
    "port": "5432",
    "dbName": "*******************",
    "username": "*******************",
    "password": "*******************",
    "dialect": "postgres",
    "dialectOptions": {
      ssl: true
    }
  }
}
```

These are the database credentials from your newly crated heroku db

https://data.heroku.com/datastores/XXX-XXX-XXXX#administration
