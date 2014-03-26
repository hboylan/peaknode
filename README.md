# Peak Home Automation API


- - - 

## Description

[NodeJS](http://nodejs.org) - API Server
[ExpressJS](http://expressjs.com/api.html) - API Middleware
[SequelizeJS](http://sequelizejs.com/docs/latest/installation) - PostgreSQL, MySQL, MariaDB, SQLite Middleware.

## File structure

* **/app.js:** Load and serve API resources

* **/config.json:** Configuration info for port, DB, session, static models, etc.

* **/routes.js:** API endpoints

* **/controllers:** API endpoint handlers

* **/models:** SequelizeJS models

* **/lib:** NodeJS helper classes

  * **/lib/database.js:** Setup SequelizeJS models, relationships, and triggers

  * **/lib/fitbit.js:** Fitbit OAuth helper

  * **/lib/omnilink.js:** TCP connection to Java server

  * **/lib/xbmc.js:** XBMC connection/command helper

- - - 

## Routes

__* - Requires sessionID__

### [User](#user-routes)
 Method        | Endpoint                  | Action 
-------------  | ------------------------- | -----------------------------------------
`POST`         | /user                     | [Create User](#create-user)
`POST`         | /login                    | [Login User](#login-user)
`POST`         | /logout                   | *[Logout User](#logout-user)
`POST`         | /auth                     | *[Check Auth](#check-auth)
`GET`          | /users                    | [List Users](#list-users)
`GET`          | /user/:uid                | [Show User](#show-user)

### [Appliance](#appliance-routes)
 Method        | Endpoint                  | Action 
-------------  | ------------------------- | -----------------------------------------
`GET`          | /appliances               | [List Appliances](#list-appliances)
`POST`         | /appliance/:id            | *[Switch Appliance](#switch-appliance)

### [Audio](#audio-routes)
 Method        | Endpoint                  | Action 
-------------  | ------------------------- | -----------------------------------------
`GET`          | /appliances               | [List Audio Zones](#list-audio-zones)
`GET`          | /appliance/:id            | [Show Audo Zone](#show-audio-zone)
`POST`         | /appliance/:id            | *[Set Audio Zone](#set-audio-zone)

### [Security](#security-routes)
 Method        | Endpoint                  | Action 
-------------  | ------------------------- | -----------------------------------------
`GET`          | /security                 | [Security Status](#security-status)
`GET`          | /security/:id             | [](#)
`POST`         | /security/:id             | *[Set Audio Zone](#set-audio-zone)
- - -

<a name="user-routes">
### User Routes

<a name="create-user">
#### Create User

- @body username
- @body password
- @body realname
- @body pinkey   (4 digits)


<a name="login-user">
#### Login User

- @body username  
- @body password


<a name="logout-user">
#### Logout User


<a name="check-auth">
#### Check Auth


<a name="list-users">
#### List Users


<a name="show-user">
#### Show User

- @param uid

- - -

<a name="appliance-routes">
### Appliance Routes

<a name="list-appliances">
#### List Appliances


<a name="switch-appliance">
#### Switch Appliance

- @body state (on|off)
- @body node  (left|right)

- - -

<a name="audio-routes">
### Audio Routes

<a name="list-audio-zones">
#### List Audio Zones


<a name="show-audio-zone">
#### Show Audio Zone


