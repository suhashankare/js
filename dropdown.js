(function($){
    var methods = {
        init : function( options ) {
            var o = $.extend({
                onSelect: null
            }, options);

            return this.each(function(){
                var select = $(this).hide();
                var group = $('optgroup', select);
                var opts = $('option', select);
                var list = '';

                // if select has optgroups
                if(group.length > 0) {
                    // build optgroup list
                    group.each(function(){
                        list += '<li class="group">' + $(this).attr('label') + '</li>';
                        $('option', $(this) ).each(function(){
                            var option = $(this);
                            var selected = ( option.is(':selected') ) ? ' class="selected"' : '';
                            list += '<li' + selected + '>' + option.text() + '</li>';
                        });
                    });
                } else {
                    // build basic list
                    opts.each(function(){
                        var option = $(this);
                        var selected = ( option.is(':selected') ) ? ' class="selected"' : '';
                        list += '<li' + selected + '>' + option.text() + '</li>';
                    });
                }

                // create dropdown html
                var dropdown = $( '<div />', {
                    'class': 'dropdown',
                    'html': '<i>' + $('option:selected', select).text() + '</i><b class="sprite grayArrow"></b>'
                }).insertAfter(select);

                var ul = $( '<ul />', {
                    'html': list
                }).appendTo(dropdown);

                dropdown.click(function() {
                    // if not visible...
                    if( !ul.is(':visible') ) {
                        dropdown.addClass('open');
                        ul.css('min-width', dropdown.width() );

                        // show dropdown
                        ul.animate({opacity: 1, height: 'toggle'}, 200, function() {
                            // add click event to document to close
                            $(document).one('click', function(e) {
                                var target = $(e.target);

                                // if dropdown is clicked do something
                                if (target.parents().hasClass('dropdown') && target.is('li') && !target.hasClass('group')) {
                                    var opt = opts.eq(target.index());

                                    // set current value
                                    dropdown.find('i').text( target.text() );

                                    // set original select value for form processing
                                    opts.removeAttr('selected');
                                    opt.attr('selected','selected');

                                    // set dropdown selected
                                    target.addClass('selected');

                                    // if onSelect is set
                                    if(typeof o.onSelect == 'function'){
                                        o.onSelect.call(this, opt);
                                    }
                                }

                                // close dropdown
                                ul.stop(true, true).animate({opacity: 0, height: 'toggle'}, 200, function() {
                                    dropdown.removeClass('open');

                                });
                            });
                        });
                    }

                    // remove selected on mouseenter
                    ul.mouseenter(function(){
                        ul.children('li').removeClass('selected');
                    });
                });

            });
        }
    };

    $.fn.selectDropdown = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist' );
        }
    };

})( jQuery );
