define(function(require, exports, module) {
    "use strict";

    main.consumes = [
        "ext", "Plugin", "ui", "editors", "commands", "c9", "Panel", "menus",
        "tabManager", "Editor"
    ];
    main.provides = ["mso.hello.owin"];
    return main;

    function main(options, imports, register) {
        var greeting;
        require("lib/owin/jquery.min");
        require("lib/owin/jquery.signalR.min");
        require(["/signalr/hubs"],function(hubs){
            //$.connection.hub.logging = true;

            greeting = $.connection.helloHub;
     //       console.log(greeting);
            greeting.client.sayBack = function(msg) {
                console.log(msg);
            };

            $.connection.hub.start().done(function () {
      //          console.log('SignalR connected [ID=' + $.connection.hub.id + '; Transport = ' + $.connection.hub.transport.name + ']');
            });
        });

        var ext = imports.ext;
        var Editor = imports.Editor;
        var editors = imports.editors;
        var ui = imports.ui;
        var menus = imports.menus;
        var commands =  imports.commands;
        var tabManager = imports.tabManager;

        var api;
        var handle = editors.register("hello1", "URL Viewer", Hello, []);
        
        var loaded = false;
        function load() {
            if (loaded) return false;
            loaded = true;
            
            menus.setRootMenu("Owin", 460, handle);
            menus.addItemByPath("Owin/~", new ui.divider(), 4610, handle);
            menus.addItemByPath("Owin/Hello", new ui.item({
                command: "openhelloowin"
            }), 4620, handle);

            commands.addCommand({
                name: "openhelloowin",
                isAvailable: function() { return true; },
                exec: function() {
                   show();
                 //   console.log(greeting);
                    greeting.server.say("hello")
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
                editorType: "hello1", 
                noanim: true,
                active: true 
            }, cb);
        }

        function Hello() {
            var plugin = new Editor("mequanta.org", main.consumes, []);
            var container;
            plugin.on("draw", function(e) {
                container = e.htmlNode;
                var html = require("text!./hello.html");
                var nodes = ui.insertHtml(container, html, plugin);
                var node = nodes[0];
            });

            plugin.on("load", function() {});
            plugin.freezePublicAPI({});
            plugin.load(null, "hello1");
            plugin.on("documentLoad", function(e) {
                var doc = e.doc;
                var tab = doc.tab;
                doc.title = "Hello1", 
                doc.meta.hello = true;
            });

            return plugin;
        }

        register(null, {
            "mso.hello.owin": handle
        });
    }
});
