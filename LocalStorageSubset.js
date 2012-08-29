define([
    "dojo/_base/declare",
    "dojo/_base/json",
    "./LocalStorage"
], function (
    declare,
    json,
    LocalStorage
) {
    //"use strict";
    return declare([LocalStorage], {

        subsetProperty: "localStorageSubsetName",
        subsetName: "localStorageDefaultSubset",

        get: function (id) {
            var object = this.inherited(arguments);

            if (object && object[this.idProperty] && object[this.subsetProperty] && object[this.subsetProperty] === this.subsetName) {
                delete object[this.subsetProperty];
                return object;
            }

            return null;
        },
        
        put: function (object, options) {
            var id = options && options.id || object[this.idProperty] || Math.random();
            object[this.idProperty] = id;
            object[this.subsetProperty] = this.subsetName;
            localStorage.setItem(id, json.toJson(object));
            return id;
        }
    });
});