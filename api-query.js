/*
* api-query.js
* - specialties from API query
* - test query for betterdoctor api
* - async called with sync-like try/catch block
* - 'awaits' return from fetch to local JSON file
*/

/* FN: 'fetch' from JSON - search doctors, specialties &c.
* - n.b. - api key should be stored in env variables, db &c.
* - location should be dynamic - from geolocation, user input &c.
* - code allows user input for state code, e.g CA, IL...
* - specialties query...
*/
function getAPIQuery(get, params) {
	// url for api query
	const apiURL = `https://api.betterdoctor.com/2016-03-01/${get}?`;
	/*
	* api key for developer
	* - use db, env variables &c. to store this key in production app
	*/
	const key = '&user_key=7bb72b96bdfea9865f3f539104b810e1';
	// build query url using passed params...
	const queryURL = apiURL + params + key;
	// query api
  return fetch(queryURL, {
    headers: new Headers({
      Accept: 'application/json'
    })
  })
  .then(res => res.json());
}

// FN: async/await
async function read(get, params) {
  try {
		// await query data from api
    const apiQuery = await getAPIQuery(get, params);
    console.log(`api FETCH successful`, apiQuery);
		return apiQuery;
  } catch (err) {
    console.log(err);
  }
}

/*
* FN: build output
* - element builder with attributes and child elements
* - child nodes may by attributes, elements, text
* - any DOM compatible nodes may be passed...
*/
function elemBuild(type, ...children) {
	// create initial element based on param 'type' - e.g. p, div
  const node = document.createElement(type);
	// iterate any child nodes passed as param
  for (let child of children) {
		// check for array of attributes
		if (Array.isArray(child)) {
			// iterate attributes and values
			for (let attr of child) {
				// set attribtute on current element node
				node.setAttribute(attr[0], attr[1]);
			}
		}
		// if not array or string  - add element node as child
    else if (typeof child != 'string') {
			// append elemnt node
      node.appendChild(child);
    } else {
			// else append text node as content for current node
      node.appendChild(document.createTextNode(child));
    }
  }
	// return built node structure for adding to DOM
  return node;
}

// FN: clear node of current content - node set to empty
function clearContent(node) {
	// simple reset for defined DOM element node...
	document.querySelector(node).innerHTML = '';
}

// FN: object sort - pass param to filter by...
function objectSort(data, compare) {
	// sort passed data using compare param for filter
	const sorted = data.sort((a, b) => {
		// update with current check value
  	let check = 0;
		// compare specialty uid from data return
  	if (a[compare] > b[compare]) {
    	check = 1;
  	} else if (a[compare] < b[compare]) {
    	check = -1;
  	}
		// return sorted data array...
  	return check;
		});
	// return updated and sorted array of data
	return sorted;
}


/*
* EVENT: listen for click event on menu item
* - specific example for 'specialties'
*/
function handleFormSubmit(specialty, insurance, gender, zipcode) {
	// call 'read' async function for API query
	var specialty_param = "specialty_uid=" + encodeURIComponent(specialty);
	var insurance_param = "&insurance_uid=" + encodeURIComponent(insurance);
	var gender_param= "&query=" +encodeURIComponent(gender);
	var zip_code = "&location=" + encodeURIComponent(zipcode);
	var params = specialty_param + insurance_param + gender_param + zip_code;

	read('doctors', params).then(
	    (val) => {
	        console.log(val)
	    }
		// use return data from API query
//		(val) => {
//			/*
//			* sort data to alphabetical array of objects
//			* - sort() accepts custom compare function...
//			*/
//			const sortedVals = objectSort(val.data, 'uid');
//			/*
//			*	MAP - create map of alphabetical specialties
//			* - iterate sorted values & first letter
//			* - set key for each letter in Map
//			* - add array of specialties per letter key in Map
//			*/
//			const orderedMap = new Map();
//			// iterate sorted values from API query
//			for (let item of sortedVals) {
//				// get first letter per specialty object
//				const letter = item.uid[0];
//				// check if letter already exists in Map
//				if (orderedMap.has(letter)) {
//					// get value for letter - i.e. array of specialties
//					const keyVal = orderedMap.get(letter);
//					// push specialty to value array for current letter
//					keyVal.push(item);
//					// update Map key & value for current letter
//					orderedMap.set(letter, keyVal);
//				} else {
//					// create initial array value
//					const keyVal = [];
//					// push value to array
//					keyVal.push(item);
//					// set key a& value in Map
//					orderedMap.set(letter, keyVal);
//				}
//			}
//
//			// console.log(orderedMap);
//
//			// total no. of results for query...
//			const totalHeading = `Total specialties = ${val.meta.total}`;
//			// define attributes for list element
//			const listAttrs = [['class', 'sorted-list'], ['id', 'specialtyList']];
//			// define attributes for output element
//			const outputAttrs = [['class', 'sorted-output'], ['id', 'specialtyOutput']];
//			// output total for specialties & header for sorted list
//			document.getElementById('page-content').appendChild(
//				elemBuild('div',
//					elemBuild('header',
//						elemBuild('h4', totalHeading)
//					),
//					elemBuild('div', listAttrs,
//						elemBuild('p', 'Please select from the following alphabetical list...'),
//						elemBuild('ul')
//					),
//					elemBuild('div', outputAttrs)
//				)
//			);
//			// output alphabetical list for sorted specialties
//			// iterate orderedMap for alphabetical list of specialties from API data
//			for (let [key, value] of orderedMap.entries()) {
//				// define attributes for each list item - id is letter per item in ordered map
//				const attrs = [['id', key]];
//				// add alphabetical list items to ul
//				document.querySelector('#specialtyList ul').appendChild(
//					// build each list item with letter & total results per letter
//					elemBuild('li', attrs, `${key.toUpperCase()} (${value.length})`)
//				).addEventListener('click', () => { // add cluvk event handler for each letter
//					// heading for clicked letter in list - rendered to sorted output
//					const letterHeading = `Specialty = ${key.toUpperCase()} & Total = ${value.length}`;
//					// define attributes for table
//					const tableAttrs = [['class', 'output-table']];
//					// clear content in sorted output each time letter is clicked...
//					clearContent('.sorted-output');
//					// add table, table caption, & table headings to sorted output
//					document.querySelector('.sorted-output').appendChild(
//						elemBuild('table', tableAttrs,
//							elemBuild('caption', letterHeading),
//							elemBuild('th', 'specialty'),
//							elemBuild('th', 'description'),
//							elemBuild('th', 'search'),
//						)
//					)
//					// iterate properties of current value - each value for sorted specialties
//					for (let props of value) {
//						// define attributes per anchor element
//						const linkAttrs = [['class', 'search-link'], ['id', props.uid]];
//						// add table row and data cell for current value
//						document.querySelector('.output-table').appendChild(
//							elemBuild('tr',
//								elemBuild('td', props.name),
//								elemBuild('td', props.description),
//								elemBuild('td',
//									// add link to query doctors for current specialty...
//									elemBuild('a', linkAttrs, 'find local doctors')
//								)
//							)
//						).addEventListener('click', function() { // add event handler for above link
//							// 'this' scope available due to anonymous function (instead of arrow fn)
//							const specialty = this.querySelector('.search-link').getAttribute('id');
//							// test location code - this is just for testing...
//							const code = 'ca';
//							// query API for doctors - required params passed to 'read' fn
//							const params = `specialty_uid=${specialty}&location=${code}&limit=5`;
//							// query api - practices returned...
//							read('doctors', params).then(
//								// use return data from API query
//								(val) => {
//									// clear content to now render list of matched doctors for current specialty
//									clearContent('.sorted-output');
//									// test doctor data...basic example output
//									const queryType = val.meta['item_type'];
//									// output test query data &c. - basic output to document...
//									const queryHeading = `Search query = ${queryType}`;
//									// add initial table to output...
//									document.querySelector('.sorted-output').appendChild(
//		  							// node name, content...then any nested child nodes
//						  			elemBuild('div',
//											elemBuild('h4', 'Results'),
//									 		elemBuild('table', tableAttrs,
//									 			elemBuild('caption', queryHeading),
//												elemBuild('th', 'location'),
//									 			elemBuild('th', 'practice name'),
//											)
//										)
//									)
//									// loop through results for specialty & doctors
//									for (let props of val.data) {
//										// inner loop for multiple practices per location...
//										for (let innerProps of props['practices']) {
//											// define some values to output for sample doctor data
//											const practiceLocation = innerProps['location_slug'];
//											const practiceName = innerProps['name'];
//											// add sample doctor data to output table
//											document.querySelector('.output-table').appendChild(
//												elemBuild('tr',
//													elemBuild('td', practiceLocation),
//													elemBuild('td', practiceName),
//												)
//											)
//										}
//									}
//								}
//							);
//						});
//					}
//				});
//			}
//		}
	);
};

document.getElementById('my-form').addEventListener('submit', function(event) {

const specialty = document.getElementById('select-specialty').value;
const insurance = document.getElementById('select-insurance').value;
const gender = document.getElementById('select-gender').value;
const zip = document.getElementById('input-zip').value;
handleFormSubmit(specialty, insurance, gender, zip);

event.preventDefault();
})
