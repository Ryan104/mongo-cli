const mongo = require('mongodb').MongoClient; // import mongo
const prompt = require('prompt-sync')(); // import prompt sync - empty () = bring it all in
const url = 'mongodb://localhost:27017/restaurant_db'; // url to access mongos restaurant_db which is running on 27017 when we run mongod
// port is not necessary if you use mogodb instead of http

mongo.connect(url, (err, db) => { // connect node to db
	if (err) console.log(err);

	let collection = db.collection('restaurants'); // store the collection in a variable

	function collectRestaurantInfo(name){
		let newRestaurant = {};
		newRestaurant.address = {};
		if (name) {
			newRestaurant.name = name;
		} else {
			newRestaurant.name = prompt('name: ');
		}
		newRestaurant.address.street = prompt('street: ');
		newRestaurant.address.zipcode = prompt('zip code: ');
		newRestaurant.yelp = prompt('yelp: ');

		return newRestaurant;
	}

	//while (true) {
		console.log('What would you like to do?\n  [a] See one or more restaurants\n  [b] Add a new restaurant\n  [c] Edit a restaurant\n  [d] Delete a restaurant');
		let crudMethod = prompt('>>');
		
		switch (crudMethod.toLowerCase()) {
			case 'a':  // Display one or all of the restaurants
				// Prompt the user for the restaurant name
				console.log('Enter the name of a restaurant or enter "all" to see all the restaurants:');
				let readwhat = prompt('>> ');
				console.log('-- results --');

				// Display all the restaurants if they entered all or display the restaurant with the name the user gave
				if (readwhat.toLowerCase() === 'all'){
					collection.find().toArray((err, docs) => {
						console.log(docs);
					});
				} else {
					collection.find({name: readwhat}).toArray((err, docs) => {
						console.log(docs);
					});
				}
				break;

			case 'b':  // The user can add a new restaurant
				//  Prompt the user for info on a new restaurant and add it to the DB
				console.log('-- Adding a new restaurant --');
				collection.insert(collectRestaurantInfo());
				console.log('Thank you!');
				break;

			case 'c':  // The user can edit a restaurant
				// Prompt the user for the name of the restaurant they would like to edit
				console.log('-- Edit a restaurant --');
				console.log('Enter the name of the restaurant you would like to edit:');
				let edit = prompt('>>');
				console.log('Enter the new properties:');
				// TODO: check if the restaurant actually exists
				collection.updateOne({name: edit}, collectRestaurantInfo(edit));
				console.log('Thank you!');
				break;

			case 'd': // The user can delete a restaurant
				// Prompt the user for the name of the restaurant they want to delete
				console.log('-- Delete a restaurant --');
				console.log('Name the restaurant you would like to delete:');
				let deleteWhat = prompt('>>');
				collection.remove({name: deleteWhat});
				console.log('Its gone');
				break;

			default:
				console.log('That is not a valid response');
		}
	
});
