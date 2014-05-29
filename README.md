node-mongoose-jumpstart
=======================

# Mongoose Jumpstart
Automates routing and property rendering for Mongo Databases.

## Dependencies
- A MongoDB Instance to hook into
- express and many of its sub modules
- mongoose
- dot
- cheerio
- an html encoder (currently node-html-encoder)


## Project Goals
1. Reduce Development Time for database oriented websites
> Routing and Input/View UI amounts for much of the part for programming. However, If we already know our data objects, these two parts can write themselves.
2. Keep the System at a Low Learning Curve for New Developers
> As The Webworld and programming in general evolves, the starter programmer needs to learn much more to enter the field. This Framework isn't to add to that, nor reduce. But rather allow what they've learned to be used.
3. Customizable
> Most Websites involve more than just Models. As a result, making sure people can apply it to their needs is important.
4. Use By Peices
> Instead of using routing, and everythign else, you may only use ui peices. Or Only routing.
5. Balance reducing Dependency amount with using the best NPM has to offer
> Many NPM modules become bloated by the dependencies on other modules. This isn't meant to be a 10 mb file, but rather a small one.

## Current Condition
The Current Condition of this project is untested. I took a lot of my
coffeescript and blade.ui code and rewrote it in javascript and doT. That being
said, there

## Next Steps
Make sure everything is working properly

## Working API
nothing

## RoadMap
1. Create The Base Framework
- Base Route and action: Create, List view, Single view, Path View, Update, Delete
- Path Based UI: Boolean, Number, String, Date, ObjectID, Buffer, Array, Nested
- Special cases for Buffers
- Class and Instance Methods Support
- Support for Custom Mongoose SchemaTypes
- WSS support
- JSON API Support
2. Create user System
- CSRF Protection
- IP Address Protection
- SSL Support
- Session Based Users, Cookie+IP detection
- Passport Integration
- Local Authentication System
- Connect Flash to display errors/events to users
3. Make sure the routing system can be used in a variety of frameworks
- Routing: independent, express, hapi, etc
- UI: doT, jade, XSLT, etc
4. Tour Support
-Tour Init
-Prevent user from navigating outside tour
-Finishing/Exiting Tour
5. Scalability Testing
- Cluster support
- user to database restriction until database synchronization finishes
