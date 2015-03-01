define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "ui", "editors", "commands", "menus", "tabManager", "Editor",
    ];
    main.provides = ["mso.gapless.chart"];
    return main;

    function main(options, imports, register) {
        var Editor = imports.Editor;
        var editors = imports.editors;
        var ui = imports.ui;
        var menus = imports.menus;
        var commands =  imports.commands;
        var tabManager = imports.tabManager;

        var highstock = require("lib/highstock-release/highstock");
        var handle = editors.register("gapless.chart", "Gapless Chart", GaplessChart, []);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;

            menus.addItemByPath("Quant/~", new ui.divider(), 4530, handle);
            menus.addItemByPath("Quant/Chart(Gapless)", new ui.item({
                command: "opengaplesschart"
            }), 4540, handle);

            commands.addCommand({
                name: "opengaplesschart",
                isAvailable: function() { return true; },
                exec: function() {
                    show();
                }
            }, handle);
        }

        handle.on("load", load);

        function search(){
            var found;
            var tabs = tabManager.getTabs();
            tabs.every(function(tab) {
                if (tab.document.meta["gapless.chart"]) {
                    found = tab;
                    return false;
                }
                return true;
            });
            return found;
        }

        function show(cb) {
            var tab = search();
            if (tab)
                return tabManager.focusTab(tab);

            tabManager.open({
                editorType: "gapless.chart",
                noanim: true,
                active: true
            }, cb);
        }


        function GaplessChart() {
            var plugin = new Editor("mequanta.org", main.consumes, []);
            var container;
            var chart;
            plugin.on("draw", function(e) {
                container = e.htmlNode;
                ui.insertHtml(container, require("text!./gapless.chart.html"), plugin);
                var content = container.querySelector("#gapless-chart");
                chart = new Highcharts.Chart({ chart: { renderTo: content.id } });
            });

            plugin.on("documentLoad", function(e) {
                var doc = e.doc;
                var tab = doc.tab;
                doc.title = "Chart(Gapless)";
                doc.meta["gapless.chart"] = true;
            });

            plugin.freezePublicAPI({});
            plugin.load(null, "gapless.chart");
            return plugin;
        }

        register(null, {
            "mso.gapless.chart": handle
        });
    }
});
