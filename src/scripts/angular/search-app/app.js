/**
 *  Extremely basic Angular app
 */
var angular = require('angular');
var CONSTANTS = require('./_constants');

angular
  .module('myApp', [])
  .service('Api', ['$log', function($log) {
    return {
      get: function(url) {
        $log.info(url);
        return [
          {
            id: 1,
            name: 'Apple iPad',
            price: 2000
          },
          {
            id: 2,
            name: 'Apple iPhone',
            price: 1000
          },
          {
            id: 3,
            name: 'Nexus 5',
            price: 50
          }
        ];
      }
    };
  }])
  .component('test', {
    bindings: {
      username: '@'
    },
    controller: ['Api', function(Api) {
      this.items = Api.get('/api/users/1234');
    }],
    controllerAs: 'vm',
    templateUrl: '/scripts/angular/search-app/views/basket.html'
  });
