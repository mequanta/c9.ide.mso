define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "Plugin", "ui", "util", "tree", "settings", "commands", "c9", "menus"
    ];
    main.provides = ["tree.solution"];
    return main;

    function main(options, imports, register) {
        var c9 = imports.c9;
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var tree = imports.tree;
        var util = imports.util;
        var commands = imports.commands;
        var menus = imports.menus;
        var Tree = require("ace_tree/tree");
        var TreeData = require("ace_tree/data_provider");
        var Tooltip = require("ace_tree/tooltip");

        var plugin = new Plugin("mequanta.com", main.consumes);
        var emit = plugin.getEmitter();

        var part;
        var solutionTree;

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;

        }

        var drawn = false;
        function draw(options) {
            if (drawn) return;
            drawn = true;

            var winOpenfiles = tree.getElement("winOpenfiles");
            var parentNode = tree.getElement("winFilesViewer");
            part = parentNode.insertBefore(new ui.bar({ id: "winSolution" }), winOpenfiles);
            plugin.addElement(part);

            tree.getElement("winSolution", function(winSolution) {
                solutionTree = new Tree({ container:winSolution.$int, height:20 });
                var dp = new TreeData(["ddd","ssss"]);
                dp.rowHeight = 20;
                solutionTree.setDataProvider(dp);
                //solutionTree.resize();
            });
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
            "tree.solution": plugin
        });
    }
});
