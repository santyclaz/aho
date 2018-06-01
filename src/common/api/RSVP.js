(function() {
	var module = angular.module("caa.common.api.RSVP", []);

	/**
	 *	API RSVP
	 */

	module.factory("api.RSVP", definition);

	definition.$inject = ["$http"];
	function definition($http) {
		/**
		 *	API
		 */

		var API = {
			save: save,
		};

		/**
		 *	Method definitions
		 */

		function save(formValues) {
			var url = "api/rsvp";
			return $http.post(url, formValues);
		}

		return API;
	}
})();
