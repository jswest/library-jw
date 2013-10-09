LIB.HomepageView = Backbone.View.extend({
	id: 'homepage',
	className: 'page',
	render: function() {
		var template = _.template( $('#homepage-template').html(), {} );
		$('#content-wrapper').html( $(this.el).html( template ) );
		$(document).on( 'keyup', this.keydownHandler );
	},
	keydownHandler: function( e ) {
		var inputVal = $('#homepage-search-form').find( 'input' ).val();
		if ( ! $('#homepage').hasClass( 'up' ) ) {
			$('#homepage').addClass( 'up' );
			$('#homepage-search-form').children( 'input' ).focus();
		}
		else if ( inputVal.length > 2 ) {
			$.ajax({
				url: '/search?q=' + inputVal,
				success: function( data ) {
					$('#results').html( '' );
					for ( var i = 0; i < data.length; i++ ) {
						data[i].tags.sort();
						data[i].authors.sort();
						var template = _.template( $('#book-search-template').html(), data[i] );
						$('#results').append( template );
						if ( i % 4 === 0 ) {
							$('#results').children( '.result-book' ).eq( i + 1 ).addClass( 'fth' );
							$('#results').append( '<li class="clear"></li>' );
						}
					}
				},
			});
		}
		else if ( inputVal.length <= 2 ) {
			$('#results').html( '' );
		}
	}
});