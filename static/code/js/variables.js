
/*
*	This code is responsible for adding a list of variables in the item3 <div>.
*	Variables should show up once the variable is given a name. The value field
*	should be updated when the user sets a variale.
*
*	By: Leo Schroeder
*/

//	Variables
let names = [];
let values = [];
let types = [];

let nameView = [];
let valueView = [];
let scopeView = [];
var display = false;

//	draw variables on page load
drawVariables();

/*	drawVariables()
*	This function is responsible for updating the 'variable-controls' <div>
*	Each Variable gets a name, value, and dropdown to select type
*	Future Addition:
*	A variable may be told its out of scope and will be grayed out if display = true
*/
function drawVariables() {
	console.log('drawing variables');
	const variableArray = document.getElementById('variable-controls');
	variableArray.innerHTML = '';

	if(display) {
		console.log('drawing variables in display');
/*	draw variable showing what is in scope
*	drawing variables in this section should also make the user not be able to
*	change variable type.
*	display should be controled via the variableSocket when the user selects edit
*	or debug mode
*/
		nameView.forEach((name, i) => {
			const rowElement = document.createElement('div');
			rowElement.className = 'variable-controller';
			rowElement.innerHTML = '';
//	each row element gets <div> for: name, value, type
//				const removeElement = document.getElementById()
			if(scopeView[i]) {
				const nameElement = document.createElement('div');
				nameElement.className = 'variable-name';
				console.log('variable Name: ', nameView[i]);
				nameElement.textContent = 'Variable Name: ' + nameView[i];

				const valueElement = document.createElement('div');
				valueElement.className = 'variable-value';
				console.log('variable Value: ', values[i]);
				valueElement.textContent = 'Variable Value: ' + valueView[i];

				rowElement.appendChild(nameElement);
				rowElement.appendChild(valueElement);
			}
			else {
				const nameElement = document.createElement('div');
				nameElement.className = 'variable-name-scope';
				console.log('variable Name: ', nameView[i]);
				nameElement.textContent = 'Variable Name: ' + nameView[i];

				const valueElement = document.createElement('div');
				valueElement.className = 'variable-value-scope';
				console.log('variable Value: ', values[i]);
				valueElement.textContent = 'Variable Value: ' + valueView[i];
			}
			
			variableArray.appendChild(rowElement);
		});
	}
	else {
		console.log('drawing variables in edit')
//	show variable with selectors
		names.forEach((name, i) => {
			const rowElement = document.createElement('div');
			rowElement.className = 'variable-controller';
			rowElement.innerHTML = '';
//	each row element gets <div> for: name, value, type
			if(names[i] == '') {
//	dont show blank variables
			}
			else {
				const nameElement = document.createElement('div');
				nameElement.className = 'variable-name';
				console.log('variable Name: ', names[i]);
				nameElement.textContent = 'Variable Name: ' + names[i];

				const valueElement = document.createElement('div');
				valueElement.className = 'variable-value';
				console.log('variable Value: ', values[i]);
				valueElement.textContent = 'Variable Value: ' + values[i];

				const typeElement = document.createElement('div');
				typeElement.className = 'variable-type';
				console.log('variable type: ', types[i]);
				typeElement.textContent = 'Variable Type: ' + types[i];

				rowElement.appendChild(nameElement);
				rowElement.appendChild(valueElement);
				rowElement.appendChild(typeElement);
			}

			variableArray.appendChild(rowElement);
		});
	}
}
/*	Strings sent to this socket should be sent it the following format
*	changeVariable should be sent in string format: "add/delete-variableID-value"
*/
const variableSocket = io.connect('http://' + document.domain + ':' + location.port);
variableSocket.on('change_var', function (data) {
    console.log('variableSocket: ', data);
    handleVariable(data);
});

/*	handleVariable(message)
*	This function handles messages from the flask app.
*	Warning: this function doen't check to make sure string was sent correctly.
*	Possible messages & responses to expect:
*	"display" 								makes display true
*	"edit"									makes display false
*	"get"								sends a string with all variable names to flask app
*	"scope-variableID"						SWAPS scope of the variableID
*	"add/delete-variableID-value-location"	sends message to changeVariable function
*/
function handleVariable(message) {
	console.log('handling variable');

	splitMessage = message.split('-');
	if(message == "display") {
		display = true;
//	scopeView needs to be populated with false to show out of view until changed
		getVariables();
		nameView.forEach((item, i) => {
			scopeView.splice(i, 0, false);
		});
		drawVariables();
		console.log("variables in display mode");
	}
	else if(message == "edit") {
		display = false;
//	Reset all display values when sent back to edit mode
		nameView = names;
		valueView = values;
		drawVariables();
		console.log("variables in edit mode");
	}
	else if(message == "get") {
		getVariables();
	}
	else if(splitMessage[0] == "scope") {
		swapScope(message);
	}
	else {
		changeVariable(message);
	}
}

function swapScope(message) {

	console.log('swapping scope of: ' + message);

//	don't need to make this check but this function should only be called when 
//	display in enabled
	if(display) {
		splitMessage = message.split('-');
		foundVariable = false;
		nameView.forEach((name, i) => {
			if(name == splitMessage[1]) {
				foundVariable = true;
				if(scopeView[i] = false) {
					scopeView[i] = true;
				}
				else {
					scopeView[i] = false
				}
			}
		});
		if(!foundVariable) {
			console.log('swapScope failed')
		}
		drawVariables();
	}
	else {
		console.log('should be in debug mode when this method is called');
	}
}

/*	createVariable(variable)
*	variable = "variableID-value-location"
*/
function createVariable(newVar) {
	console.log('Adding variable: ', newVar);

	newVariable = newVar.split('-');
//	Add code to check if newVar[2] is an int or String
//	This will let you choose what type you want to select
	console.log('name: ' + newVariable[0] + '\nvalue: ' + newVariable[1] + "\ntype: " + newVariable[2]);
	
	names.splice(newVariable[2], 0, newVariable[0]);
	values.splice(newVariable[2], 0, newVariable[1]);
	types.splice(newVariable[2], 0, "int");

//	Set values for display too
	nameView.splice(newVariable[2], 0, newVariable[0]);
	valueView.splice(newVariable[2], 0, newVariable[1]);
}

/*	deleteVariable(variable)
*	variable = "location"
*/
function deleteVariable(variable) {
	console.log('Deleting variable: ', variable);
	names.splice(variable, 1);
	values.splice(variable, 1);
	types.splice(variable, 1);
}

/*	changeVariable(changeVariable)
*	changeVariable should be sent in string format "add/delete-variableID-value-location"
*/
function changeVariable(changeVariable) {
	console.log('Changing variable: ', changeVariable);

	newOutput = changeVariable.split('-');
	if(newOutput[0] = 'add') {
		createVariable(newOutput[1] + '-' + newOutput[2] + '-' + newOutput[3]);
	}
	else if(newOutput[0] = 'delete') {
		deleteVariable(newOutput[3]);
	}
	else {
		throw new Error('Must give begin string with add/delete');
	}
//	display updated variable list
	drawVariables();
}

/*	resetVariables()
*	This function is responsible for reseting the lists of variables
*/
function resetVariables() {
	names.splice(0, names.length, '');
	values.splice(0, values.length, '');
	types.splice(0, types.length, '');

	nameView.splice(0, nameView.length, '');
	valueView.splice(0, valueView.length, '');
}

/*	getVariables()
*	this function is meant to send a list of all the variable names to the flask app
*/
function getVariables() {

	const variableList = names.toString();
	// Make an API request to Flask server
    fetch('/get-variables', {
        method: 'POST',
        body: JSON.stringify({ variableList }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}