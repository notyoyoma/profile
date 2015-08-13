(function() {

  var blockTemplate = Handlebars.compile($('#block-template').html());

  var defaults = {
    block_id: 'stone',
    columns: 10,
    rows: 10
  };

  $.fn.mcField = function(world) {
    var settings = $.extend(defaults, world);

    this.css("font-size", Math.ceil(this.outerWidth() / settings.columns));

    for (var i=0; i < settings.columns; i += 1) {
      for (var j=0; j < settings.rows; j += 1) {
        this.append(blockTemplate({
          id: settings.block_id,
          l: i+"em",
          t: j+"em"
        }));
      }
    }

    this.find('.block').click(function(){
      $(this).remove();
    });

  };

})();
