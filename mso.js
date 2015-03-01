define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "Plugin", "commands", "ui", "menus", "c9", "Panel", "preferences", "settings",
        "tree"
    ];
    main.provides = ["mso"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var menus = imports.menus;
        var Panel = imports.Panel;
        var tree = imports.tree;

        var commands = imports.commands;
        var settings = imports.settings;
        var prefs = imports.preferences;

        var plugin = new Plugin("mequanta.com", main.consumes);
        var emit = plugin.getEmitter();

        var loaded = false;
        var loggedIn = false;

        var showing;

        function load() {
            if (loaded) return false;
            loaded = true;

            var dep = require("./dep.js");
            console.log(dep);

            menus.setRootMenu("Quant", 450, plugin);
            menus.addItemByPath("Quant/Developer2", null, 4500, plugin);

            commands.addCommand({
                name: "mycommand",
                bindKey: { mac: "Command-I", win: "Ctrl-I" },
                isAvailable: function(){ return true; },
                exec: function() {
                    showing ? hide() : show();
                }
            }, plugin);

            menus.addItemByPath("Tools/My Menu Item", new ui.item({
                command: "mycommand"
            }), 300, plugin);

            settings.on("read", function(e){
                settings.setDefaults("user/my-plugin", [
                    ["first", "1"],
                    ["second", "all"]
                ]);
            });


            commands.addCommand({
                name: "toggleSolution",
                exec: function() {
                  //  toggleOpenfiles();
                }
            }, plugin);

            tree.getElement("mnuFilesSettings", function(settings){
                ui.insertByIndex(settings, new ui.item({
                    caption: "Show Solution",
                    type: "check",
                    checked: "user/openfiles/@show",
                }), 290, plugin);
                ui.insertByIndex(settings, new ui.divider(), 285, plugin);
            });

            prefs.add({
                "Example" : {
                    position: 450,
                    "My Plugin" : {
                        position: 100,
                        "First Setting": {
                            type: "checkbox",
                            setting: "user/my-plugin/@first",
                            position: 100
                        },
                        "Second Setting": {
                            type: "dropdown",
                            setting: "user/my-plugin/@second",
                            width: "185",
                            position: 200,
                            items: [
                                { value: "you", caption: "You" },
                                { value: "me", caption: "Me" },
                                { value: "all", caption: "All" }
                            ]
                        }
                    }
                }
            }, plugin);
        }

        var drawn = false;
        function draw() {
            if (drawn) return;
            drawn = true;

            // Insert HTML
            var markup = require("text!./mso.html");
            ui.insertHtml(document.body, markup, plugin);

            markup = require("text!./mso.xml");
            ui.insertMarkup(null, markup, solution);

            // Insert CSS
            ui.insertCss(require("text!./style.css"), options.staticPrefix, plugin);

            emit("draw");
        }

        /***** Methods *****/

        function show() {
            draw();

            var div = document.querySelector(".helloworld");
            div.style.display = "block";
            div.innerHTML = settings.get("user/my-plugin/@second");

            emit("show");
            showing = true;
        }

        function hide() {
            if (!drawn) return;

            document.querySelector(".helloworld").style.display = "none";

            emit("hide");
            showing = false;
        }

        plugin.on("load", function() {
            load();
        });

        plugin.on("enable", function() {
        });

        plugin.on("disable", function() {
        });

        plugin.on("unload", function() {
            loaded = false;
            drawn = false;
            showing = false;
        });

        plugin.on("draw", function(e) {
            draw();
        });

        plugin.freezePublicAPI({
            get showing(){ return showing; },

            get loggedIn() { return loggedIn; },
            _events: ["draw", "show", "hide"]

        });

        register(null, {
            mso: plugin
        });
    }
});
