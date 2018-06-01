"use strict";

const inert = require("inert");

/**
 * hapi plugin definition
 */

const plugin = {
	name: "client",
	register: register,
};
module.exports = plugin;

/**
 * Client routing
 */

var defaultOpts = {
	// rootDir: string, // required, path to client root dir
	index: "index.html",
	livereload: true,
	spa: true,
};

async function register(server, options) {
	/**
	 * Process options
	 */

	options = typeof options === "object" ? options : {};

	if (!("rootDir" in options) || typeof options.rootDir !== "string") {
		throw new Error("options.rootDir is required");
	}
	if ("index" in options && typeof options.index !== "string") {
		throw new Error("options.index currently only supports string");
	}

	var path = options.rootDir;
	var index = "index" in options ? options.index : defaultOpts.index;
	var spa = "spa" in options ? options.spa : defaultOpts.spa;

	/**
	 * Serve static files
	 */

	await server.register(inert);

	// UI routes
	server.route({
		method: "GET",
		path: "/{param*}",
		handler: {
			directory: {
				path: path,
				listing: false,
				index: index,
			},
		},
	});

	// For SPA, serve index file if request doesn't resolve to file
	if (spa) {
		server.ext("onPreResponse", onPreResponse);
	}

	/**
	 * Methods
	 */

	function onPreResponse(request, h) {
		var response = request.response;

		// On error
		if (response.isBoom) {
			var statusCode = response.output.statusCode;

			if (statusCode === 404) {
				// h.file(...) decorated by inert
				return h.file(path + "/" + index);
			}
		}

		// TODO: inject livereload js

		return h.continue;
	}
}
