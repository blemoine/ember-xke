App = Ember.Application.create();

App.Store = DS.Store.extend({
    revision: 12,
    adapter: 'DS.FixtureAdapter'
});

App.Poney = DS.model.extend({
    name: DS.attr('string'),
    color: DS.attr('string'),
    type:DS.attr('string')
});

App.Poney.FIXTURES = [
    {
        id: 1,
        name: 'Rainbow Dash',
        color: 'Sky blue',
        type:'Pegasus'
    },
    {
        id: 2,
        name: 'Twilight Sparkle',
        color: 'Lavender',
        type:'Alicorn'
    },
    {
        id: 3,
        name: 'Applejack',
        color: 'orange',
        type:'Earth Pony'
    }
];



