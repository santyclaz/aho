/**
 * Address
 */

(function() {
	"use strict";

	var module = angular.module("caa.common.directives.address", []);

	module.directive("address", function() {
		var templateUrl = "common/directives/address/address.html";

		return {
			restrict: "EA",
			scope: {
				address: "=ngModel",
			},
			templateUrl: templateUrl,
		};
	});
})();
