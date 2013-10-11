//
// Get the low-level variables.
//
var express = require( 'express' )
,		path		= require( 'path' )
,		http		= require( 'http' )
,		app			= express();

//
// Get the MongoDB variables.
//
var MongoClient = require( 'mongodb' ).MongoClient
,		ObjectID = require( 'mongodb' ).ObjectID;

//
// Get the routes variables.
//
var book = require( './routes/book' )
,		checkout = require( './routes/checkout' )
, 	user = require( '.routes/user' )

//
// Configure the app.
//
app.configure( function() {
	app.set( 'port', process.env.PORT || 5000 );
	app.use( express.logger() );
	app.use( express.favicon() );
  app.use( express.cookieParser( 'super-secret' ) );
  app.use( express.session() );
  app.use( express.bodyParser() );
  app.use( express.static( path.join( __dirname, 'public' ) ) );
  app.use( app.router );
});

app.configure( 'development', function() {
	app.use( express.errorHandler() );
});

//
// Spool up the database and start the app.
//
MongoClient.connect(
	"mongodb://localhost/library-jw",
	function( error, db ) {
		if ( error ) {
			console.log( error );
		} else {
			console.log( 'Spooling up Spaulding Avenue Library...' );

			//
			// Define the routes.
			//

			app.get( '/tag/search', function ( req, res ) {
				var snippet = req.query.q
				,   books = db.collection( 'books' )
				,   docsPool = []
				,   checkPool = []
				,		i
				,		j
				,		tags;
				var tagsRegex = new RegExp( '.*' + snippet + '.*' );
				books.find(
					{ 'tags': tagsRegex },
					function ( error, cursor ) {
						cursor.toArray( function ( error, docs ) {
							for ( i = 0; i < docs.length; i++ ) {
								tags = docs[i].tags;
								for ( j = 0; j < tags.length; j++ ) {
									if ( checkPool.indexOf( tags[j] ) === -1 && tagsRegex.test( tags[j] ) ) {
										checkPool.push( tags[j] );
										docsPool.push( { 'name': tags[j] } );
									}
								}
							}
							res.send( docsPool );
						});
					}
				);
			});
			app.get( '/author/search', function ( req, res ) {
				var snippet = req.query.q
				,		books = db.collection( 'books' )
				,		docsPool = []
				,		checkPool = []
				,		i
				,		j
				,		authors;
				var authorRegex = new RegExp( '.*' + snippet + '.*' );
				books.find(
					{ 'authors': authorRegex },
					function ( error, cursor ) {
						cursor.toArray( function ( error, docs ) {
							for ( i = 0; i < docs.length; i++ ) {
								authors = docs[i].authors;
								for ( j = 0; j < authors.length; j++ ) {
									if ( checkPool.indexOf( authors[j] ) === -1 && authorRegex.test( authors[j] ) ) {
										checkPool.push( authors[j] );
										docsPool.push( { 'name': authors[j] } );
									}
								}
							}
							res.send( docsPool );
						});
					}
				);
			});
			app.get( '/search', function ( req, res ) {
				var snippet = req.query.q;
				var books = db.collection( 'books' );
				var docsPool = [];
				var findAuthors = function() {
					books.find(
						{ 'authors': new RegExp( '.*' + snippet + '.*' ) },
						function ( error, cursor ) {
							cursor.toArray( function ( error, docs ) {
								for ( var i = 0; i < docs.length; i++ ) {
									if ( docsPool.indexOf( docs[i] ) === -1 ) {
										docsPool.push( docs[i] );
									}
								}
								res.send( docsPool );
							});
						}
					);					
				};
				var findTags = function() {
					books.find(
						{ 'tags': new RegExp( '.*' + snippet + '.*' ) },
						function ( error, cursor ) {
							cursor.toArray( function ( error, docs ) {
								for ( var i = 0; i < docs.length; i++ ) {
									if ( docsPool.indexOf( docs[i] ) === -1 ) {
										docsPool.push( docs[i] );
									}
								}
								findAuthors();
							});
						}
					);				
				};
				var findTitles = function() {
					books.find(
						{ 'title': new RegExp( '.*' + snippet + '.*') },
						function( error, cursor ) {
							cursor.toArray( function( error, docs ) {
								for ( var i = 0; i < docs.length; i++ ) {
									if ( docsPool.indexOf( docs[i] ) === -1 ) {
										docsPool.push( docs[i] );
									}
								}
								findTags();
							});
						}
					);					
				};
				findTitles();
			});

			book.getDB( db );
			app.post( '/book', book.create );
			app.get( '/book', book.readAll );
			app.get( '/book/:id', book.read );
			app.put( '/book/:id', book.update );
			app.del( '/book/:id', book.destroy );

			checkout.getDB( db );
			app.post( '/checkout', checkout.create );
			app.del( '/checkout/:id', checkout.destroy );

			user.getDB( db );
			app.post( '/user', user.create );
			app.get( '/user', user.readAll );
			app.get( '/user/:id', user.read );
			app.put( '/user/:id', user.update );
			app.del( '/user/:id', user.destroy );

			//
			// Start yer engines.
			//
			http
				.createServer( app )
				.listen( app.get( 'port' ), function() {
  				console.log( "Engines started on port " + app.get( 'port' ) );
				});
		}
	}
);