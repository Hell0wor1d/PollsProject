/**
 * Created by kev7n on 14-5-18.
 */


angular.module('pollServices', ['ngResource'])
    .factory('Poll', function ($resource) {
        return $resource('polls/:pollId', {}, {
            query: { method: 'GET', params: { pollId: 'polls' }, isArray: true },
            remove: { method: "DELETE", params: { pollId: '@pollId' }}
        })
    })
    .factory('socket', function ($rootScope) {
        var socket = io.connect();
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });