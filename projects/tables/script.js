function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
function testIndex(index, setting, count) {
	if (!(setting instanceof Array)) {
		return setting;
	} else if
		(
			// positive number column selection
			(setting.indexOf(index) != -1)
			||
			// negative number column selection
			(setting.indexOf(index - count) != -1)
		) {
		return true;
	} else {
		return false;
	}
}

(function($) {
	$.fn.tableTools = function(options) {
		var settings = $.extend({},$.fn.tableTools.defaults,options),
				$this = $(this);
		// Make sure the element is a table.
		if ($this.prop('tagName').toLowerCase() != 'table') {
			console.log("Error in tableTools(): Element is not a table. It is a " + $this.prop('tagName').toLowerCase() + ".");
			return $this;
		}
		// Make sure the table has a thead element
		if (settings.thead && !$this.has('thead').length) {
			$this.prepend('<thead></thead>');
			$this.children('thead').append($this.find('tbody tr:first-child'));
		}
		// Add Sort Functionality
		if (settings.sort && $this.has('thead tr')) {
			// get all of the headers in the table
			var headers = $this.find('thead th');
			// make the headers appear clickable
			headers.css({ cursor: 'pointer' });
			// attach a click() function to them that sorts the table on that header
			headers.click(function() {
				var container = $this.children('tbody'),
						column = $(this).index()+1,
						rows = container.children().sort(function(a,b) {
							var vA = $(a).children(':nth-child('+column+')').text().toUpperCase(),
									vB = $(b).children(':nth-child('+column+')').text().toUpperCase();
							if (isNumber(vA) && isNumber(vB)) { vA = parseInt(vA); vB = parseInt(vB); }
							return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
						});
				if ($(this).hasClass('sortedASC')) rows = rows.get().reverse();
				container.append(rows);

				$(this).siblings().removeClass();
				$(this).toggleClass('sortedDESC', $(this).hasClass('sortedASC')).toggleClass('sortedASC');
			});
		}

		// Add Filter Functionality
		if (settings.filter && $this.has('thead tr')) {
			// add filter inputs to a second <tr> inside <thead>
			$this.find('thead').append('<tr class="filters"></tr>');
			var headers = $this.find('thead:first-child th'),
					filterRow = $this.find('tr.filters');
			headers.each(function(i) {
				if (testIndex(i, settings.filter, headers.length)) {
					filterRow.append('<th><input type="text" class="filter" /></th>');
				} else {
					filterRow.append('<th></th>');
				}
			});
			// make filters work
			var filterInputs = $this.find('thead input'),
					data = $this.find('tbody tr');
			filterInputs.focus(function() {
				filterInputs.not(this).val('');
				data.show();
				$this.trigger('filter');
			});
			filterInputs.on('keyup change', function(e) {
						search = $(this).val().split(" "),
						container = $this.children('tbody')
						column = $(this).closest('th').index()+1;

				if ($(this).val() == '') data.show();
				// hide all the rows
				data.hide();
				// filter the rows that match the search, and show them
				data.filter(function() {
					for (var i = 0; i < search.length; ++i) {
						if ($(this).children(':nth-child('+column+')').is(':contains("' + search + '")')) return true;
					}
					return false;
				}).show();
				$this.trigger('filter');
			});
		}
		if (settings.total) {
			if (!$this.children('tfoot').length) $this.append('<tfoot></tfoot>');
			$this.find('tfoot').append('<tr class="totals"></tr>');
			var columns = $this.find('tbody tr:last-child td'),
					tableFooter = $this.find('tfoot'),
					computeSums = function() {
						$this.find('tfoot .total').each(function(i) {
							var column = $(this).index()+1,
									sum = 0;
							$this.children('tbody').find('tr:visible td:nth-child('+column+')').each(function() {
								var txt = $(this).text();
								if (!isNaN(txt) && txt.length!=0) {
									sum += parseFloat(txt);
								}
							});
							$(this).text(sum);
						});
					};
			columns.each(function(i) {
				if (testIndex(i, settings.total, columns.length)) {
					tableFooter.find('tr.totals').append('<td class="total"></td>');
				} else {
					tableFooter.find('tr.totals').append('<td></td>');
				}
			});
			computeSums();
			$($this).on('filter', computeSums);
		}
	};

	$.fn.tableTools.defaults = {
					// Avaliable options
					// force the table ot have a <thead> element
					// 	if there is no <thead> element, the plugin will grab the first <tr>
					// 	and move it into a new <thead> element
					thead: true,
					// add a click-to-sort to the header cells
					sort: true,
					// add a filter to each column
					// options:
					// 	false = off
					// 	true = all
					// 	[3,4,5] = array of column numbers
					// 	[-1] = only the last column
					filter: true,
					// add a <tfoot> with totals of each column
					// options:
					// 	false = off
					// 	true = all
					// 	[3,4,5] = array of column numbers
					// 	[-1] = only the last column
					total: false,
					// make the table respond when the browser gets too small
					// options:
					// 	false = off
					// 	{
					// 		resolution = size of media query
					// 	}
					responsive: false
				}
}(jQuery));
