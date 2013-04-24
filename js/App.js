App = Ember.Application.create({
    rootElement: '#ember-app'
});

App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
});

App.Poney = DS.Model.extend({
    lastName: DS.attr('string'),
    firstName: DS.attr('string'),
    color: DS.attr('string'),
    type: DS.attr('string'),
    name: function () {
        return this.get('firstName') + ' ' + this.get('lastName');
    }.property('firstName', 'lastName')
});

App.Poney.FIXTURES = [
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

App.IndexRoute = Ember.Route.extend({
    model: function () {
        return App.Poney.find();
    }
});

App.Router.map(function () {
    this.route('detail', {path: 'poney/:poney_id'});
    this.route('add')
});

App.AddRoute = Ember.Route.extend({
    model: function () {
        return {id: new Date().getTime()}
    }
});

App.AddController = Ember.ObjectController.extend({
    savePoney: function () {
        App.Poney.createRecord(this.get('content'));
        this.transitionToRoute('index');
    }
});


