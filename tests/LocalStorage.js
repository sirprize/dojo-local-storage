define([
    'intern!object',
    'intern/chai!assert',
    'dojo-local-storage/LocalStorage'
], function (registerSuite, assert, LocalStorage) {

    var dumpLocalStorage = function () {
        for (i = 0; i < localStorage.length; i += 1) {
            id = localStorage.key(i);
            data = localStorage.getItem(id);
            console.log('local-storage-id = ' + id + ', data = ' + data);
        }
    }

    var clearLocalStorage = function () {
        localStorage.clear();
    }

    registerSuite({
        name: 'dojo-local-storage/LocalStorage',

        setup: function () {
            //clearLocalStorage();
        },

        teardown: function () {
            //dumpLocalStorage();
        },

        '.get': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        data: [
                            { id: 4, name: 'four', prime: false }
                        ]
                    }),
                    expected = {
                        id: 4,
                        name: 'four',
                        prime: false
                    }
                ;

                assert.deepEqual(store.get(4), expected, 'store should get correct object based on id');
            }
        ],

        '.getIdentity': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        data: [
                            { id: 3, name: 'three', prime: true }
                        ]
                    }),
                    item = store.get(3)
                ;

                assert.strictEqual(store.getIdentity(item), 3, 'identifying property (id) should be returned for item');
            }
        ],

        '.put': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        data: [
                            { id: 4, name: 'four', prime: false }
                        ]
                    }),
                    four = store.get(4),
                    expected = {
                        id: 4,
                        name: 'four',
                        prime: false,
                        square: true
                    }
                ;

                four.square = true;
                store.put(four);

                assert.deepEqual(store.get(4), expected, 'store should have correctly updated object');
            }
        ],

        '.put (no id)': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({}),
                    exception = null
                ;

                try {
                    store.put({});
                } catch(e) {
                    exception = e;
                }

                assert.isObject(exception, 'exception should be thrown when calling put() without id');
            }
        ],

        '.add (manually set id)': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({}),
                    id1 = 6,
                    obj1 = {
                        id: id1,
                        name: 'six'
                    },
                    id2 = '7',
                    obj2 = {
                        id: id2,
                        name: 'seven'
                    },
                    id3 = 0.12345678,
                    obj3 = {
                        id: id3,
                        name: 'asdf'
                    },
                    obj4 = {
                        name: 'asdf'
                    }
                ;

                store.add(obj1);
                store.add(obj2);
                store.add(obj3);

                assert.deepEqual(store.get(id1), obj1, 'new item should be added to the store');
                assert.isNumber(store.get(id1).id, 'id should be a number');
                assert.deepEqual(store.get(id2), obj2, 'new item should be added to the store');
                assert.isString(store.get(id2).id, 'id should be a string');
                assert.deepEqual(store.get(id3), obj3, 'new item should be added to the store');
                assert.isNumber(store.get(id3).id, 'id should be a float');
            }
        ],

        '.add (no id)': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({}),
                    obj = {
                        name: 'object-without-id'
                    }
                ;

                store.add(obj);
            }
        ],

        '.add (throw exception if no id is given)': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        generateIdentity: function () {
                            throw new Error("No Id given");
                        }
                    }),
                    obj = {
                        name: 'object-without-id'
                    }
                ;

                try {
                    store.add(obj);
                } catch(e) {
                    exception = e;
                }

                assert.isObject(exception, 'exception should be thrown when calling add() without id');
            }
        ],

        '.query': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        data: [
                            { id: 1, name: 'one', prime: true },
                            { id: 2, name: 'two', prime: false },
                            { id: 3, name: 'three', prime: true },
                            { id: 4, name: 'four', prime: false },
                            { id: 5, name: 'five', prime: true }
                        ]
                    }),
                    results = store.query({ prime: true })
                ;

                assert.strictEqual(results.length, 3, 'three prime results should be found');
            }
        ],

        '.query (pre-configured data subset)': [
            function () {
                clearLocalStorage();

                var store = new LocalStorage({
                        subsetProperty: 'mySubsetProperty',
                        subsetName: 'movies2',
                        data: [
                            { id: 11, name: 'one', prime: true },
                            { id: 12, name: 'two', prime: false },
                            { id: 13, name: 'three', prime: true },
                            { id: 14, name: 'four', prime: false },
                            { id: 15, name: 'five', prime: true }
                        ]
                    }),
                    results = store.query({ prime: true })
                ;

                assert.strictEqual(results.length, 3, 'three prime results should be found');
            }
        ],

        '.query (query in full data set)': [
            function () {
                clearLocalStorage();

                var store1 = new LocalStorage({
                        data: [
                            { id: 1, name: 'one', prime: true },
                            { id: 2, name: 'two', prime: false },
                            { id: 3, name: 'three', prime: true },
                            { id: 4, name: 'four', prime: false },
                            { id: 5, name: 'five', prime: true }
                        ]
                    }),
                    store2 = new LocalStorage({
                        subsetProperty: 'mySubsetProperty',
                        subsetName: 'movies',
                        data: [
                            { id: 6, name: 'one', prime: true },
                            { id: 7, name: 'two', prime: false },
                            { id: 8, name: 'three', prime: true },
                            { id: 9, name: 'four', prime: false },
                            { id: 10, name: 'five', prime: true }
                        ]
                    }),
                    results = store1.query({ prime: true })
                ;

                //dumpLocalStorage();
                assert.strictEqual(results.length, 6, 'six prime results should be found');
            }
        ]
    });
});