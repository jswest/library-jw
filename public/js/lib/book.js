LIB.Book = Backbone.Model.extend({
	idAttribute: "_id",
	url: function() {
		if ( this.get( '_id' ) ) {
			return '/book/' + this.get( '_id' );
		}
		else {
			return false;
		}
	}
});
LIB.Books = Backbone.Collection.extend({
	url: '/book',
	model: LIB.Book
});
LIB.NewBookView = Backbone.View.extend({
	events: {
		'submit form': 'submitHandler'
	},
	className: 'page',
	id: 'new-book-page',
	render: function() {
		var template = _.template(
			$('#book-template').html(),
			{
				'_id': false,
				'title': false
			}
		);
		$('#content-wrapper').html( $(this.el).html( template ) );
		$('#authors-input').tokenInput( '/author/search' );
		$('#tags-input').tokenInput( '/tag/search' );
	},
	submitHandler: function( e ) {
		e.preventDefault();
		var tags = [];
		var existingTags = $('#existing-tags-item').find( 'li.token-input-token' );
		existingTags.each( function() {
			tags.push( $(this).find( 'p' ).html() );
		});
		var newTags = $('#new-tags-input').val();
		newTags = newTags.split( ';' );
		for ( var i = 0; i < newTags.length; i++ ) {
			var newtag = $.trim( newTags[i] );
			tags.push( newtag.toLowerCase() );
		}
		var authors = [];
		var existingAuthors = $('#existing-authors-item').find( 'li.token-input-token' );
		existingAuthors.each( function() {
			authors.push( $(this).find( 'p' ).html() );
		});
		var newAuthors = $('#new-authors-input').val();
		newAuthors = newAuthors.split( ';' );
		for ( var i = 0; i < newAuthors.length; i++ ) {
			var newAuthor = $.trim( newAuthors[i] );
			authors.push( newAuthor.toLowerCase() );
		}
		this.model.url = '/book';
		this.model.save(
			{
				'title': $('#title-input').val().toLowerCase(),
				'authors': authors,
				'tags': tags
			},
			{
				success: function( model ) {
					LIB.router.navigate( '/', { trigger: true } );
				}
			}
		);
	}
});
LIB.EditBookView = Backbone.View.extend({
	events: {
		'submit form': 'submitHandler'
	},
	className: 'page',
	id: 'edit-book-page',
	render: function() {
		var template = _.template( $('#book-template').html(), this.model.toJSON() );
		$('#content-wrapper').html( $(this.el).html( template ) );
		var authors = [];
		for ( var i = 0; i < this.model.get('authors').length; i++ ) {
			authors.push( { 'name': this.model.get('authors')[i] } );
		}
		var tags = [];
		for ( var i = 0; i < this.model.get('tags').length; i++ ) {
			tags.push( { 'name': this.model.get('tags')[i] } );
		}		
		$('#authors-input').tokenInput( '/author/search', {
			prePopulate: authors
		} );
		$('#tags-input').tokenInput( '/tag/search', {
			prePopulate: tags
		} );
	},
	submitHandler: function( e ) {
		e.preventDefault();
		var tags = [];
		var existingTags = $('#existing-tags-item').find( 'li.token-input-token' );
		existingTags.each( function() {
			tags.push( $(this).find( 'p' ).html() );
		});
		var newTags = $('#new-tags-input').val();
		newTags = newTags.split( ';' );
		for ( var i = 0; i < newTags.length; i++ ) {
			var newTag = $.trim( newTags[i] );
			if ( newTag !== '' ) {
				tags.push( newTag.toLowerCase() );
			}
		}
		var authors = [];
		var existingAuthors = $('#existing-authors-item').find( 'li.token-input-token' );
		existingAuthors.each( function() {
			authors.push( $(this).find( 'p' ).html() );
		});
		var newAuthors = $('#new-authors-input').val();
		newAuthors = newAuthors.split( ';' );
		for ( var i = 0; i < newAuthors.length; i++ ) {
			var newAuthor = $.trim( newAuthors[i] );
			if ( newAuthor !== '' ) {
				authors.push( newAuthor.toLowerCase() );
			}
		}
		this.model.save(
			{
				'title': $('#title-input').val().toLowerCase(),
				'authors': authors,
				'tags': tags
			},
			{
				success: function ( model ) {
					LIB.router.navigate( '/', { trigger: true } );
				}
			}
		);
	}
});
LIB.AllBooksView = Backbone.View.extend({
	className: 'page',
	id: 'all-books-page',
	render: function() {
		var template = _.template( $('#all-books-template').html(), {} );
		$('#content-wrapper').html( $(this.el).html( template ) );
		var books = new LIB.Books();
		books.fetch({
			success: function( data ) {
				books.each( function( book ) {
					var bookView = new LIB.BookView( { model: book } );
					bookView.renderInList();
				});
			}
		})
	}
});
LIB.BookView = Backbone.View.extend({
	tagName: 'tr',
	events: {
		'click .x': 'destroyIt',
		'click .title': 'updateIt'
	},
	renderInList: function() {
		var template = _.template( $('#book-table-view').html(), this.model.toJSON() );
		$('table').append( $(this.el).html( template ) );
	},
	destroyIt: function() {
		var that = this;
		this.model.destroy({
			success: function ( model ) {
				$(that.el).remove();
			}
		});
	},
	updateIt: function() {
		LIB.router.navigate( 'book/' + this.model.get( '_id' ) + '/edit', { trigger: true } );
	}
});