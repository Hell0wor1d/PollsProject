/**
 * Created by kev7n on 14-5-18.
 */


angular.module('pollServices', ['ngResource']).
    factory('Poll', function($resource) {
        return $resource('polls/:pollId', {}, {
            query: { method: 'GET', params: { pollId: 'polls' }, isArray: true }
        })
    });