App = Ember.Application.create({
    rootElement: '#ember-app',
    LOG_TRANSITIONS:true
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
];


App.Router.map(function() {
    this.resource('pony',function(){
        this.route('add');
        this.route('detail',{path: '/:pony_id'});
        this.route('edit', {path: '/:pony_id/edit'});
    });
});

App.IndexRoute = Ember.Route.extend({
    model: function() {
        return this.store.find('pony');
    }
});

App.PonyRoute = Em.Route.extend({
    actions:{
        savePony: function(pony) {
            pony.save();
            this.transitionTo('index');
        },
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

App.IndexController = Em.ArrayController.extend({
    sortBy: ['name'],
    sorted: Em.computed.sort('@this', 'sortBy')
});


Ember.Handlebars.helper('upperCase', function (text) {
    return text && text.toUpperCase();
});