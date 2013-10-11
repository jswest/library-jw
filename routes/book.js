var db;
exports.getDB = function( dbArg ) {
	db = dbArg;
};
var ObjectID = require( 'mongodb' ).ObjectID;

exports.create = function ( req, res ) {
	var title = req.body.title;
	var authors = req.body.authors;
	var tags = req.body.tags;
	var completed = req.body.completed;
	var books = db.collection( 'books' );
	books.insert(
		{
			'title': title,
			'authors': authors,
			'tags': tags,
			'inOut': 'in',
			'checkouts': [],
			'completed': completed
		},
		{ w: 1 },
		function( error, object ) {
			res.send( object );
		}
	);
};

exports.read = function( req, res ) {
	var bookId = req.params.id;
	var books = db.collection( 'books' );
	books.findOne( { '_id': new ObjectID( bookId ) }, function ( error, doc ) {
		res.send( doc );
	});
};

exports.readAll = function( req, res ) {
	var books = db.collection( 'books' );
	books.find( {}, function ( error, cursor ) {
		cursor.toArray( function ( error, docs ) {
			res.send( docs );
		});
	});
};

exports.update = function ( req, res ) {
	var bookId = req.params.id;
	var title = req.body.title;
	var authors = req.body.authors;
	var tags = req.body.tags;
	var completed = req.body.completed;
	var books = db.collection( 'books' );
	books.update(
		{ '_id': new ObjectID( bookId ) },
		{
			$set: {
				'title': title,
				'authors': authors,
				'tags': tags,
				'completed': completed	
			}
		},
		{ w: 1 },
		function ( error, numberOfUpdatedObjects ) {
			res.send( 200, {} );
		}
	)
};

exports.destroy = function ( req, res ) {
	var bookId = req.params.id;
	var books = db.collection( 'books' );
	books.remove(
		{ '_id': new ObjectID( bookId ) },
		{ w: 1 },
		function ( error, numberOfRemovedObjects ) {
			res.send( 200, {} );
		}
	)
};