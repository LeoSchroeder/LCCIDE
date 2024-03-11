
/*	
*	This code is responsible for the display of the output when code is run.
*	The code output should be displayed.
*	Any errors should be displayed in this section.
*	The number of steps in the program and the current step should be displayed
*	here when debug is enabled or if an error is given.
*
*	By: Leo Schroeder
*/

//	variables
var output;
var errors;
var stepCounter;
var stepTotal;
var debug = false;

//	Send default values and draw the output on page load
drawPageLoad();

function drawPageLoad() {
	/*const text = quill.getText();
    splitText = text.split('\n');
	outputData = "Output-No Error-00-" + (splitText.length - 1) + "-debug";*/
	outputData = "Output-No Error-00-0-debug";
	setOutputData(outputData);
}

/*	drawOutput()
*	This code is responsible for displaying output based on what the.
*	variables currently display. Variables can be left blank and the
*	display should have a blank box.
*	This function assumes all information stored is in correct format.
*/
function drawOutput() {
	const outputDisplay = document.getElementById('code-output');
	outputDisplay.innerHTML = '';

	if(debug) {
//	draw steps
		console.log('drawing with steps');
		const stepElement = document.createElement('div');
		stepElement.className = 'step-cell';
		stepElement.textContent = 'steps: ' + stepCounter + '/' + stepTotal;
		outputDisplay.appendChild(stepElement);
	}
	else {
//	make sure step div is deleted
		console.log('drawing without debug');
		const stepElement = document.createElement('div');
		stepElement.className = 'step-cell';
		stepElement.textContent = '';
		outputDisplay.appendChild(stepElement);
	}
//	draw output and error no matter what
	const outputElement = document.createElement('div');
	outputElement.className = 'output-cell';
	outputElement.textContent = 'code output: ' + output;
	const errorElement = document.createElement('div');
	errorElement.className = 'error-cell';
	errorElement.textContent = 'errors: ' + errors;

	outputDisplay.appendChild(outputElement);
	outputDisplay.appendChild(errorElement);
}

const outputSocket = io.connect('http://' + document.domain + ':' + location.port);
outputSocket.on('output_update', function (data) {
    console.log('output updated: ', data);
    setOutputData(data);
});
/*	setOutputData(message)
*	This function is responsible for updating the output div on the editor screen.
*	setOutputData is also responsible for doing checks to make sure information is
*	sent correctly from the flask app.
*
*	message = "codeOutput-errorOutput-currentStep-totalSteps-run/debug"
*/
function setOutputData(message) {
//	Can do more or less checks to make sure data from the flask app is sent in
//	correct format.

	newOutput = message.split('-');

	if (newOutput[4] == "run") {
		debug = false;
	}
	else {
		debug = true;
	}
	
	if(newOutput[0] == "Error" && newOutput[3] == "00") {
		throw new Error('Must give steps on error.');
	}

	output = newOutput[0];
	errors = newOutput[1];
	stepCounter = newOutput[2];
//	The way this is handled will need to be changed for final use case.
//	In general this file shouldn't call the quill object and should get
//	all visual output should come from the flask app.
	if(!debug) {
		const text = quill.getText();
    	splitText = text.split('\n');
    	stepTotal = splitText.length - 1;
	}
	else{
		stepTotal = newOutput[3];
	}
	drawOutput();
}