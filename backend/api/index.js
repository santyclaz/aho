"use strict";

/**
 * hapi plugin definition
 */

const plugin = {
	name: "index",
	dependencies: "Response",
	register: register,
};
module.exports = plugin;

/**
 * Route definitions
 */

function register(server, options) {
	var prefix = server.realm.modifiers.route.prefix;

	server.route({
		method: "GET",
		path: "/hello",
		handler: function(request, h) {
			var payload = "hello world";

			var response = request.success(payload);
			return response;
		},
	});

	server.route({
		method: "GET",
		path: "/",
		handler: function(request, h) {
			var payload = "I am the API!";

			var response = request.success(payload);
			return response;
		},
	});

	server.route({
		method: ["GET", "POST", "PUT", "DELETE"],
		path: "/{catchall*}",
		handler: function(request, h) {
			var relativePath = prefix
				? request.path.substring(prefix.length)
				: request.path;
			var payload = "API endpoint '" + relativePath + "' does not exist";

			var response = request.error(payload);
			return response;
		},
	});
}
