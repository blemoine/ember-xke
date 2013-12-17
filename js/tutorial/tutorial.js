SyntaxHighlighter.defaults['gutter'] = false;

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

            var view = this;
            execTestsSteps(Tuto.STEPS, 0);
            Em.run.later(function () {
                var stepIsActive = $(".is-active");
                if (stepIsActive.length > 0) {
                    $('#tutorial').animate({
                        scrollTop: $(".is-active").offset().top
                    }, 100);
                } else {
                    view.set('status', " terminé !")
                }
            }, 200);

            $('#tutorial img').on('click', function () {
                localStorage.removeItem("lastRuningTestIdx");
                window.location.reload();
            });
        }
    });

    Tuto.StepView = Em.View.extend({
        templateName: "tutorial-step",
        classNames: "step",
        classNameBindings: ['step.isActive'],
        solutionIsShown: false,
        detailIsShownToggler: false,
        detailIsShown: Em.computed.or("step.isActive", "detailIsShownToggler"),
        explanationView: function () {
            return Em.View.extend({
                classNames: "well",
                templateName: this.step.detailTemplateName
            });
        }.property('step'),
        solutionView: function () {
            return Em.View.extend({
                tagName: "pre",
                classNames: ["code", "brush: js"],
                templateName: this.step.solutionTemplateName
            });
        }.property("step.solutionTemplateName"),
        actions: {
            toggleSolution: function () {
                this.toggleProperty("solutionIsShown");
                Em.run.next(function () {
                    SyntaxHighlighter.defaults['gutter'] = false;
                    SyntaxHighlighter.all();
                });
                this.$('.solution').stop().slideToggle(this.solutionIsShown);
            },
            toggleDetail: function () {
                this.toggleProperty("detailIsShownToggler");
                $('.step-detail').not(this.$('.step-detail')).slideUp();
                this.$('.step-detail').stop().slideToggle(this.detailIsShownToggler);

            }
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
        allErrors: function () {
            return [TEMPLATES_ERROR, this.errors].join('\n');
        }.property('errors'),
        isActive: function () {
            return !this.passed && this.executed;
        }.property("passed", "executed")
    });

    templateContains = function (templateName, text, msg) {
        return ok(TEMPLATES[templateName] &&
            TEMPLATES[templateName]
                .replace(/ /g, '')
                .replace(/"/g, "'").indexOf(text) != -1, msg);
    }

    Tuto.STEPS = [
        Tuto.Step.create({
            title: "Création de l'application",
            detailTemplateName: "tutorial-step-app",
            solutionTemplateName: "tutorial-solution-app",

            test: function () {
                ok(typeof App != "undefined",
                    "Il n'y a pas d'Objet App dans window");

                ok(Em.typeOf(App) != "class",
                    "Cet objet App doit être un objet et non une classe");

                ok(Em.typeOf(App) == "instance",
                    "Cet objet App doit être un objet Ember");

                ok(App.rootElement == '#ember-app', "ember-app n'est pas la div racine de l'application");
            }
        }),
        Tuto.Step.create({
            title: "Dites bonjour au monde des poneys",
            detailTemplateName: "tutorial-step-hello",
            solutionTemplateName: "tutorial-solution-hello",
            test: function () {

                ok(Em.TEMPLATES['application'] != undefined,
                    "Le template 'application' n'est pas déclaré.");

                templateContains("application", "MyLi'lPonyApplication",
                    "Le template application ne contient pas le bon titre et/ou les bonnes balises.")
            }
        }),
        Tuto.Step.create({
            title: "Créer une classe Pony",
            detailTemplateName: "tutorial-step-model",
            solutionTemplateName: "tutorial-solution-model",
            test: function () {
                ok(typeof App.Pony != "undefined",
                    "App.Pony n'est pas définie.");

                ok(Em.typeOf(App.Pony) == "class",
                    "App.Pony n'est pas une classe ember.");

                ok(App.__container__.lookup('store:main').modelFor('pony') == App.Pony,
                    "App.Pony n'est pas de type DS.Model");

                var assertPonyPropertyExistenceAndType = function (propertyName, expectedType) {
                    try {
                        var type = App.Pony.metaForProperty(propertyName).type;
                        equal(type, expectedType,
                            "La proprité " + propertyName + " de App.pony doit être de type " + expectedType + " et de non type " + type);
                    } catch (e) {
                        if (e instanceof Failed) {
                            throw e;
                        }
                        fail("App.Pony ne contient pas de propriété " + propertyName + " ou elle n'est pas correctement déclarée.");
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
                ok(typeof App.ApplicationAdapter != "undefined",
                    "App.ApplicationAdapter n'est pas encore définie");

                ok(App.ApplicationAdapter == DS.FixtureAdapter,
                    "App.ApplicationAdapter doit être initialiser avec DS.FixtureAdapter");

                ok(App.Pony.FIXTURES && App.Pony.FIXTURES.length > 0,
                    "Faut faire un copier/coller de ce qu'il y a au dessus !");
            }
        }),
        Tuto.Step.create({
            title: "Créer le template (liste)",
            detailTemplateName: "tutorial-step-list",
            solutionTemplateName: "tutorial-solution-list",
            test: function () {
                ok(TEMPLATES.application.indexOf("{{outlet}}") != -1, "Le template application ne contient pas de {{outlet}}");
                ok(Em.typeOf(App.IndexRoute) == 'class', "App.IndexRoute n'est pas définie ou n'est pas une classe Ember.");
                ok(App.IndexRoute.create() instanceof Em.Route, "App.IndexRoute n'est pas de type Ember.Route");

                var indexRoute = App.__container__.lookup('route:index');

                ok(indexRoute.model(),
                    "La méthode 'model' de App.IndexRoute ne renvoie rien ou n'est pas définie.");
                ok(indexRoute.model().get,
                    "La méthode 'model' de App.IndexRoute doit renvoyer un Objet Ember.");
                ok(indexRoute.model().get('isFulfilled') == false,
                    "La méthode 'model' de App.IndexRoute ne renvoie pas la liste bouchonée des poneys.");


                ok(Em.TEMPLATES['index'] != undefined, "Le template 'index' n'est pas déclaré.");

                ok(TEMPLATES.index.indexOf("<ul>") != -1, "Le template ne contient pas de balise ul");
                ok(TEMPLATES.index.indexOf("<li>") != -1, "Le template ne contient pas de balise li");
                ok(TEMPLATES.index.indexOf("{{#each") != -1, "Le template ne contient pas de helper {{each}}");
            }
        }),
        Tuto.Step.create({
            title: "Créer une propriété calculée",
            detailTemplateName: "tutorial-step-computed",
            solutionTemplateName: "tutorial-solution-computed",
            test: function () {

                var store = App.__container__.lookup('store:main');

                var pony = store.createRecord('pony', {
                    firstName: 'AA',
                    lastName: 'BB'
                });

                ok(typeof pony.get('name') != "undefined", "App.Pony.name n'est pas pas définie",
                    function () {
                        pony.deleteRecord();
                    });

                ok(typeof pony.name != "function", "App.Pony.name n'est pas une proriété calculée mais une fonction, " +
                    "on aurait pas oublié '.property(...)' par hazard ?",
                    function () {
                        pony.deleteRecord();
                    });

                ok(pony.get("name") == "AA BB", "Si firstName = 'AA' et lastName = 'BB' name devrait valoir 'AA BB' " +
                    "et non pas " + pony.get("name"),
                    function () {
                        pony.deleteRecord();
                    });

                pony.set('firstName', 'CC');
                ok(pony.get("name") == "CC BB", "La propriété calculée name ne dépend pas de firstName",
                    function () {
                        pony.deleteRecord();
                    });

                pony.set('lastName', 'DD');
                ok(pony.get("name") == "CC DD", "La propriété calculée name ne dépend pas de lastName",
                    function () {
                        pony.deleteRecord();
                    });

                pony.deleteRecord();

                ok(TEMPLATES.index.indexOf("name}}") != -1, "La propriété name n'est pas utilisée dans le template index");
            }
        }),
        Tuto.Step.create({
            title: "Créer une route consultation",
            detailTemplateName: "tutorial-step-consultation",
            solutionTemplateName: "tutorial-solution-consultation",
            test: function () {

                var appRouter = App.__container__.lookup('router:main');

                ok(appRouter.hasRoute('pony.index'), "Il n'y pas de resource 'pony' déclarée dans le router.");
                ok(appRouter.hasRoute('pony.detail'), "Il n'y pas de route 'pony.detail' déclarée dans le router.");

                ok (!!appRouter.router.recognizer.recognize('/pony/1'),
                    'La propriété path est mal définie sur la route "pony.detail"');

                ok(Em.TEMPLATES['pony/detail'] != undefined, "Le template 'pony/detail' n'est pas déclaré.");

                templateContains('pony/detail', 'name}}', "Le nom n'est pas affiché dans le détail.");
                templateContains('pony/detail', 'type}}', "Le type n'est pas affiché dans le détail.");
                templateContains('pony/detail', 'color}}', "La couleur n'est pas affichée dans le détail.");

                templateContains('index', "{{#link-to'pony.detail'", "Le helper link-to n'est pas utilisé dans le template index.");
            }
        }),
        Tuto.Step.create({
            title: "Créer un lien vers la home",
            detailTemplateName: "tutorial-step-home",
            solutionTemplateName: "tutorial-solution-home",
            test: function () {
                templateContains('application', "{{#link-to", "Le template application ne contient pas de link-to");
                templateContains('application', "{{/link-to}}", "Le template application ne contient pas de link-to");

                templateContains('application', "{{#link-to'index'}}", "link-to doit pointer vers index");
                templateContains('application', "<h1>{{#link-to'index'}}", "link-to doit être entre les h1");

            }
        }),
        Tuto.Step.create({
            title: "Créer une page d'ajout",
            detailTemplateName: "tutorial-step-add",
            solutionTemplateName: "tutorial-solution-add",
            test: function () {
                var appRouter = App.__container__.lookup('router:main');

                templateContains('index', "{{#link-to'pony.add'}}", "Le template index ne contient pas de link-to vers la route pony.add")
                templateContains('index', "{{/link-to}}", "Le template index ne contient pas de link-to vers la route pony.add");

                ok(appRouter.hasRoute('pony.add'), "Il n'y pas de route 'pony.add' déclarée dans le router.");
                ok(Em.TEMPLATES['pony/add'] != undefined, "Le template 'pony/add' n'est pas déclaré.");

                templateContains('pony/add', "{{inputvalue=firstName}}", "Le template add ne contient pas de helper input pour le firstName");
                templateContains('pony/add', "{{inputvalue=lastName}}", "Le template add ne contient pas de helper input pour le lastName");
                templateContains('pony/add', "{{inputvalue=color}}", "Le template add ne contient pas de helper input pour le color");
                templateContains('pony/add', "{{inputvalue=type}}", "Le template add ne contient pas de helper input pour le type");

                ok(Em.typeOf(App.PonyAddRoute) == 'class', "App.PonyAddRoute n'est pas définie ou n'est pas une classe Ember.");

                var ponyAddRoute = App.__container__.lookup("route:ponyAdd");

                ok(!!ponyAddRoute, "App.PonyAddRoute App.PonyAddRoute est mal définie.");

                ok(ponyAddRoute instanceof Em.Route, "App.PonyAddRoute n'est pas de type Ember.Route");
                var model = ponyAddRoute.model();
                ok(!Em.isNone(model),
                    "La méthode 'model' de App.PonyAddRoute ne renvoie rien ou n'est pas définie.",
                    function () {
                        model.deleteRecord();
                    }
                );
                ok(!!model.get('id'),
                    "La méthode 'model' de App.PonyAddRoute ne renvois pas d'objet avec un id",
                    function () {
                        model.deleteRecord();
                    }
                );
                model.deleteRecord();

                templateContains('pony/add', "{{action", "Le template add ne contient d'action");
                templateContains('pony/add', "{{actionsavePony", "Le template contient une action mais elle n'appelle pas savePony");


                ok(Em.typeOf(App.PonyRoute) == 'class', "App.PonyRoute n'est pas définie ou n'est pas une classe Ember.");

                var ponyRoute = App.__container__.lookup("route:pony");

                ok(!!ponyRoute, "App.PonyRoute App.PonyRoute est mal définie.");
                ok(ponyRoute instanceof Em.Route, "App.PonyRoute n'est pas de type Ember.Route");

                var save = 0, transitionToRouteCall = 0, goodRoute = false;

                ponyRoute.transitionTo = function (route) {
                    transitionToRouteCall++;
                    goodRoute = route == "index";
                };
                var pony = Em.Object.create({save: function () {
                    save++
                }});

                ponyRoute.send('savePony', pony);

                ok(save == 1, "La méthode de pony doit être appelé une fois dans savePony");
                ok(transitionToRouteCall == 1, "transitionTo doit être appelé une fois dans savePony");
                ok(goodRoute, "transitionTo doit être appelé avec comme paramètre index pour retourner sur l'index de l'application.");
            }
        }),
        Tuto.Step.create({
            title: "Utiliser l'API Rest",
            detailTemplateName: "tutorial-step-rest",
            solutionTemplateName: "tutorial-solution-rest",
            test: function () {
                ok(typeof App.ApplicationAdapter === "undefined",
                    "App.ApplicationAdapter ne doit plus être défini");
            }
        }),
        Tuto.Step.create({
            title: "Utiliser un Helper",
            detailTemplateName: "tutorial-step-helper",
            solutionTemplateName: "tutorial-solution-helper",
            test: function () {
                var helpers = Em.Handlebars.helpers;
                ok(helpers.upperCase != undefined, "Le helper 'upperCase' n'est pas définie.");
                ok(helpers.upperCase._rawFunction('salut') === "SALUT", "Le helper 'upperCase' doit retourner la chaine passée en argument en majuscule");

                templateContains("pony/detail", "{{upperCase", "Le helper upperCase n'est pas utilisé dans le template detail");
            }
        })
    ];
});
