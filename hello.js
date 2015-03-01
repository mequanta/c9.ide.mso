define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "Plugin", "ui", "editors", "commands", "c9", "Panel", "menus", "tabManager", "Editor",
    ];
    main.provides = ["mso.hello"];
    return main;

    function main(options, imports, register) {
        var Editor = imports.Editor;
        var editors = imports.editors;
        var ui = imports.ui;
        var menus = imports.menus;
        var commands =  imports.commands;
        var tabManager = imports.tabManager;
        var highstock = require("lib/highstock-release/highstock");
     
        var handle = editors.register("hello", "URL Viewer", Hello, []);

        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            menus.setRootMenu("Quant", 450, handle);
            menus.addItemByPath("Quant/~", new ui.divider(), 4510, handle);
            menus.addItemByPath("Quant/Hello", new ui.item({
                command: "openquanthello"
            }), 4520, handle);

            commands.addCommand({
                name: "openquanthello",
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
                if (tab.document.meta.hello) {
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
                editorType: "hello", 
                noanim: true,
                active: true 
            }, cb);
        }

        function Hello() {
            var plugin = new Editor("mequanta.org", main.consumes, []);
            var container;
            var content
            var chart
            plugin.on("draw", function(e) {
                container = e.htmlNode;
                var nodes = ui.insertHtml(container, require("text!./hello.html"), plugin);
                content = container.querySelector("#gapless-chart");
                var node = nodes[0];
                console.log(content);
                console.log(node);
                chart = new Highcharts.Chart({ chart: { renderTo: content.id }  });
            });

            plugin.freezePublicAPI({});
            plugin.load(null, "hello");
            plugin.on("documentLoad", function(e) {
                var doc = e.doc;
                var tab = doc.tab;
                doc.title = "Hello",
                doc.meta.hello = true;
            });

            return plugin;
        }

        register(null, {
            "mso.hello": handle
        });
    }
});
