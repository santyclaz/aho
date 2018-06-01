(function() {
	var module = angular.module("caa.routes", ["ui.router"]);

	module.config([
		"$stateProvider",
		function routes($stateProvider) {
			$stateProvider.state("photos", {
				url: "/photos",
				templateUrl: "views/photos/photos.html",
				controller: "photos",
			});

			$stateProvider.state("story", {
				url: "/story",
				templateUrl: "views/story/story.html",
				controller: "story",
			});

			$stateProvider.state("wedding", {
				url: "/wedding",
				templateUrl: "views/wedding/wedding.html",
				controller: "wedding",
			});

			$stateProvider.state("rsvp", {
				url: "/rsvp",
				templateUrl: "views/rsvp/rsvp.html",
				controller: "rsvp",
			});

			$stateProvider.state("registry", {
				url: "/registry",
				templateUrl: "views/registry/registry.html",
			});

			$stateProvider.state("todo", {
				url: "/todo",
				templateUrl: "views/todo/todo.html",
				controller: "todo",
			});
		},
	]);
})();
