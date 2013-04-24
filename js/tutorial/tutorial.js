$.get('tutorial.html').done(function(content){
    $('body').append(content);
    Tuto = Em.Application.create({
        rootElement: '#tutorial'
    });
    Tuto.ApplicationView = Ember.View.extend({
        templateName : "tutorial-app"
    });
});

