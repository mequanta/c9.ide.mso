define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "Plugin", "ui", "tree", "settings", "commands", "c9", "Panel", "menus"
    ];
    main.provides = ["mso.solution"];
    return main;

    function main(options, imports, register) {
        var c9 = imports.c9;
        var Panel = imports.Panel;
        var ui = imports.ui;
        var menus = imports.menus;
        var markup = require("text!./solution.xml");
        var Tree = require("ace_tree/tree");
        var TreeData = require("ace_tree/data_provider");

       var plugin = new Panel("mequanta.com", main.consumes, {
            index: options.index || 200,
            caption: "Solution",
            elementName: "solutionTree",
            minWidth: 130,
            autohide: true,
            where: options.where || "left"
        });
        var emit = plugin.getEmitter();

        var winSolution, solutionTree, tdSolution;
        var treeParent, tree;

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;

            c9.once("ready", function() {});
        }

        var drawn = false;
        function draw(options) {
            if (drawn) return;
            drawn = true;

            ui.insertMarkup(options.aml, markup, plugin);
            winSolution = plugin.getElement("winSolution");
            treeParent = plugin.getElement("solutionTree");

            tree = new Tree(treeParent.$int);
            tree.renderer.setScrollMargin(0, 10);
            tdSolution = new TreeData(["ddd1", "ddd2"]);
            tdSolution.rowHeight = 20;
            tree.setDataProvider(tdSolution);

//            var list = new Tree(solutionTree.$int);
//console.log(solutionTree.$int)
//          //  list.attachTo(winSolution.$int);
//      //      list.setDataProvider({label:"root",            items:[{label:"sub1"},{label:"sub2"}]});
//            list.resize();

         //   list.setDataProvider(dp)
            var mnuCtx = plugin.getElement("mnuCtxSolution");
            menus.decorate(mnuCtx);
            plugin.addElement(mnuCtx);

            menus.addItemToMenu(mnuCtx, new ui.item({
                match: "file",
                class: "strong",
                caption: "Open",
                onclick: function() {}
            }), 100, plugin);

            menus.addItemToMenu(mnuCtx, new ui.item({
                match: "file|folder",
                write: true,
                caption: "Delete",
                onclick: function() {}
            }), 200, plugin);
            menus.addItemToMenu(mnuCtx, new ui.divider({}), 300, plugin);
            menus.addItemToMenu(mnuCtx, new ui.item({
                match: "file|folder",
                write: true,
                command: "cut",
                caption: "Cut"
            }), 400, plugin);
            emit("draw");
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
        });

        plugin.on("draw", function(e) {
            load();
            draw(e);
        });

        plugin.freezePublicAPI({
            _events: ["draw"]
        });

        register(null, {
            "mso.solution": plugin
        });
    }
});
