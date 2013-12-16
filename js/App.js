App = Ember.Application.create({
    rootElement: '#ember-app',
    LOG_TRANSITIONS:true
});

App.Router.map(function() {
    this.route('add');
    this.resource('pony', {path: '/:pony_id'},function(){
        this.route('edit', {path: '/edit'});
    });
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

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('pony');
    },
    actions:{
        deletePony: function(pony) {
            pony.deleteRecord();
            pony.save();
        }
    }
});

App.PonyAddRoute = Ember.Route.extend({
    model: function() {
        return this.store.createRecord('pony');
    }
});

App.AddRoute = Ember.Route.extend({
    actions: {
        savePony: function(pony) {
            pony.save();
            this.transitionTo('pony.index');
        }
    }
});

App.IndexController = Em.ArrayController.extend({
    sortBy: ['name'],
    sorted: Em.computed.sort('@this', 'sortBy')
});


Ember.Handlebars.helper('upperCase', function (text) {
    return text && text.toUpperCase();
});