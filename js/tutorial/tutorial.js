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
            if(this.test){
                QUnit.onReportReady = function(result,run){
                    //debugger;
                }
                module(this.title);
                test(this.title, this.test);
            }
            return false;
        }.property()
    });

    Tuto.STEPS = [
        Tuto.Step.createWithMixins({
            title:"Création de l'application",
            detail: "Aller dans le fichier App.js, et créer un objet 'App' de type Ember.Application et préciser que son" +
                " élement principale est un ",

            test:function() {
                ok( typeof App != "undefined" ,
                    "Un objet App est bien définie" );
                ok( Em.typeOf(App) == "instance" ,
                    "L'objet App est bien un objet créé par ember" );
                ok( $('#ember-app').hasClass("ember-application") ,
                    "La div est l'id #ember-app a bien la class 'ember-application, " +
                    "ce qui prouve que l'application à bien été contruite avec cette div comme élément racine." );
            }
        }),
        Tuto.Step.createWithMixins({
            title:"Dites hello Poney",
            test : function() {
                ok( $('#ember-app :first-child').hasClass('ember-view') ,
                    "Le premier élément enfant de la div racine est bien une vue ember" );

                ok( $('#ember-app :first-child h1').text() == "My Li'l Poney Application" ,
                    "La vue ember contient bien une balise H1 contenant elle-même le text 'My Li'l Poney Application'" );
            }
        }),
        Tuto.Step.createWithMixins({
            title:"Créer une classe modele",
            detail: "Créer une classe à l'aide de DS.Model.",
            isActive:function(){
                var isOk = false;
                return !isOk;
            }.property()
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
