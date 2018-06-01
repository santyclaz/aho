(function() {
	var module = angular.module("caa.common.services.URI", []);

	/**
	 *	URI
	 */

	module.factory("services.URI", definition);

	definition.$inject = [];
	function definition() {
		/**
		 *	API
		 */

		var API = {
			isValid: isValid,
			addQueryParams: addQueryParams,
			toQueryString: toQueryString,
			parseQueryString: parseQueryString,
		};

		/**
		 *	Method definitions
		 */

		// http://stackoverflow.com/a/14582229
		function isValid(str, requireProtocol) {
			var pattern = new RegExp(
				"^(https?:\\/\\/)" +
				(requireProtocol ? "" : "?") + // protocol
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
				"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
				"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
					"(\\#[-a-z\\d_]*)?$",
				"i"
			); // fragment locator
			return pattern.test(str);
		}

		function addQueryParams(string, paramsObj) {
			var result = string;

			var queryStr = toQueryString(paramsObj);

			if (queryStr !== "") {
				var qIndex = string.indexOf("?");

				// if string contains ?
				if (qIndex > -1) {
					// if ? isn't at very end of string
					if (qIndex !== string.length - 1) {
						result += "&";
					}
					result += queryStr;
				}
				// if string doesn't have ?
				else {
					result += "?" + queryStr;
				}
			}

			return result;
		}

		function toQueryString(paramsObj) {
			var queryStr = "";
			var params = Object.keys(paramsObj);
			var paramCount = params.length;

			params.forEach(function(key, index) {
				var param = key + "=" + paramsObj[key];
				queryStr += param;
				if (paramCount > 1 && index < paramCount - 1) {
					queryStr += "&";
				}
			});

			return queryStr;
		}

		// http://stackoverflow.com/a/2880929
		function parseQueryString(string) {
			var urlParams = {},
				match,
				pl = /\+/g, // Regex for replacing addition symbol with a space
				search = /([^&=]+)=?([^&]*)/g,
				decode = function(s) {
					return decodeURIComponent(s.replace(pl, " "));
				};

			while ((match = search.exec(query)) !== null) {
				urlParams[decode(match[1])] = decode(match[2]);
			}

			return urlParams;
		}

		return API;
	}
})();
