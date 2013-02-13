
//var Resourceurl = '../service/documents/relateddocuments/APPR';

function renderRelatedResources(options) {"use strict";
  var conf = $.extend({
		'showLength' : 5,
		'moreText' : 'more',
		'lessText' : 'less',
		'showSpeed' : 'slow',
		'showDocTasks' : true
	}, options);

	var categories = $('ul', $(conf.contextId));

	// var rrJsonPath = conf.gwUrl + conf.solrUri + conf.solrPort, rrJsonQuery =
	// conf.qstring + conf.mktcd, rrJsonUrl = rrJsonPath + rrJsonQuery;

	$.ajax({
			url : Resourceurl,
			dataType : 'json',
			async : false,
			error : function(jqXHR, textStatus, errorThrown) {
				/*console.log('jqXHR ' + jqXHR);
				console.log('textStatus ' + textStatus);
				console.log('errorThrown ' + errorThrown);*/
				alert(errorThrown);
			},
			success : function(json) {
				var haveDocs = false;

				// looping through each category defined in the html layer
				categories.each(function(index) {
					var thisCat = $(this), documents = '', thisCatName = thisCat.attr("data-catName");

					$.each(
						json.response.docs,
						function(i, doc) {
							if (doc.related_doc_category === thisCatName) {
								var doc_title;
								if (doc.short_name != null) {
									doc_title = doc.short_name;
								} else {
									doc_title = doc.doc_title;
								}
								if (conf.showDocTasks === true) {
									// this assumes a
									// portal context
									// @formatter:off
									// javascript:openDocument('D1714',
									// 'Shareholder
									// Information', 2,
									// '/http://prospectus-express.newriver.com/pnet/get_template.asp?clientid=legg&userid=&fundid=172960494&doctype=semi')

									documents += '<li>-&nbsp;<a class="doc_link" id="\a'
											+ doc.doc_id
											+ '\ID" href="javascript:solrDocOpener(\''
											+ doc.doc_id
											+ '\',\''
											+ doc.doc_title
											+ '\',\''
											+ doc.doc_url
											+ '\', '
											+ doc.is_external_link
											+ ', '
											+ doc.is_speedbump_required
											+ ');">'
											+ doc_title
											+ '</a><b onmouseover="javascript:void(0);" class="documentNapkin" id="'
											+ doc.doc_id
											+ '_relateddocs"></b></li>';
									// @formatter:on
								} else {
									documents += '<li>-&nbsp;<a href="'
											+ doc.doc_url
											+ '">'
											+ doc_title
											+ '</a></li>';
								}

							}
						});

			// if products were found string will not be
			// empty
				if (documents !== '') {
					thisCat.prev("h3").show();
					thisCat.show();
	
					haveDocs = true;
					// inject your html into the ul we are
					// working with
					thisCat.html(documents);
	
					// build content toggle for lists
					var catId = 'RelatedResourcesCatSlider'
							+ index, catIdLink = catId + 'Link';
	
					// give these tags ids so we can hook the
					// content toggler to it
					thisCat.attr('id', catId);
					thisCat.next('span').attr('id', catIdLink);
	
					// attach content toggler to lists which
					// will show or hide
					// this as needed
					
					(function($) {
						  $.fn.contentToggle = function(options) {
							  var settings = $.extend({
									'showLength' : 5,
									'moreText' : 'more',
									'lessText' : 'less',
									'linkId' : '',
									'showSpeed' : 'slow'
								}, options);
							  
							  var totalItems = $(this).children(),
								linkId = $(settings.linkId),
								showLength = settings.showLength, 
								lisGt = $(this.children().slice(showLength)),
								thisNode = this.get(0).tagName;
							  
							  if (settings.showLength === 0) {
									lisGt = totalItems;
								}
							  
								// if we have a Data List then we need to treat the child pairs as
								// as one logical unit
								if (thisNode === 'DL') {
									showLength = settings.showLength - 1;
									lisGt = $('dt:gt(' + showLength + '), dd:gt(' + showLength + ')', $(this));
								} 
								
								return this.each(function () {        
									// when the length we want to show is fewer than the total items
									// we have then render 
									if (totalItems.length > settings.showLength) {
										// hide our content
										lisGt.hide();
										// setup link behavior
										linkId.show();
										linkId.data('opened', false);
										linkId.html(settings.moreText);
										linkId.click(function () {
											lisGt.slideToggle(settings.showSpeed);
											// text toggling - not part of the slide toggle callback
											// since there seemed no value in tying them together at this point
											if (linkId.data('opened') === false) {
												linkId.data('opened', true);
												linkId.html(settings.lessText);
											} else if (linkId.data('opened') === true) {
												linkId.data('opened', false);
												linkId.html(settings.moreText);
											}
										});
									// if context is hidden then show it now
										$(this).show();
									} else {
										$(this).show();
										// hide the link if we don't need it
											$(settings.linkId).hide();
										}
									});

							  };
						})( jQuery );
					
					$('#' + catId).contentToggle({
						'showLength' : conf.showLength,
						'moreText' : conf.moreText,
						'lessText' : conf.lessText,
						'linkId' : '#' + catIdLink,
						'showSpeed' : conf.showSpeed
					});
	
				} else {
					thisCat.prev("h3").hide();
					thisCat.hide();
				}
	
			});
		if (haveDocs === true) {
			$(conf.contextId).show();
			$('.rrLabel', $(conf.contextId)).addClass('rrReady');

		} else {
			$(conf.contextId).hide();

		}
		}
	});

}
