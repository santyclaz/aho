"use strict";

const rp = require("request-promise");

/**
 * hapi plugin definition
 */

const plugin = {
	name: "rsvp",
	dependencies: "Response",
	register: register,
};
module.exports = plugin;

/**
 * Route definitions
 */

function register(server, options) {
	server.route({
		method: "POST",
		path: "/rsvp",
		handler: function(request, h) {
			var config = server.app.config.get("google-form");
			var q = request.parma;
			var payload = request.payload;
			transformFormParams(payload); // transform before turning into googleFormObj

			var formUrl = config.formUrl;
			var googleFormObj = toGoogleFormKeys(payload, config.formKeyMappings);

			var options = {
				method: "POST",
				uri: formUrl,
				form: googleFormObj,
			};

			// Send off request to Instagram API
			var responsePromise = rp(options).then(
				function(responseBody) {
					var endpointResponse = request.success(googleFormObj);
					return endpointResponse;
				},
				function(error) {
					var endpointResponse = request.error(googleFormObj);
					return endpointResponse;
				}
			);

			return responsePromise;
		},
	});
}

/**
 *	Helper methods
 */

function toGoogleFormKeys(params, googleFormKeyMap) {
	var result = {};

	var keys = Object.keys(params),
		gkey;
	keys.forEach(function(key, i) {
		gkey = key in googleFormKeyMap ? googleFormKeyMap[key] : null;
		if (gkey) {
			result[gkey] = params[key];
		}
	});

	return result;
}

// this effects the original object
function transformFormParams(params) {
	if ("guests" in params) {
		var guests = params.guests,
			guestKey;
		guests.forEach(function(guest, i) {
			guestKey = "guest" + (i + 1);
			params[guestKey] = guest.name;
		});
		delete params.guests;
	}
}
