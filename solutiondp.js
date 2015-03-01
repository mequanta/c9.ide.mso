define(function(require, exports, module) {
    var oop = require("ace/lib/oop");
    var BaseClass = require("ace_tree/data_provider");

    function DataProvider(root) {
        BaseClass.call(this, root || {});

        this.rowHeight = 19;
        this.rowHeightInner = 18;

        Object.defineProperty(this, "loaded", {
            get: function() { return this.visibleItems.length; }
        });
    }

    oop.inherits(DataProvider, BaseClass);

    (function() {
    }).call(DataProvider.prototype);

    return DataProvider;
});
