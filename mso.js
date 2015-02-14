define(function(require, exports, module) {
    main.consumes = ["Plugin", "commands", "ui", "menus"];
    main.provides = ["mso"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var ui = imports.ui;
        var menus = imports.menus;

        var plugin = new Plugin("mequanta.com", main.consumes);
        var loaded = false;

        function load() {
            if (loaded) return false;
            loaded = true;

            menus.addItemByPath("Tools/~", new ui.divider(), 110000, plugin);
            menus.addItemByPath("Tools/Developer2", null, 110100, plugin);
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
        });
        
        plugin.freezePublicAPI({
            _events: ["draw"]
        });
        
        register(null, {
            mso: plugin
        });
    }
});
