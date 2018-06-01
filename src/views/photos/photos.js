(function() {
	var module = angular.module("caa.views.photos", []);

	module.controller("photos", PhotosController);

	PhotosController.$inject = ["$scope", "api.Instagram"];
	function PhotosController($scope, ApiInstagram) {
		/**
		 *	Init
		 */

		$scope.photos = [];
		getPhotos();

		/**
		 *	Methods
		 */

		$scope.getPhotos = getPhotos;
		$scope.openGallery = openGallery;

		/**
		 *	Method definitions
		 */

		function getPhotos() {
			ApiInstagram.get().then(function(httpResponse) {
				var response = httpResponse.data;
				var photos = response.data;

				$scope.photos = photos;
			});
		}

		function openGallery() {}
	}
})();
