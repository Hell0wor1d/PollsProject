/**
 * Created by kev7n on 14-5-18.
 */
// Angular module, defining routes for the app
angular.module('polls', ['pollServices','ngRoute']).
    config(function ($routeProvider) {
        $routeProvider
            .when('/polls', {
                templateUrl: 'partials/list.html',
                controller: PollListCtrl
            })
            .when('/poll/:pollId', {
                templateUrl: 'partials/item.html',
                controller: PollItemCtrl
            })
            .when('/new', {
                templateUrl: 'partials/new.html',
                controller: PollNewCtrl
            })

            // If invalid route, just redirect to the main list view
            .otherwise({
                redirectTo: '/polls'
            });
    });