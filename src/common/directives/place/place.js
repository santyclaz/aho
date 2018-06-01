/**
 * Place
 */

(function() {
	"use strict";

	var module = angular.module("caa.common.directives.place", []);

	module.directive("place", function() {
		var templateUrl = "common/directives/place/place.html";

		return {
			restrict: "EA",
			scope: {
				place: "=ngModel",
			},
			templateUrl: templateUrl,
		};
	});
})();
