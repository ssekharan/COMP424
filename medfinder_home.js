
var api_key = '7bb72b96bdfea9865f3f539104b810e1'; // Get your API key at developer.betterdoctor.com
var resource_url = 'https://api.betterdoctor.com/2016-03-01/specialties?skip=0&limit=20&user_key=' + api_key;
$.get(resource_url, function (data) {
     data: { meta: {<metadata>}, data: {<array[Specialty]>} }
    var template = Handlebars.compile(document.getElementById('specialty').innerHTML);
    document.getElementById('specialty').innerHTML = template(data);
});
function getDoctors(code) {
	const apiURL = 'https://api.betterdoctor.com/2016-03-01/doctors?';
	// lat & long & radius in miles for 60626
	// const params = 'location=42.010,-87.669,10&limit=5'
	const params = `location=${code}&limit=5`
	const key = '&user_key=7bb72b96bdfea9865f3f539104b810e1';
	const queryURL = apiURL + params + key;
  return fetch(queryURL, {
    headers: new Headers({
      Accept: 'application/json'
    })
  })
  .then(res => res.json());
}



// FN: async/await
async function read(code) {
  try {
    const doctors = await getDoctors(code);
    console.log(`doctors FETCH successful`, doctors);
		return doctors;
  } catch (err) {
    console.log(err);
  }
}

// get state code from search input field & query api
document.querySelector('input[name="search_submit"]').addEventListener('click', () => {
	const code = document.querySelector('input[name="search_query"]').value;

	// query api - practices returned...
	read(code).then(
		// use return data from API query
		(val) => {
			// test doctor data...
			const queryType = val.meta['item_type'];
			// output test query data &c. - basic output to document...
			const queryHeading = document.createElement('h4');
			queryHeading.innerHTML = `Search query = ${queryType}`;
			document.getElementById('page-content').appendChild(queryHeading);
			// log sample data...
			const practiceName = val.data[0]['practices'];
			console.log(...practiceName);
		}
	);
});






//Firebase
const googleProvider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(user) => {
if(user){
  console.log('user logged in');

  else{
    console.log('user logged out');
  }
}};

const startLogin= () => {
  return firebase.auth().signInWithPopup(googleProvider);


};

document.getElementById('submit').addEventListener('click', startLogin);
