var db;
exports.getDB = function( dbArg ) {
	db = dbArg;
};
var ObjectID = require( 'mongodb' ).ObjectID;

exports.create = function ( req, res ) {
	var bookId = req.body.bookId
	,		checkouts = db.collection( 'checkouts' )
	,		books = db.collection( 'books' );
	checkouts.insert(
		{
			'bookId': bookId,
			'outTime': Date.now(),
			'inTime': false,
		},
		{ w: 1 },
		function ( error, object ) {
			books.update(
				{ '_id': new ObjectID( bookId ) },
				{
					$set: { 'inOut': 'out' },
					$push: { 'checkouts': object._id }
				},
				{ w: 1 },
				function ( error, numberOfChangedDocs ) {
					res.send( 200, {} );
				}
			);
		}
	);
};

exports.destroy = function ( req, res ) {
	var bookId = req.params.id
	,		checkouts = db.collection( 'checkouts' )
	,		books = db.collection( 'books' );
	console.log( bookId );
	checkouts.update(
		{ 'bookId': new ObjectID( bookId ) },
		{ $set: { 'inTime': Date.now() } },
		{ w: 1 },
		function ( error, numberOfChangedDocs ) {
			books.update(
				{ '_id': new ObjectID( bookId ) },
				{ $set: { 'inOut': 'in' } },
				{ w: 1 },
				function ( error, numberOfChangedDocs ) {
					console.log( 'hello dolly!' );
					res.send( 200, {} );
				}
			);
		}
	);
};