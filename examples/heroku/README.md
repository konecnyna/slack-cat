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
    "ssl": true
  }
}
```
