
$.get('tutorial.html').done(function (content) {
    $('body').append(content);

    Tuto = Em.Application.create({
        rootElement: '#tutorial'
    });


    Tuto.Router.reopen({
        location: 'none'
    });

    Tuto.ApplicationView = Ember.View.extend({
        templateName: "tutorial-app",
        classNames: ["fill"]
    });

    Tuto.Step = Em.Object.extend({
        title: "",
        detailTemplateName: "tutorial-step-empty",
        solutionTemplateName: "tutorial-solution-empty",
        test:function(){},
        passed:false,
        executed:false,
        errors:[],
        isActive:function(){
            return !this.passed && this.executed;
        }.property("passed", "executed")
    });

    Tuto.STEPS = [
        Tuto.Step.create({
            title: "Création de l'application",
            detailTemplateName: "tutorial-step-app",

            test: function () {
                ok(typeof App != "undefined",
                    "Il n'y a pas d'Objet App dans window");
                ok(Em.typeOf(App) == "instance",
                    "Cet objet App doit être un objet Ember");
                ok($('#ember-app').hasClass("ember-application"),
                    "La div avec l'id #ember-app n'a pas la class 'ember-application, ce n'est donc pas encore un élément racine ember");
            }
        }),
        Tuto.Step.create({
            title: "Dites hello Poney",
            test: function () {
                ok($('#ember-app :first-child').hasClass('ember-view'),
                    "La div racine de l'application est vide");

                ok($('#ember-app :first-child').hasClass('ember-view'),
                    "Le premier élément enfant de la div racine n'est une view ember");

                ok($('#ember-app :first-child h1').length == 1,
                    "Il n'y pas de balise h1 dans la view ember");

                ok($('#ember-app :first-child h1').text() == "My Li'l Poney Application",
                    "la balide h1 ne contient pas le text 'My Li'l Poney Application'");
            }
        }),
        Tuto.Step.create({
            title: "Créer une classe modele",
            detailTemplateName: "tutorial-step-ds"
        }),
        Tuto.Step.create({
            title: "Créer une fixture Ember-Data"
        }),
        Tuto.Step.create({
            title: "Créer le template (liste)"
        }),
        Tuto.Step.create({
            title: "Créer une propriété calculée"
        }),
        Tuto.Step.create({
            title: "Créer une route consultation"
        })
    ];

    $.each(Tuto.STEPS, function(idx, step){
        exec(step.test, function(result){
            step.setProperties({
                executed: true,
                passed: !result.failed,
                errors: result.errors
            });
        });
        return step.passed;
    });

    Tuto.StepView = Em.View.extend({
        templateName: "tutorial-step",
        classNames:"step",
        classNameBindings:['step.isActive'],
        detailView: function (){
            return Em.View.extend({ templateName: this.step.detailTemplateName });
        }.property('step'),
        solutionView: function (){
            return Em.View.extend({ templateName: this.step.solutionTemplateName });
        }.property('step')
    });
});
