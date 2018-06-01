(function() {
	var module = angular.module("caa", [
		// routes
		"caa.routes",
		// app
		"caa.views.navbar",
		"caa.views.photos",
		"caa.views.rsvp",
		"caa.views.story",
		"caa.views.todo",
		"caa.views.wedding",
		// common
		"caa.common.api.Instagram",
		"caa.common.api.RSVP",
		"caa.common.directives.address",
		"caa.common.directives.contenteditable",
		"caa.common.directives.countdown-to",
		"caa.common.directives.photo",
		"caa.common.directives.place",
		"caa.common.services.URI",
		// lib
		"ui.router",
		"ui.bootstrap",
		"tdn.scale-to-fit",
	]);

	// config
	module.config([
		"$urlRouterProvider",
		"$locationProvider", // angular services
		function($urlRouterProvider, $locationProvider) {
			// Default route
			$urlRouterProvider.otherwise("/story");

			// Setting html5Mode
			// NOTE: <base href="..." /> tag needed to simplify things with relative urls
			$locationProvider.html5Mode(true);
		},
	]);

	// run
	module.run([
		"$rootScope", // angular services
		"$state", // lib services
		function($rootScope, $state) {
			// throw exception in $stateChangeError
			$rootScope.$on("$stateChangeError", function(
				e,
				toState,
				toParams,
				fromState,
				fromParams,
				error
			) {
				throw error;
			});
		},
	]);
})();
