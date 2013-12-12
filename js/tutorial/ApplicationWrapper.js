(function() {
  var helper = Ember.Handlebars.helper;
  window.helpers = {};

  Ember.Handlebars.helper= function (name, fn){
    window.helpers[name] = fn;
    helper(name, fn);
  };

  var bootstrap = Ember.Handlebars.bootstrap;
  window.templates = {};
  Ember.Handlebars.bootstrap = function(ctx) {
    var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

    Ember.$(selectors, ctx)
        .each(function() {
            var script = Ember.$(this);
            templateName = script.attr('data-template-name') || script.attr('id') || 'application';
            if (templateName.indexOf("tutorial") == -1){
                window.templates[templateName] = script.html().replace(/\s+/g,'');
            }
        });
    bootstrap(ctx);
  };
})();
