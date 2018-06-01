(function() {
	var module = angular.module("caa.views.story", []);

	module.controller("story", StoryController);

	StoryController.$inject = ["$scope"];
	function StoryController($scope) {}
})();
