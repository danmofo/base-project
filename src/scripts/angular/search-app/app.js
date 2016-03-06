/**
 *  Extremely basic Angular app
 */
var angular = require('angular');
var CONSTANTS = require('./_constants');

angular
  .module(CONSTANTS.APP_NAMESPACE, [])
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
  .component('storefront', {
	  bindings: {
		  title: '@'
	  },
	  controller: ['Api', function(Api) {
		  this.products = Api.get('/api/products/1234');
		  this.items = Api.get('/api/users/1234');

		  this.addItemToBasket = addItemToBasket;

		  function addItemToBasket(product){
			  console.log('Adding ', product);
			  this.items.push(product);
		  }

	  }],
	  controllerAs: 'vm',
	  templateUrl: '/scripts/angular/search-app/views/store-front.html'
	})
  .component('basket', {
	    bindings: {
	        items: '<'
	      },
	      controller: [function(Api, $scope) {
	        this.removeItem = removeItem;
	        this.total = 0;
	        this.recalculateTotal = recalculateTotal;

	        function recalculateTotal() {
	        	var newTotal = 0;

	        	this.items.forEach(function(item) {
	        		newTotal += item.price;
	        	});

	        	this.total = newTotal;

	        	return newTotal;
	        }

	        function removeItem(idx) {
	        	this.items.splice(idx, 1);
	        }
	      }],
	      controllerAs: 'vm',
	      templateUrl: '/scripts/angular/search-app/views/basket.html'
	    });
