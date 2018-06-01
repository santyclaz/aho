(function() {
	var module = angular.module("caa.common.api.Instagram", []);

	/**
	 *	API Instagram
	 */

	module.factory("api.Instagram", definition);

	definition.$inject = ["$http", "services.URI"];
	function definition($http, URI) {
		/**
		 *	API
		 */

		var API = {
			get: get,
		};

		/**
		 *	Method definitions
		 */

		function get(params) {
			var url = "api/instagram";
			var queryParams = angular.extend({}, params);
			url = URI.addQueryParams(url, queryParams);

			return $http.get(url);
		}

		return API;
	}
})();
