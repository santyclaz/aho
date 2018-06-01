(function() {
	var module = angular.module("caa.views.navbar", []);

	/**
	 *	Directive
	 */

	module.directive("navbar", function() {
		var TEMPLATE_PATH = "views/navbar/navbar.html";

		var DEFINITION = {
			restrict: "EA",
			templateUrl: TEMPLATE_PATH,
			controller: NavbarController,
			link: function(scope, elem, attr, ctrl) {},
		};

		return DEFINITION;
	});

	/**
	 *	Controller
	 */

	NavbarController.$inject = ["$scope"];
	function NavbarController($scope) {}
})();
