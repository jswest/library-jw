LIB.Router = Backbone.Router.extend({

	routes: {
		'': 'home',
		'book/new': 'newBook',
		'books': 'allBooks',
		'book/:bookId/edit': 'editBook',
		'checkout/:bookId': 'checkout',
		'checkin/:bookId': 'checkin'
	},

	home: function() {
		var homepageView = new LIB.HomepageView();
		homepageView.render();
	},

	newBook: function() {
		var book = new LIB.Book();
		var newBookView = new LIB.NewBookView( { model: book } );
		newBookView.render();
	},
	allBooks: function() {
		var allBooksView = new LIB.AllBooksView();
		allBooksView.render();
	},
	editBook: function( bookId ) {
		var book = new LIB.Book( { '_id': bookId } );
		book.fetch({
			success: function() {
				console.log( book );
				var editBookView = new LIB.EditBookView( { model: book } );
				editBookView.render();
			}
		})
	},

	checkout: function ( bookId ) {
		$.ajax({
			method: 'POST',
			url: '/checkout',
			data: { bookId: bookId },
			success: function () {
				Backbone.history.navigate( '/', { trigger: true } );
			}
		});
	},
	checkin: function ( bookId ) {
		$.ajax({
			method: 'DELETE',
			url: '/checkout/' + bookId,
			success: function () {
				Backbone.history.navigate( '/', { trigger: true } );
			}
		});
	}


});