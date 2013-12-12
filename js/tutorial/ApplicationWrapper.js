HELPERS = {};

(function() {
  var helper = Ember.Handlebars.helper;

  Ember.Handlebars.helper= function (name, fn){
    HELPERS[name] = fn;
    helper(name, fn);
  };
})();
