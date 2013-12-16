App = Ember.Application.create({
    rootElement: '#ember-app',
    LOG_TRANSITIONS:true
});


App.Router.map(function() {
    this.route('add');
    this.resource('pony', {path: '/pony/:pony_id'},function(){
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

/*
App.ApplicationAdapter = DS.FixtureAdapter;

App.Pony.FIXTURES = [
    {
        id: 1,
        firstName: 'Rainbow',
        lastName: 'Dash',
        color: 'Sky blue',
        type: 'Pegasus'
    },
    {
        id: 2,
        firstName: 'Twillight',
        lastName: 'Sparkle',
        color: 'Lavender',
        type: 'Alicorn'
    },
    {
        id: 3,
        firstName: 'Apple',
        lastName: 'Jack',
        color: 'orange',
        type: 'Earth Pony'
    }
];*/

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('pony');
    }
});

App.AddController = Em.ObjectController.extend({
    actions:{
        savePony: function() {
            this.content.save();
            this.transitionToRoute('pony.index');
        }
    }
});

App.AddRoute = Ember.Route.extend({
    model: function() {
        return this.store.createRecord('pony');
    }
});

App.IndexController = Em.ArrayController.extend({
    sortBy: ['name'],
    sorted: Em.computed.sort('@this', 'sortBy'),
    actions:{
        deletePony: function(pony) {
            pony.deleteRecord();
            pony.save();
        }
    }
});


Ember.Handlebars.helper('upperCase', function (text) {
    return text && text.toUpperCase();
});