(function() {
	var module = angular.module("caa.views.todo", []);

	module.controller("todo", PhotosController);

	PhotosController.$inject = ["$scope"];
	function PhotosController($scope) {
		$scope.categories = {
			shopping: {
				name: "Shopping",
				img: "assets/imgs/todo/shopping.jpg",
				places: [
					{
						name: "Camarillo Premium Outlet Mall",
						address: {
							address1: "740 E. Ventura Blvd",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						website: {
							url: "http://premiumoutlets.com/outlet/camarillo",
							label: "premiumoutlets.com/outlet/camarillo",
						},
						description: "Get your shopping on!",
					},
				],
			},
			tasting: {
				name: "Tasting",
				img: "assets/imgs/todo/wine.jpg",
				places: [
					{
						name: "Institution Ale Company",
						address: {
							address1: "438 Calle San Pablo, Unit I",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93012",
						},
						website: {
							url: "http://institutionales.com/home",
							label: "institutionales.com/home",
						},
						description:
							"One of the best breweries in the area. Visit their tasting room and don’t forget to bring your own food.",
					},
					{
						name: "Bella Victorian Wine Tasting",
						address: {
							address1: "2135 Ventura Blvd",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						website: {
							url: "http://www.bellavictorianvineyard.com",
							label: "www.bellavictorianvineyard.com",
						},
						description:
							"This vineyard uses Syrah, Grenache, Counoise and Viognier grapes, handcrafting their wine from vine to bottle.",
					},
					{
						name: "Cantara Cellars",
						address: {
							address1: "126 N Wood Rd",
							address2: "Ste 104",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						website: {
							url: "http://cantaracellars.com",
							label: "cantaracellars.com",
						},
						description:
							'This winery has been praised for their chardonnay and reds, notably the "Intrepid" and "The Bride" wines.',
					},
				],
			},
			fruitPicking: {
				name: "Fruit Picking",
				img: "assets/imgs/todo/fruit-picking.png",
				places: [
					{
						name: "Somis Farm Center",
						address: {
							address1: "5696 Los Angeles Avenue",
							address2: "",
							city: "Somis",
							state: "CA",
							postalCode: "93066",
						},
						website: {
							url: "http://www.underwoodfamilyfarms.com/somis.html",
							label: "www.underwoodfamilyfarms.com/somis.html",
						},
						description: "Pick an assortment of berries and feed farm animals.",
					},
					{
						name: "McGrath Family Farm",
						address: {
							address1: "1012 W Ventura Blvd",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						website: {
							url: "http://www.mcgrathfamilyfarm.com",
							label: "www.mcgrathfamilyfarm.com",
						},
						description: "Grab a basket and pick your own fresh strawberries.",
					},
				],
			},
			museum: {
				name: "Museum",
				img: "assets/imgs/todo/bearcat.png",
				places: [
					{
						name: "WWII Aviation Museum",
						address: {
							address1: "455 Aviation Drive",
							address2: "",
							city: "Camarillo",
							state: "CA",
							postalCode: "93010",
						},
						website: {
							url: "https://www.cafsocal.com",
							label: "www.cafsocal.com",
						},
						description:
							"Check out an interesting collection of WWII vintage airplanes.",
					},
				],
			},
		};
	}
})();
