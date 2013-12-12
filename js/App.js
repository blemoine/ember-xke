App = Ember.Application.create({
    rootElement: '#ember-app'
});

App.Pony = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    color: DS.attr('string'),
    type: DS.attr('string'),
    name: function () {
      return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('pony');
    }
});

App.Router.map(function () {
    this.route('detail', {path: 'pony/:pony_id'});
    this.route('add');
});

App.AddRoute = Ember.Route.extend({
    model: function () {
      return {};
    }
});

App.IndexController = Em.ArrayController.extend({
  sortBy: ['name'],
  sorted: Em.computed.sort('@this', 'sortBy')
});

App.AddController = Ember.ObjectController.extend({
  actions: {
    savePony: function () {
        this.store.createRecord('pony', this.get('content')).save();
        this.transitionToRoute('index');
    }
  }
});

Ember.Handlebars.helper('upperCase', function (text) {
    return text.toUpperCase();
});
