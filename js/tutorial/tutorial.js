//Ember.ENV.TESTING = true;
window.location.hash = "#/"

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
                execTestsSteps(Tuto.STEPS, 0);
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
                    "App.Poney n'est pas définie.");

                ok(Em.typeOf(App.Pony)  == "class",
                    "App.Pony n'est pas une classe ember.");

                var assertPonyPropertyExistenceAndType = function (propertyName, expectedType) {
                    try {
                        var type = App.Pony.metaForProperty(propertyName).type;
                        equal(type, expectedType,
                            "La proprité " + propertyName + " de App.pony doit être de type "+expectedType+" et de non type " +type );
                    } catch (e) {
                        if (e instanceof Failed){
                            throw e;
                        }
                        fail("App.Pony ne contient pas de propriété "+propertyName + " ou elle n'est pas correctement déclarée.");
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
                ok (App.Store.prototype.adapter == "DS.FixtureAdapter",
                    "L'adaptater actuel de App.Store est '"+ App.Store.prototype.adapter +"'" +
                        " alors qu'il devrait être 'DS.FixtureAdapter'");

                ok (App.Pony.FIXTURES && App.Pony.FIXTURES.length > 0,
                    "Faut faire un copier/coller de ce qu'il y au dessus !");
            }
        }),
        Tuto.Step.create({
            title: "Créer le template (liste)",
            detailTemplateName: "tutorial-step-list",
            solutionTemplateName: "tutorial-solution-list",
            test: function () {
                ok (Em.typeOf(App.IndexRoute) == 'class', "App.IndexRoute n'est pas définie ou n'est pas une classe Ember.");
                ok (App.IndexRoute.create() instanceof Em.Route, "App.IndexRoute n'est pas de type Ember.Route");
                ok (App.IndexRoute.prototype.model(),
                    "La méthode 'model' de App.IndexRoute ne renvoie rien ou n'est pas définie.");
                ok (App.IndexRoute.prototype.model().get('content'),
                    "La méthode 'model' de App.IndexRoute ne renvoie pas la liste bouchonée des poneys.");


                ok(Em.TEMPLATES['index'] != undefined, "Le template 'index' n'est pas déclaré.");
                // TODO Tester si il y a bien des ul li dans le dom : Problème d'asynchronisme
            }
        }),
        Tuto.Step.create({
            title: "Créer une propriété calculée",
            detailTemplateName: "tutorial-step-computed",
            solutionTemplateName: "tutorial-solution-computed",
            test: function () {

                ok (typeof App.Pony.createRecord({}).get('name') != "undefined",
                    "App.Pony.name n'est pas pas définie");

                ok (typeof App.Pony.createRecord({}).name != "function",
                    "App.Pony.name n'est pas une proriété calculée mais une fonction, " +
                        "on aurait pas oublié '.property(...)' par hazard ?");

                var pony = App.Pony.createRecord({
                    firstName :'AA',
                    lastName: 'BB'
                });
                ok (pony.get("name") == "AA BB", "Si firstName = 'AA' et lastName = 'BB' name devrait valoir 'AA BB' " +
                    "et non pas "+ pony.get("name"));

                pony.set('firstName', 'CC');
                ok (pony.get("name") == "CC BB", "La propriété calculée name ne dépend pas de firstName");

                pony.set('lastName', 'DD');
                ok (pony.get("name") == "CC DD", "La propriété calculée name ne dépend pas de lastName");
                pony.deleteRecord();

                // TODO tester utilisation de name dans le template index -> async problem
            }
        }),
        Tuto.Step.create({
            title: "Créer une route consultation",
            detailTemplateName: "tutorial-step-consultation",
            solutionTemplateName: "tutorial-solution-consultation",
            test: function () {

                var appRouter = App.__container__.lookup('router:main');

                ok (appRouter.hasRoute('detail'), "Il n'y pas de route 'detail' déclarée dans le router.");

                ok(Em.TEMPLATES['detail'] != undefined, "Le template 'detail' n'est pas déclaré.");

                // TODO : Checher contenu de detail -> async problem
            }
        }),
        Tuto.Step.create({
            title: "Créer un lien vers la home",
            detailTemplateName: "tutorial-step-home",
            solutionTemplateName: "tutorial-solution-home",
            test: function () {
                ok ($('#ember-app div h1 a').length == 1, "Le titre n'a pas de linkTo.");
                ok ($('#ember-app div h1 a').attr('href') == "#/", "Le lien du titre pointe vers "+
                    $('#ember-app div h1 a').attr('href') + " alors qu'il devrait pointer vers '#/'.");

                // TODO : Tester contenue tmpl
            }
        }),
        Tuto.Step.create({
            title: "Créer une page d'ajout",
            detailTemplateName: "tutorial-step-add",
            solutionTemplateName: "tutorial-solution-add",
            test: function () {
                var appRouter = App.__container__.lookup('router:main');

                ok (appRouter.hasRoute('add'), "Il n'y pas de route 'add' déclarée dans le router.");
                ok(Em.TEMPLATES['add'] != undefined, "Le template 'add' n'est pas déclaré.");
                // TODO : checker contenu de add -> async problem

                ok (Em.typeOf(App.AddRoute) == 'class', "App.AddRoute n'est pas définie ou n'est pas une classe Ember.");
                ok (App.AddRoute.create() instanceof Em.Route, "App.AddRoute n'est pas de type Ember.Route");
                ok (App.AddRoute.prototype.model(),
                    "La méthode 'model' de App.AddRoute ne renvoie rien ou n'est pas définie.");
                ok (App.AddRoute.prototype.model().id > 0,
                    "La méthode 'model' de App.AddRoute ne renvois pas d'objet avec un id");


                ok (false, "TODO à implémenter");
            }
        }),
        Tuto.Step.create({
            title: "Utiliser l'API Rest",
            detailTemplateName: "tutorial-step-rest",
            solutionTemplateName: "tutorial-solution-rest",
            test: function () {
                ok (App.Store.prototype.adapter == "DS.RESTAdapter",
                    "L'adaptater actuel de App.Store est '"+ App.Store.prototype.adapter +"'" +
                        " alors qu'il devrait être 'DS.RESTAdapter'");
                //TODO test le commit
            }
        }),
        Tuto.Step.create({
            title: "Utiliser un Helper",
            detailTemplateName: "tutorial-step-helper",
            solutionTemplateName: "tutorial-solution-helper",
            test: function () {
                ok (false, "TODO à implémenter");
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

