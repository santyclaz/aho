(function() {
	var module = angular.module("caa.views.wedding", []);

	module.controller("wedding", WeddingController);

	WeddingController.$inject = ["$scope"];
	function WeddingController($scope) {
		$scope.categories = {
			venue: {
				name: "Ceremony & Reception",
				img: "assets/imgs/wedding/venue.jpg",
				places: [
					{
						name: "Gerry Ranch",
						address: {
							address1: "9015 Rosita Rd.",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93012",
						},
						mapLink: "https://goo.gl/maps/4BsjP17uwTB2",
					},
				],
			},
			schedule: {
				name: "Event Schedule",
				img: "assets/imgs/wedding/schedule.jpg",
			},
			attire: {
				name: "Attire",
				img: "assets/imgs/wedding/attire.jpg",
			},
			hotels: {
				name: "Hotel Accommodations",
				img: "assets/imgs/wedding/hotels.jpg",
				places: [
					{
						name: "Hyatt Westlake Plaza",
						address: {
							address1: "8080 S Westlake Blvd.",
							address2: "",
							city: "Westlake Village",
							state: "CA",
							postalCode: "91361",
						},
						phone: "(805) 557-1234",
						website: {
							url: "http://www.hyattwestlake.com",
							label: "www.hyattwestlake.com",
						},
						// TODO: see if this can be refactored
						reservation: {
							url: "https://resweb.passkey.com/go/leungho",
							price: "$174/night",
						},
					},
					{
						name: "Best Western Plus",
						address: {
							address1: "75 W Thousand Oaks Boulevard",
							address2: "",
							city: "Thousand Oaks",
							state: "CA",
							postalCode: "91360",
						},
						phone: "(805) 497-3701",
						reservation: {
							url:
								"http://bestwesterncalifornia.com/hotels/best-western-plus-thousand-oaks-inn",
						},
					},
					{
						name: "Quality Inn & Suites",
						address: {
							address1: "984 W. Ventura Blvd",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						phone: "(805) 987-4188",
						reservation: {
							url:
								"https://www.choicehotels.com/california/camarillo/quality-inn-hotels/ca132/rates?adults=2&checkInDate=2016-08-06&checkOutDate=2016-08-07",
						},
					},
					{
						name: "Quality Inn & Suites",
						address: {
							address1: "12 Conejo Blvd",
							address2: "",
							city: "Thousand Oaks",
							state: "CA",
							postalCode: "91360",
						},
						phone: "(805) 495-7011",
						reservation: {
							url:
								"https://www.choicehotels.com/california/thousand-oaks/quality-inn-hotels/caa68/rates?checkInDate=2016-08-06&checkOutDate=2016-08-07",
						},
					},
				],
			},
		};
	}
})();
