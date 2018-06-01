(function() {
	var module = angular.module("caa.views.rsvp", []);

	module.controller("rsvp", RsvpController);

	RsvpController.$inject = ["$scope", "api.RSVP"];
	function RsvpController($scope, ApiRSVP) {
		var form = {
			name: {
				value: null,
			},
			attending: {
				value: null,
				options: ["certainly", "sadly not"],
				select: function(option) {
					form.attending.value = option;
				},
				isTrue: function() {
					var attending = form.attending.value === "certainly";
					return attending;
				},
			},
			inviteCount: {
				value: null,
				selected: null,
				options: [
					{
						value: 1,
						label: "my awesome self",
					},
					{
						value: 2,
						label: "1 additional guest",
					},
					{
						value: 3,
						label: "2 additional guests",
					},
					{
						value: 4,
						label: "3 additional guests",
					},
					{
						value: 5,
						label: "4 additional guests",
					},
				],
				select: function(option) {
					form.inviteCount.selected = option;
					form.inviteCount.value = option.value;

					var guestCount = form.inviteCount.value - 1;
					var currGuests = form.guests.value;
					var newGuests = [],
						guest;
					for (var i = 0; i < guestCount; i++) {
						if (i in currGuests) {
							guest = currGuests[i];
						} else {
							guest = { name: "" };
						}
						newGuests.push(guest);
					}
					form.guests.value = newGuests;
				},
			},
			guests: {
				value: [],
			},
			action: {
				value: null,
			},
			song: {
				value: null,
			},
			comments: {
				value: null,
			},
		};

		$scope.form = form;

		$scope.saving = false;
		$scope.rsvpSent = false;

		/**
		 *	Methods
		 */

		$scope.submit = submit;

		/**
		 *	Method definitions
		 */

		function submit(form) {
			var attendingFilled = $scope.form.attending.value !== null; // TODO: integrate with ngModel
			if (!$scope.saving && form.$valid && attendingFilled) {
				$scope.saving = true;

				var formVals = getFormValues();
				ApiRSVP.save(formVals)
					.then(function(httpResponse) {
						var response = httpResponse.data;
						$scope.rsvpSent = true;
					})
					.finally(function() {
						$scope.saving = false;
						$scope.rsvpSent = true;
					});
			}
		}

		function getFormValues() {
			var formValues = {};
			Object.keys(form).forEach(function(key) {
				var formFieldObj = form[key];
				formValues[key] = formFieldObj.value;
			});
			return formValues;
		}
	}
})();
