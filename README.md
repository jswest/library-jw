# Library JW #
## A modest library app for personal use. ##
### Version 0.1.0 ###

### What is it? ###
A modest library app—meaning it contains only the most basic of systems for tagging books—for my personal library.

### How is it? ###
JavaScript through and through: Node.js on the back-end and Backbone.js on the front. Modern browsers only. It runs on p5000. You'll also need to run mongodb.

To make this work your machine:
	(1) Install Git, Node.js, and Mongodb (if you're on a mac, the best way to do this is with Homebrew—which requires Apple developer's command line tools and not—fortunately, all of XCode.) If any of this is confusing sounding, then you probably want someone to help, preferably someone who knows her way around the command-line (knowledge you'll need in steps 2 through 5)
	(2) Run `git clone` to get this project (get it?)
	(3) Run `npm install`
	(4) Run `mongod`
	(5) Now `cd` into the library-jw folder and run `node server.js`
	(6) Great: navigate to localhost:5000#book/new and add some books to your library!

### Who is it? ###
John West (@jswest), and some friends for data entry.

### But what about me? ###
What about you? Send a pull request!

### Release history ###
0.1.0 Adds the basic book CRUD operations, and a rudimentary searching feature.