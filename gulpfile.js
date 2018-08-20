"use strict";

/**
 *	Includes
 */

const path = require("path");

// gulp & task utilities
const gulp = require("gulp");
const argv = require("yargs").argv;

// dev dependencies
const gulpif = require("gulp-if");
const watch = require("gulp-watch");
const plumber = require("gulp-plumber");
// styles
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
// es6
const traceur = require("gulp-traceur");

/**
 * Env
 */

const ENV = {
	api: {
		rootDir: "backend",
	},
	client: {
		rootDir: "src",
	},
};

ENV.client.assetsDir = ENV.client.rootDir + "/assets";
ENV.client.stylesDir = ENV.client.assetsDir + "/styles";
ENV.client.commonDir = ENV.client.rootDir + "/common";
ENV.client.viewsDir = ENV.client.rootDir + "/views";

/**
 *	Tasks
 */

gulp.task("default", function defaultTask() {
	// place code for your default task here
});
gulp.task("serve", serveTask);
gulp.task("watch:api", watchApiTask);
gulp.task("sass", sassTask);
gulp.task("watch:sass", watchSassTask);

/**
 *	Task defitions
 */

async function serveTask() {
	var config = serveTask.config;

	// TODO: look into usage & demand npm packages for config

	// port option
	if (argv.port !== undefined) {
		config.port = argv.port;
	} else if (argv.p !== undefined) {
		config.port = argv.p;
	}

	var server = getServer();
	await server.start(config);

	// TODO: livereload
	// TODO: auto browser open

	console.log(`Server started: ${server.getUri()}`);
	console.log(server.getStartUpApiConfig());

	// watch option
	if (argv.w !== undefined) {
		watchApiTask();
		watchSassTask();
	}
}
serveTask.config = {
	api: ENV.api,
	client: ENV.client,
};

function watchApiTask() {
	var config = watchApiTask.config;
	return observe(config.src, function() {
		// TODO: handle restart error
		// TODO: queue up changes (gulp-batch)
		getServer()
			.restart()
			.then((server) => {
				console.log(`Server restarted: ${server.getUri()}`);
				console.log(server.getStartUpApiConfig());
			})
			.catch((e) => {
				console.log(e);
			});
	});
}
watchApiTask.config = {
	src: [ENV.api.rootDir + "/**/*", "!" + ENV.api.rootDir + "/server.js"],
};

function sassTask() {
	return compileSass();
}

function watchSassTask() {
	return compileSass(true);
}

function compileSass(startWatch) {
	var config = compileSass.config;
	var stream;

	if (startWatch === true) {
		stream = observe(config.src);
		// TODO: support matching scss change triggering other scss recompiles
	} else {
		stream = gulp.src(config.src);
	}

	return (
		stream
			// run Sass + sourcemaps
			.pipe(sourcemaps.init())
			.pipe(sass(config.sassOpts))
			.pipe(sourcemaps.write())
			// write the resulting CSS to dest
			.pipe(gulp.dest(config.dest))
	);
}
compileSass.config = {
	src: [
		ENV.client.stylesDir + "/*.scss",
		ENV.client.commonDir + "/directives/**/*.scss",
		ENV.client.viewsDir + "/**/*.scss",
	],
	dest: function(file) {
		// write resulting CSS to same directory
		return file.base;
	},
	sassOpts: {
		includePaths: [ENV.client.stylesDir],
	},
};

/**
 * Helper functions
 */

function getServer() {
	return require("./" + ENV.api.rootDir + "/server.js");
}

function observe(source, callback) {
	console.log("Watching", source);
	return (
		gulp
			.src(source)
			// run plumber + watch
			.pipe(plumber())
			.pipe(
				watch(source, function(vinyl) {
					if (vinyl.event !== undefined) {
						var filePath = path.relative(__dirname, vinyl.path);
						console.log(filePath + " modified...");
						try {
							if (typeof callback === "function") {
								callback(vinyl.path);
							}
						} catch (e) {
							// need this since watch seems to swallow exceptions
							console.log("stack" in e ? e.stack : e);
						}
					}
				})
			)
	);
}
