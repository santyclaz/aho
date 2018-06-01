"use strict";

const fs = require("fs");
const path = require("path");

const _ = require("lodash");
const Hapi = require("hapi");
const jsonfile = require("jsonfile");
const Promise = require("bluebird");
const reload = require("require-reload")(require);

const defaultOpts = {
	host: "localhost",
	port: 7070,
	api: {
		rootDir: "",
		routesDir: "api",
		libDir: "lib",
		configDir: "config",
		baseUrl: "api",
	},
	client: {
		rootDir: "src",
		livereload: true,
	},
};

/**
 * Constructor definition
 */

function Server() {
	this.config = {};

	// internal attributes
	this.server = null;
	this.startedPromise = null;
	this.stoppedPromise = null;
	this.restartPromise = null;
	this.internalState = Server.State.STOPPED;

	this.startUpApiConfig = null;
}

/**
 * Static variables & functions
 */

// Status is derived from interal attributes
Server.Status = {
	STARTING: "STARTING",
	STARTED: "STARTED",
	STOPPING: "STOPPING",
	STOPPED: "STOPPED",
	RESTARTING: "RESTARTING",
};

// State is are atomic values that are not derived
Server.State = {
	STARTING: "STARTING",
	STARTED: "STARTED",
	STOPPING: "STOPPING",
	STOPPED: "STOPPED",
};

Server.getInvalidStatusErrorMessage = function(status) {
	switch (status) {
		case Server.Status.STARTING:
			return "Server is in the middle of starting up";
		case Server.Status.STARTED:
			return "Server is already started";
		case Server.Status.STOPPING:
			return "Server is in the middle of stopping";
		case Server.Status.STOPPED:
			return "Server is already stopped";
		case Server.Status.RESTARTING:
			return "Server is in the middle of restarting";
		default:
			return 'Server is in unknown status "' + status + '"';
	}
};

/**
 * Instance methods
 */

Server.prototype.getStatus = function() {
	if (this.restartPromise !== null) {
		return Server.Status.RESTARTING;
	}
	switch (this.internalState) {
		case Server.State.STARTING:
			return Server.Status.STARTING;
		case Server.State.STARTED:
			return Server.Status.STARTED;
		case Server.State.STOPPING:
			return Server.Status.STOPPING;
		case Server.State.STOPPED:
			return Server.Status.STOPPED;
	}
};

Server.prototype.start = async function(config) {
	// Doing this check here since there shouldn't be state cleanup in this scenario
	if (this.getStatus() !== Server.Status.STOPPED) {
		let msg = Server.getInvalidStatusErrorMessage(this.getStatus());
		throw new Error(msg);
	}

	try {
		await this.__startRaw(config);
	} catch (e) {
		// do state cleanup on unexpected failure
		this.reset();
		throw e;
	}

	return this;
};
Server.prototype.__startRaw = async function(config) {
	this.internalState = Server.State.STARTING;

	// process options
	// if new set of configs provided, override current
	if (config) {
		this.config = _.extend({}, config);
	}
	let { host = defaultOpts.host, port = defaultOpts.port } = this.config;

	// validation
	if (typeof port !== "number") {
		throw Error('Invalid port "' + port + '"');
	}

	// create a server with a host and port
	this.server = new Hapi.Server({
		host: host,
		port: port,
	});

	// register API if set
	if ("api" in this.config) {
		let apiConfig = _.extend({}, defaultOpts.api, this.config.api);
		let apiDirs = new ApiDirs(apiConfig);
		let baseUrl = apiConfig.baseUrl;

		this.startUpApiConfig = apiConfig;

		// pull in configs
		registerConfigs(this.server, apiDirs.config);
		// register lib plugins
		await registerLibPlugins(this.server, apiDirs.lib);
		// register API endpoints
		await registerApiEndpoints(this.server, apiDirs.routes, baseUrl);
	}

	// register client if set
	if ("client" in this.config) {
		let clientConfig = _.extend({}, defaultOpts.client, this.config.client);

		// register client routes
		await this.server.register({
			plugin: reload("./client"),
			options: clientConfig,
		});
	}

	// start the server
	this.startedPromise = this.server.start().then(() => {
		// console.log('Server started -', server.info.uri);
		this.internalState = Server.State.STARTED;
	});

	await this.startedPromise;
};

Server.prototype.stop = async function() {
	// Doing this check here since there shouldn't be state cleanup in this scenario
	if (this.getStatus() !== Server.Status.STARTED) {
		let msg = Server.getInvalidStatusErrorMessage(this.getStatus());
		throw new Error(msg);
	}

	try {
		await this.__stopRaw();
	} catch (e) {
		// do state cleanup on unexpected failure
		this.internalState = Server.Status.STARTED;
		throw e;
	}

	return this;
};
// stop without auto-cleanup on error
Server.prototype.__stopRaw = async function() {
	this.internalState = Server.State.STOPPING;

	this.stoppedPromise = this.server.stop().then(() => {
		// console.log('Server stopped -', server.info.uri);
		this.reset();
	});

	await this.stoppedPromise;
};

Server.prototype.restart = async function(config) {
	if (this.getStatus() === Server.Status.RESTARTING) {
		let msg = Server.getInvalidStatusErrorMessage(this.getStatus());
		throw new Error(msg);
	}

	// if new set of configs provided, override current
	if (config) {
		this.config = _.extend({}, config);
	}

	let stoppedPromise;
	if (this.getStatus() === Server.Status.STARTING) {
		stoppedPromise = this.startedPromise.then(() => {
			this.stop();
		});
	} else if (this.getStatus() === Server.Status.STARTED) {
		stoppedPromise = this.stop();
	} else if (this.getStatus() === Server.Status.STOPPING) {
		stoppedPromise = this.stoppedPromise;
	} else if (this.getStatus() === Server.Status.STOPPED) {
		stoppedPromise = Promise.resolve();
	}

	this.restartPromise = stoppedPromise
		// calling __startRaw() intead of start() to ignore status constraint
		.then(() => this.__startRaw())
		.finally(() => {
			this.restartPromise = null;
		});

	await this.restartPromise;
	return this;
};

Server.prototype.getUri = function() {
	if (this.getStatus() !== Server.Status.STARTED) {
		let msg = Server.getInvalidStatusErrorMessage(this.getStatus());
		throw new Error(msg);
	}
	return this.server.info.uri;
};

Server.prototype.getStartUpApiConfig = function() {
	if (this.getStatus() !== Server.Status.STARTED) {
		let msg = Server.getInvalidStatusErrorMessage(this.getStatus());
		throw new Error(msg);
	}
	return this.startUpApiConfig;
};

// reset internal state
Server.prototype.reset = function() {
	this.server = null;
	this.startedPromise = null;
	this.stoppedPromise = null;
	this.internalState = Server.State.STOPPED;
};

/**
 *	Helper functions
 */

// Constructor function for API Directory path information
function ApiDirs({
	rootDir = "",
	routesDir = "api",
	libDir = "lib",
	configDir = "config",
} = {}) {
	// TODO: make attributes readonly
	this.rootDir = rootDir;
	this.routesDir = routesDir;
	this.libDir = libDir;
	this.configDir = configDir;

	// accessor methods
	Object.defineProperty(this, "root", {
		get: () => {
			let root = this.rootDir;
			if (
				typeof root === "string" &&
				root.length > 0 &&
				root.trim() !== "." &&
				root.slice(-1) !== "/"
			) {
				root += "/";
			}
			return root;
		},
	});
	Object.defineProperty(this, "routes", {
		get: () => {
			return this.root + this.routesDir;
		},
	});
	Object.defineProperty(this, "lib", {
		get: () => {
			return this.root + this.libDir;
		},
	});
	Object.defineProperty(this, "config", {
		get: () => {
			return this.root + this.configDir;
		},
	});
}

// function to register all API files in given rootDir
// endpoints will be namespaced under given rootUrlPath
async function registerApiEndpoints(server, rootDir, rootUrlPath) {
	let API_DIR = rootDir;
	let API_URL_PATH = rootUrlPath;

	// guarantee trailing slash in API_DIR
	if (rootDir.slice(-1) !== "/") {
		API_DIR = rootDir + "/";
	}

	// guarantee leading slash in API_URL_PATH
	if (rootUrlPath.slice(0) !== "/") {
		API_URL_PATH = "/" + rootUrlPath;
	}

	let apis = fs.readdirSync(API_DIR);
	for (let api of apis) {
		let apiPath = API_DIR + api;
		// register all *.js files in API_DIR
		if (apiPath.match(/.*\.js$/)) {
			apiPath = path.resolve(apiPath); // turn into absolute path
			await server.register(reload(apiPath), {
				routes: {
					prefix: API_URL_PATH,
				},
			});
		}
	}
}

// function to register all lib files
async function registerLibPlugins(server, rootDir) {
	let LIB_DIR = rootDir;

	// guarantee trailing slash in LIB_DIR
	if (rootDir.slice(-1) !== "/") {
		LIB_DIR = rootDir + "/";
	}

	let plugins = fs.readdirSync(LIB_DIR);
	for (let plugin of plugins) {
		let pluginPath = LIB_DIR + plugin;
		// register all *.js files in LIB_DIR
		if (pluginPath.match(/.*\.js$/)) {
			pluginPath = path.resolve(pluginPath); // turn into absolute path
			await server.register(reload(pluginPath));
		}
	}
}

// registers config accessor function at server.app.config.get(key:string)
function registerConfigs(server, rootDir) {
	let CONFIG_DIR = rootDir;

	// guarantee trailing slash in CONFIG_DIR
	if (rootDir.slice(-1) !== "/") {
		CONFIG_DIR = rootDir + "/";
	}

	let configs = fs.readdirSync(CONFIG_DIR);
	let configsMap = {};

	configs.forEach(function register(config) {
		let configPath = CONFIG_DIR + config,
			filename;
		// register all *.json files in CONFIG_DIR
		if (configPath.match(/.*\.json$/)) {
			configPath = path.resolve(configPath); // turn into absolute path
			filename = path.basename(configPath, ".json");

			// register config accessor function
			configsMap[filename] = function getConfig() {
				let configObj = jsonfile.readFileSync(configPath);
				return configObj;
			};
		}
	});

	server.app.config = {
		get: function(key) {
			return configsMap[key]();
		},
	};
}
function onRegisterConfigsError(e) {
	if (e) {
		throw e;
	}
}

/**
 * Exports
 */

module.exports = new Server();
