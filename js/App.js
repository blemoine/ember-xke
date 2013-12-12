App = Ember.Application.create({
  rootElement: '#ember-app'
});

App.Pony = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    color: DS.attr('string'),
    type: DS.attr('string'),
    name: function() {
      return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});

App.Router.map(function() {
  this.resource('pony', {path: '/'}, function() {
    this.route('add');
    this.route('detail', {path: '/:pony_id'});
    this.route('edit', {path: '/:pony_id/edit'});
  });
});

App.PonyRoute = Ember.Route.extend({
  actions: {
    deletePony: function(pony) {
      pony.deleteRecord();
      pony.save();
    },
    savePony: function(pony) {
      pony.save();
      this.transitionTo('pony.index');
    }
  }
});

App.PonyIndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('pony');
  }
});

App.PonyAddRoute = Ember.Route.extend({
  model: function() {
    return this.store.createRecord('pony');
  }
});

App.PonyIndexController = Em.ArrayController.extend({
  sortBy: ['name'],
  sorted: Em.computed.sort('@this', 'sortBy')
});

Ember.Handlebars.helper('upperCase', function (text) {
  return text.toUpperCase();
});
