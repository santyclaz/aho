(function() {
	"user strict";

	// pulled from https://docs.angularjs.org/api/ng/type/ngModel.NgModelController

	var module = angular.module("caa.common.directives.contenteditable", [
		"ngSanitize",
	]);

	module.directive("contenteditable", [
		"$sce",
		function($sce) {
			return {
				restrict: "A", // only activate on element attribute
				require: "?ngModel", // get a hold of NgModelController
				link: function(scope, element, attrs, ngModel) {
					if (!ngModel) return; // do nothing if no ng-model

					// Specify how UI should be updated
					ngModel.$render = function() {
						element.html($sce.getTrustedHtml(ngModel.$viewValue || ""));
					};

					// Listen for change events to enable binding
					element.on("keyup change", function() {
						scope.$evalAsync(read);
					});
					element.on("focus", function() {
						scope.$evalAsync(function() {
							hidePlaceholder();
							read();
						});
					});
					element.on("blur", function() {
						scope.$evalAsync(function() {
							read();
							showPlaceholder();
						});
					});

					read(); // initialize
					showPlaceholder();

					// Write data to the model
					function read() {
						var html = element.html();
						// When we clear the content editable the browser leaves a <br> behind
						// If strip-br attribute is provided then we strip this out
						if (attrs.stripBr && html == "<br>") {
							html = "";
						}
						ngModel.$setViewValue(html);
					}

					function showPlaceholder() {
						if (!ngModel.$viewValue || ngModel.$viewValue === "") {
							var placeholder = attrs.placeholder ? attrs.placeholder : "";
							element.html(placeholder);
						}
					}
					function hidePlaceholder() {
						if (!ngModel.$viewValue || ngModel.$viewValue === "") {
							element.html("");
						}
					}
				},
			};
		},
	]);
})();
