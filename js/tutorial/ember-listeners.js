var registerHelper = Ember.Handlebars.registerBoundHelper;
var helpers = {};

Ember.Handlebars.registerBoundHelper= function (name, fn){
    console.log('ajout du helper '+name);
    helpers[name] = fn;
    registerHelper(name, fn);
}