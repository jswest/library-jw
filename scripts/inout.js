var MongoClient = require( 'mongodb' ).MongoClient
,		ObjectID = require( 'mongodb' ).ObjectID;

MongoClient.connect(
	"mongodb://localhost/library-jw",
	function( error, db ) {
		if ( error ) {
			console.log( error );
		} else {
			console.log( 'Spooling up Spaulding Avenue Library...' );

			var books = db.collection( 'books' );
			books.update(
				{},
				{ $set: 
					{
						inOut: 'in',
						checkouts: []
					}
				},
				{ multi: true },
				function ( error, numberOfChangedObjects ) {
					if ( error ) {
						console.log( error );
					}
					else {
						console.log( 'number of changed objects: ' + numberOfChangedObjects );
					}
				}
			);

		}
	}
);