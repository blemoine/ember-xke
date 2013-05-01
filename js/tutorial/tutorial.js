Ember.ENV.TESTING = true;

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
        didInsertElement: function () {
            SyntaxHighlighter.highlight();

            $.get("js/App.js").done(function(app){
                execTestsSteps(Tuto.STEPS)
                Em.run.next(function(){
                    $('#tutorial').animate({
                        scrollTop: $(".is-active").offset().top
                    }, 100);
                });
            });
        }
    });

    Tuto.Step = Em.Object.extend({
        title: "",
        detailTemplateName: "tutorial-step-empty",
        solutionTemplateName: "tutorial-solution-empty",
        test: function () {
            ok(false, "Test not implemented")
        },
        passed: false,
        executed: false,
        errors: [],
        isActive: function () {
            return !this.passed && this.executed;
        }.property("passed", "executed")
    });

    Tuto.STEPS = [
        Tuto.Step.create({
            title: "Création de l'application",
            detailTemplateName: "tutorial-step-app",
            solutionTemplateName: "tutorial-solution-app",

            test: function () {
                ok(typeof App != "undefined",
                    "Il n'y a pas d'Objet App dans window");

                ok(Em.typeOf(App) == "instance",
                    "Cet objet App doit être un objet Ember");

                App.deferReadiness();

                ok(App.rootElement == "#ember-app",
                    "L'élément racine de App est "+App.rootElement+" alors qu'il devrait être la div avec l'id ember-app.");

                App.advanceReadiness();
                var promise = $.Deferred();
                App.ApplicationView = Em.View.extend({
                    didInsertElement:function(){
                        promise.resolve();
                    }
                })
                return promise;
            }
        }),
        Tuto.Step.create({
            title: "Dites bonjour au monde des poneys",
            detailTemplateName: "tutorial-step-hello",
            solutionTemplateName: "tutorial-solution-hello",

            test: function () {

                ok(Em.TEMPLATES['application'] != undefined,
                    "Le template 'application' n'est pas déclaré.");

                ok($('#ember-app').children().length >= 1,
                    "La div racine de l'application est vide");

                ok($('#ember-app :first-child').hasClass('ember-view'),
                    "Le premier élément enfant de la div racine n'est une view ember");

                ok($('#ember-app :first-child h1').length == 1,
                    "Il n'y pas de balise h1 dans la view ember");

                ok($('#ember-app :first-child h1').text() == "My Li'l Pony Application",
                    "la balide h1 ne contient pas le text 'My Li'l Pony Application'");
            }
        }),
        Tuto.Step.create({
            title: "Créer un datastore",
            detailTemplateName: "tutorial-step-ds",
            solutionTemplateName: "tutorial-solution-ds",
            test: function () {
                ok (Em.typeOf(App.Store) == 'class', "App.Store n'est pas définie.");
                ok (App.Store.create() instanceof DS.Store, "App.Store n'est pas de type DS.Store");
                ok (App.Store.prototype.revision == 12,
                    "La revision actuelle de App.Store est "+App.Store.prototype.revision
                        +" alors qu'elle devrait être 12");
            }
        }),
        Tuto.Step.create({
            title: "Créer une classe Pony",
            detailTemplateName: "tutorial-step-model",
            solutionTemplateName: "tutorial-solution-model",
            test: function () {
                ok(typeof App.Pony != "undefined",
                    "Il n'y a pas d'élement Pony dans App");

                ok(Em.typeOf(App.Pony) == "class",
                    "App.Pony n'est pas une classe ember");

                var assertPonyPropertyExistenceAndType = function (propertyName, propertyType) {
                    try {
                        equal(App.Pony.metaForProperty(propertyName).type, propertyType,
                            "la proprité " + proriété + " App.pony n'est pas de type " + propertyType);
                    } catch (e) {
                        if (e instanceof ReferenceError) {
                            //fail("App.Pony ne contient pas de propriété "+propertyName);
                        } else {
                            throw  e;
                        }
                    }
                }

                assertPonyPropertyExistenceAndType("firstName", 'string');
                assertPonyPropertyExistenceAndType("lastName", 'string');
                assertPonyPropertyExistenceAndType("color", 'string');
                assertPonyPropertyExistenceAndType("type", 'string');
            }
        }),
        Tuto.Step.create({
            title: "Créer une fixture Ember-Data",
            detailTemplateName: "tutorial-step-fixture",
            solutionTemplateName: "tutorial-solution-fixture",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Créer le template (liste)",
            detailTemplateName: "tutorial-step-list",
            solutionTemplateName: "tutorial-solution-list",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Créer une propriété calculée",
            detailTemplateName: "tutorial-step-computed",
            solutionTemplateName: "tutorial-solution-computed",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Créer une route consultation",
            detailTemplateName: "tutorial-step-consultation",
            solutionTemplateName: "tutorial-solution-consultation",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Créer un lien vers la home",
            detailTemplateName: "tutorial-step-home",
            solutionTemplateName: "tutorial-solution-home",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Créer une page d'ajout",
            detailTemplateName: "tutorial-step-add",
            solutionTemplateName: "tutorial-solution-add",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Utiliser l'API Rest",
            detailTemplateName: "tutorial-step-rest",
            solutionTemplateName: "tutorial-solution-rest",
            test: function () {
                //TODO A implémenter
            }
        }),
        Tuto.Step.create({
            title: "Utiliser un Helper",
            detailTemplateName: "tutorial-step-helper",
            solutionTemplateName: "tutorial-solution-helper",
            test: function () {
                //TODO A implémenter
            }
        })
    ];

    Tuto.StepView = Em.View.extend({
        templateName: "tutorial-step",
        classNames: "step",
        classNameBindings: ['step.isActive'],
        solutionIsShown: false,
        toggleSolution: function () {
            this.toggleProperty("solutionIsShown");
            Em.run.next(function () {
                SyntaxHighlighter.defaults['gutter'] = false;
                SyntaxHighlighter.all();
            });
            this.$('.solution').stop().slideToggle(this.solutionIsShown);
        },
        explanationView: function () {
            return Em.View.extend({
                classNames: "well",
                templateName: this.step.detailTemplateName
            });
        }.property('step'),
        detailIsShownToggler: false,
        toggleDetail: function () {
            this.toggleProperty("detailIsShownToggler");
            $('.step-detail').not(this.$('.step-detail')).slideUp();
            this.$('.step-detail').stop().slideToggle(this.detailIsShownToggler);

        },
        detailIsShown: function () {
            return this.get('step.isActive') || this.detailIsShownToggler;
        }.property("step.isActive", "detailIsShownToggler"),
        errorsIsShown: function(){

        }.property("step.passed", "step.executed"),
        solutionView: function () {
            return Em.View.extend({
                tagName: "pre",
                classNames: ["code", "brush: js"],
                templateName: this.step.solutionTemplateName
            });
        }.property("step.solutionTemplateName")
    });

});

SyntaxHighlighter.defaults['gutter'] = false;

