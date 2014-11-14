# Mongoose Jumpstart

I'm going to be splitting up this project into two as a result, this has little to no value until I've set that up

- - -

# Mongoose Jumpstart
Automates routing and property rendering for Mongo Databases.

## Dependencies
- A MongoDB Instance to hook into
- NPM
- Bower

## To Test
Install Node - http://nodejs.org/
Install Mongodb - http://www.mongodb.org/downloads
```
$ git clone
```
Edit the config.json appropiately
> the most important part here is the port numbers for local use

```
$ npm install
$ bower install
$ mongod --dbpath your_db_path --port your_db_port_number
$ node run
```


## Project Goals
### 1) Reduce Development Time for database oriented websites
> Routing and Input/View UI amounts for much of the part for programming. However, If we already know our data objects, these two parts can write themselves.

### 2) Keep the System at a Low Learning Curve for New Developers
> As The Webworld and programming in general evolves, the starter programmer needs to learn much more to enter the field. This Framework isn't to add to that, nor reduce. But rather allow what they've learned to be used.

### 3) Customizable
> Most Websites involve more than just Models (Example: User Visibility and ClientSide Apps). As a result, making sure people can apply it to their needs is important.

### 4) Use By Peices
> Use Out of the Box or use individual aspects

### 5) Balance reducing Dependency amount with using the best NPM has to offer
> Many NPM modules become bloated by the dependencies on other modules. This isn't meant to be a 10 mb file, but rather a small one.

## Current Condition
- Startup Compiles and Runs fine
- Index Compiles and Runs Fine
- Model Indexes Compile and Run Fine
- Instance Views Compile and Run fine
- Video, Sound and Images have their own Schema types

## Next Steps
- Work on Maps SchemaType
- Work On "Consolidation" for Lists (When Displaying Multiple of the )

> When multiple that involve a third party UI, they are consolidated into the way that third party UI handles lists

- Work on input Pages

## Finished Steps
- Tranfered most of my code from coffeescript and blade to javascript and dot
- Implemented Cluster
- Make Sure Viewing Works Properly
- support for Custom Mongoose SchemaTypes

## Working API
nothing

## New RoadMap: Created 6/21/2014
1) Routing
- Seperated into Class, Instance and Subpath Methods
- Standard Class methods: Create, Query
- Standard Instance methods: View, Update, Delete
- Standard Subpath methods: View, Update
- Allow Custom Methods for Class, Instance and Subpath
- Allow Request to specify expected return type: .html, .xml, .json, .jpg, .png, etc
- SSL Support

2) UI
- PrePackage: HTML and CSS Base, JSON, XML
- Seperated into

| Layout | Site Indexes | Instance     | SchemaType | Side Bar            |
|--------|--------------|--------------|------------|---------------------|
| HTML   | THE Index    | List         | Full View  | Method Forms        |
| JSON   | Model Indexes| Single       | Preview    | Widget              |
| XML    | 404          | Schema Based | Input      | Schema Consolidate  |
|        | 403          |              | Direct View|                     |
|        | 500          |              |            |                     |
|        |              |              |            |                     |
- Allow Overriding of any of Automated UIs while allowing the other automated uis to be available
- Make sure everything is peach clean for Web Crawlers

3) Plugin
- Allowed to specify their own routing
- Allowed to be mixed with a model
- Emit Common Events: User Allowed,
- They may specify the order the Plugin should respond
- Make Event Oriented (They require the event they want to listen to)

4) WebSocket
- Clones the HTTP Routes System
- Emits seperate events

5) Installation
- Throws an error if a SchemaType doesn't specify in "instance"
- Override the Mixed and Boolean SchemaType
- Installed if an npm module is a plugin for this system, it needs to be able to be installed easily

6) Out Of the Box
- User System
- Tour Support

7) Scalability Testing
- Cluster support
- user to database restriction until database synchronization finishes


## Old RoadMap
### 1) Create The Base Framework
- Base Route and action: Create, List view, Single view, Path View, Update, Delete
- Path Based UI: Boolean, Number, String, Date, ObjectID, Buffer, Array, Nested
- Special cases for: Buffers and Mixed
- Class and Instance Methods Support
- Support for Custom Mongoose SchemaTypes
- WSS support
- JSON API Support

### 2) Create user System
- CSRF Protection
- IP Address Protection
- SSL Support
- Session Based Users, Cookie+IP detection
- Passport Integration
- Local Authentication System
- Connect Flash to display errors/events to users

### 3) Make sure the routing system can be used in a variety of frameworks
- Routing: independent, express, hapi, etc
- UI: doT, jade, XSLT, etc

### 4) Tour Support
- Tour Init
- Prevent user from navigating outside tour
- Finishing/Exiting Tour

### 5) Scalability Testing
- ~~Cluster support~~
- user to database restriction until database synchronization finishes
