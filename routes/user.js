var db;
exports.getDB = function( dbArg ) {
	db = dbArg;
};
var ObjectID = require( 'mongodb' ).ObjectID;

var bcrypt = require( 'bcrypt' );

exports.create = function ( req, res ) {
	var firstname = req.body.firstname.toLowerCase()
	,   lastname = req.body.lastname.toLowerCase()
	,		email = req.body.email.toLowerCase()
	,		pw = req.body.pw
	,		super = false
	,		users = db.collection( 'users' );
	users.findOne(
		{
			'email': email
		},
		function ( error, doc ) {
			if ( doc ) {
				res.send( { 'error': 'there is already a user with that email' } );
			}
			else {
				if ( email === 'john.sheffield.west@gmail.com' ) {
					super = true;
				}
				bcrypt.hash( pw, 10, function ( error, hash ) {
					users.insert(
						{
							'firstname': firstname,
							'lastname': lastname,
							'email': email,
							'password': hash,
							'super': super
						},
						{ w: 1 },
						function ( error, object ) {
							res.send( object );
						}
					);
				});
			}
		}
	);
};

exports.read = function( req, res ) {
	var userId = req.params.id;
	var users = db.collection( 'users' );
	users.findOne( { '_id': new ObjectID( userId ) }, function ( error, doc ) {
		res.send( doc );
	});
};

exports.readAll = function( req, res ) {
	var users = db.collection( 'users' );
	users.find( {}, function ( error, cursor ) {
		cursor.toArray( function ( error, docs ) {
			res.send( docs );
		});
	});
};

exports.update = function ( req, res ) {
	var userId = req.params.id;
	, 	firstname = req.body.firstname
	,		lastname = req.body.lastname
	,		email = req.body.email
	,		users = db.collection( 'users' );
	users.update(
		{ '_id': new ObjectID( userId ) },
		{
			$set: {
				'firstname': firstname,
				'lastname': lastname,
				'email': email
			}
		},
		{ w: 1 },
		function ( error, numberOfUpdatedObjects ) {
			res.send( 200, {} );
		}
	)
};

exports.destroy = function ( req, res ) {
	var userId = req.params.id;
	var users = db.collection( 'users' );
	users.remove(
		{ '_id': new ObjectID( userId ) },
		{ w: 1 },
		function ( error, numberOfRemovedObjects ) {
			res.send( 200, {} );
		}
	)
};