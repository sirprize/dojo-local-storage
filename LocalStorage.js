define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/json",
    "dojo/store/util/QueryResults",
    "dojo/store/util/SimpleQueryEngine"
], function (
    declare,
    lang,
    json,
    QueryResults,
    SimpleQueryEngine
) {
    //"use strict";
    return declare(null, {

        // idProperty: String
        //      Indicates the property to use as the identity property. The values of this
        //      property should be unique.
        idProperty: "id",

        // queryEngine: Function
        //      Defines the query engine to use for querying the data store
        queryEngine: SimpleQueryEngine,

        constructor: function (options) {
            // summary:
            //      localStorage based object store.
            // options:
            //      This provides any configuration information that will be mixed into the store.
            //      This should generally include the data property to provide the starting set of data.
            lang.mixin(this, options);
            this.setData(this.data || []);
        },

        get: function (id) {
            // summary:
            //      Retrieves an object by its identity
            // id: Number
            //      The key of the key/value pair as stored in localStorage
            //      ##The identity to use to lookup the object
            // returns: Object
            //      The value in the store that matches the given id (key).

            if (id === undefined) {
                return null;
            }

            var item = localStorage.getItem(id);

            try {
                return json.fromJson(item);
            } catch(e) {
                return item;
            }
        },

        getIdentity: function (object) {
            // summary:
            //      Returns an object's identity
            // object: Object
            //      The object to get the identity from
            // returns: Number
            return object[this.idProperty];
        },

        put: function (object, options) {
            // summary:
            //      Stores an object
            // object: Object
            //      The object to store.
            // options: Object?
            //      Additional metadata for storing the data. Includes an "id"
            //      property if a specific id is to be used.
            // returns: Number
            var id = options && options.id || object[this.idProperty] || Math.random();
            localStorage.setItem(id, json.toJson(object));
            return id;
        },

        add: function (object, options) {
            // summary:
            // C    reates an object, throws an error if the object already exists
            // object: Object
            //      The object to store.
            // options: Object?
            //      Additional metadata for storing the data. Includes an "id"
            //      property if a specific id is to be used.
            // returns: Number

            if (this.get(object[this.idProperty])) {
                //throw new Error("Object already exists");
            }

            return this.put(object, options);
        },

        remove: function (id) {
            // summary:
            //      Deletes an object by its identity
            // id: Number
            //      The identity to use to delete the object
            localStorage.removeItem(id);
        },

        query: function (query, options) {
            // summary:
            //      Queries the store for objects.
            // query: Object
            //      The query to use for retrieving objects from the store.
            // options: dojo.store.util.SimpleQueryEngine.__queryOptions?
            //      The optional arguments to apply to the resultset.
            // returns: dojo.store.util.QueryResults
            //      The results of the query, extended with iterative methods.
            //
            // example:
            // Given the following store:
            //
            // | var store = new dojo.store.LocalStorage({
            // | data: [
            // | {id: 1, name: "one", prime: false },
            // | {id: 2, name: "two", even: true, prime: true},
            // | {id: 3, name: "three", prime: true},
            // | {id: 4, name: "four", even: true, prime: false},
            // | {id: 5, name: "five", prime: true}
            // | ]
            // | });
            //
            // ...find all items where "prime" is true:
            //
            // | var results = store.query({ prime: true });
            //
            // ...or find all items where "even" is true:
            //
            // | var results = store.query({ even: true });

            var data = [], i = 0, id = null, item = null;

            for (i = 0; i < localStorage.length; i++) {
                id = localStorage.key(i);
                item = this.get(id);

                if (item) {
                    data.push(item);
                }
            }

            return QueryResults(this.queryEngine(query, options)(data));
        },

        setData: function (data) {
            // summary:
            //      Sets the given data as the source for this store, and indexes it
            // data: Object[]
            //      An array of objects to use as the source of data.
            if (data.items) {
                // just for convenience with the data format IFRS expects
                this.idProperty = data.identifier;
                data = this.data = data.items;
            }

            for (var i = 0, l = data.length; i < l; i++) {
                var object = data[i];
                this.put(object);
            }
        },
        
        clear: function () {
            localStorage.clear();
        }
    });
});