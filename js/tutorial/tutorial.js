$.get('tutorial.html').done(function(content){
    $('body').append(content);

    Tuto = Em.Application.create({
        rootElement: '#tutorial'
    });

    Tuto.Step = Em.Object.extend({
        title:"",
        detail:"",
        solution:"",
        isActive:function(){
            return false;
        }.property()
    });

    Tuto.STEPS = [
        Tuto.Step.createWithMixins({
            title:"Créer le l'application",
            detail: "Aller dans le fichier App.js, et créer un objet 'App' de type Ember.Application et préciser que son" +
                " élement principale est un ",
            isActive:function(){
                return true;
            }.property()
        }),
        Tuto.Step.createWithMixins({
            title:"Dites hello Poney",
            detail: "Créer une classe à l'aide de DS.Model."
        }),
        Tuto.Step.createWithMixins({
            title:"Créer une classe modele"
        }),
        Tuto.Step.createWithMixins({
            title:"Créer une fixture Ember-Data"
        }),
        Tuto.Step.createWithMixins({
            title:"Créer le template (liste)",
            detail:"en plus du template application, avec l'outlet"
        }),
        Tuto.Step.createWithMixins({
            title:"Créer une propriété calculée"
        }),
        Tuto.Step.createWithMixins({
            title:"Créer une route consultation"
        })
    ];


    Tuto.ApplicationView = Ember.View.extend({
        templateName : "tutorial-app",
        classNames:["fill"]
    });
});
