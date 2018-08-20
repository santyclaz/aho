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

async function register(
	server,
	// options
	{
		rootDir, // required, path to client root dir
		index = "index.html",
		livereload = true,
		spa = true,
	} = {}
) {
	/**
	 * Process options
	 */

	if (rootDir === undefined) {
		throw new Error(`rootDir option is required`);
	} else if (typeof rootDir !== "string") {
		throw new Error(
			`Invalid rootDir option "${rootDir}", expected to be of type string`
		);
	}
	if (typeof index !== "string") {
		throw new Error(
			`Invalid index option "${index}", expected to be of type string`
		);
	}

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
				path: rootDir,
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
				return h.file(rootDir + "/" + index);
			}
		}

		// TODO: inject livereload js

		return h.continue;
	}
}
