"use strict";

module.exports = function(vfs, options, register) {
    console.log(vfs);
    var owin = require("connect-owin");

    register(null, {
        greet: function(callback) {    
            console.log(owin);
            console.log("server greeting");
        }
    });
};

