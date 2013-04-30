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


App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.RESTAdapter'
});

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return App.Pony.find();
    }
});

App.Router.map(function () {
    this.route('detail', {path: 'pony/:pony_id'});
    this.route('add');
});

App.AddRoute = Ember.Route.extend({
    model: function () {
        return {id: new Date().getTime()}
    }
});

App.AddController = Ember.ObjectController.extend({
    savePony: function () {
        App.Pony.createRecord(this.get('content'));
        this.get('store').commit();
        this.transitionToRoute('index');
    }
});

Ember.Handlebars.registerBoundHelper('upperCase', function (text) {
    return text.toUpperCase();
});
