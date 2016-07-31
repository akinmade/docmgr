	angular.module('docApp',['ngRoute','ngSanitize'])
		.directive('myFooter', function(){
			return {
				restrict : 'E',
				templateUrl:'my-footer.html'
				/*controller: function(){
					var cr = {
						'name':'Akinmade Adebayo Luqman',
						'tag':'copyright',
						'year':2016
					},
					controllerAs : 'footers'					
				});*/
			}
		};