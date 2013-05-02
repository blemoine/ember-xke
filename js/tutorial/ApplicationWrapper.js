var registerHelper = Ember.Handlebars.registerBoundHelper;
var helpers = {};

Ember.Handlebars.registerBoundHelper= function (name, fn){
    helpers[name] = fn;
    registerHelper(name, fn);
}

var bootstrap = Ember.Handlebars.bootstrap;
var templates = {};
Ember.Handlebars.bootstrap = function(ctx) {
    var selectors = 'script[type="text/x-handlebars"], script[type="text/x-raw-handlebars"]';

    Ember.$(selectors, ctx)
        .each(function() {
            var script = Ember.$(this);
            templateName = script.attr('data-template-name') || script.attr('id') || 'application';
            if (templateName.indexOf("tutorial") == -1){
                templates[templateName] = script.html().replace(/\s+/g,'');
            }
        });
    bootstrap(ctx);
}