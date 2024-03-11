
/*  quillScript.js
*   This section at the top is the editor itself
*
*   By: Leo Schroeder 
*/

//  variables
var editMode = true;
var justCompiled = false;
const variableList = [];
/*hljs.initHighlightingOnLoad();
hljs.configure({
    languages: ['javascript', 'python']
});*/

const quill = new Quill('#editor', {
    modules: {
        syntax: true,
        toolbar: {
            container: '#toolbar',
            handlers: {
                compileButton: function() {
                    quill.format('compileButton', true);
                    const message = "compileButton";
                    getText();
                    sendButton("compileButton");
                    justCompiled = true;
                },
                runButton: function() {
                    if(!justCompiled) {
                        console.log("Must compile before running code");
                        console.log("Button press not sent to app")
                    }
                    else {
                        console.log("Code was just compiled, ready to run");
                        sendButton("runButton");
                    }
                    quill.format('runButton', true);
                },
                previousButton: function() {
                    quill.format('previousButton', true);
                    const message = "previousButton";
                    sendButton("previousButton");
                },
                stepButton: function() {
                    quill.format('stepButton', true);
                    const message = "stepButton";
                    sendButton("stepButton");
                }
            }
        }
    },
    formats: {
        customButton1: 'button.ql-compileButton',
        customButton2: 'button.ql-runButton',
        customButton3: 'button.ql-previousButton',
        customButton4: 'button.ql-stepButton'
    }
});

// Make sure the first line number appears 
updateLineNumbers();
let timer;

// Check for changes in the editor and update functions accordingly
quill.on('text-change', () => {
    
    clearTimeout(timer);
    // Set a new timer to update the content after 500 milliseconds (0.5 seconds)
    timer = setTimeout(() => {
        console.log('Checking Variables');
        variableCheck();
        justCompiled = false;
    }, 500);

    updateLineNumbers();
    justCompiled = false;
});

// Create the debug dropdown element
const debugDropdown = document.querySelector('.ql-debug-dropdown');

// Listen for changes in the dropdown selection
debugDropdown.addEventListener('change', (event) => {
    const selectedMode = event.target.value;
    if (selectedMode === 'edit') {
        console.log("Edit mode")
        editMode = true;
        quill.format('previousButton', false);
        quill.format('stepButton', false);
        quill.enable();
        quill.removeFormat(0, quill.length);
        sendButton("editMode")
    } 
    else if (selectedMode === 'debug') {
        console.log("Debug mode")
        editMode = false;
        quill.format('previousButton', true);
        quill.format('stepButton', true);
        quill.enable(false);
        sendButton("debugMode")
    }
});

/*  updateLineNumbers()
*   
*   This function is responsible for updating the line numbers on the left of 
*   the editor's screen.
*/
function updateLineNumbers() {
    const editor = document.querySelector('.ql-editor');
    const lineNumbers = document.getElementById('line-numbers');

    lineNumbers.innerHTML = '';
    const line = editor.querySelectorAll('p');
    // Add line numbers
    line.forEach((line, index) => {
        const p = document.createElement('p');
        p.textContent = index + 1;
        lineNumbers.appendChild(p);
    });
}

/*  sendButton(message)
*   
*   This function is responsible for sending a string to the flask server. 
*   The string should be send as the variable message.
*/
function sendButton(message) {

    var handleResponse = false
    if(message == "previousButton" || message == "stepButton") {
        handleResponse = true;
    }

    // Make an API request to Flask server
    fetch('/code/quill-api', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log(data);
        if(handleResponse) {

//  Update data for next frame if needed
//  If previous was called pop previous draw<div> off
            console.log('Highlighting line number: ' + data.message);
            highlightLine(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

/*  getText()
*
*   This function is responsible for sending the contents of the editor to the flask server
*   whenever the compile button is pressed
*/
function getText() {

  const text = quill.getText();

  fetch('/get-text?editorText=' + encodeURIComponent(text), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/JSON'
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
  })
  .catch(error => {
    console.error('Error: ', error);
  });
}

/*  variableCheck()
*   This function is responsible for controling the number of variables that are displayed
*/
function variableCheck() {
//  get text to compare variables with list of current variables
    const text = quill.getText();
    splitText = text.split(/[ \n]+/);
    variableLocations = [];
    if(variableList.length = 0) {
        variableReset();
    }
    variableCounter = 0;
    for(let i = 0; i < splitText.length; i++) {
        console.log(splitText[i]);
        if(splitText[i] == 'var') {
            console.log('found variable');
            variableCounter++;
            variableLocations.push(i);
        }
    }
//  Make check for if multiple variables were changes
    /*if(-1 < (variableCounter - variableList.length) > 1 ) {
        console.log('multiple variables changed', variableList.length, ' counter: ', variableCounter);
        variableReset();
    }*/

//  if counters are different must find what var to add/ delete
    if(variableCounter != variableList.length) {
        console.log('(at least) one variable changed, list: ', variableList.length, ' counter: ', variableCounter);
        if(variableCounter > variableList.length) {
            console.log('adding variable')
//  adding variable to list
            variableReset();
            /*var locationFound = false;
//  find location of changed variable
            for(let i = 0; i < variableCounter; i ++) {
                console.log('comparing ', splitText[variableLocations[i] + 1], ' to ', variableList[i])
                if(splitText[variableLocations[i] + 1] != variableList[i]) {
//  Now that new var is found check to make sure its ready to add to the list
                    if(splitText[variableLocations[i] + 1] == null || splitText[variableLocations[i] + 3] == null) {
//  Variable is not ready to be added to list
                        console.log('variable not ready to be added')
                    }
                    else {
                        variableReset();
                    }
                    locationFound = true;
                    
                }
            }
            if(!locationFound) {
//  Couldnt find location to update
                console.log('location not found to update');
            }*/
        }
        else {
//  removing variable from list
            console.log('removing a variable');
            variableReset();
        }
    }
    else {
//  assume no new variable is added or removed
        console.log('no change in variables: ', variableList.length, ' counter: ', variableCounter);
    }
}

/*  variableReset()
*   resets the list of variables
*   This function is useful because it can handle multiple variable changes at a time.
*   Another useful feature is that this function can be used to delete old variables.
*/
function variableReset() {

    console.log('In variableReset')
    variableList.splice(0, variableList.length);
    const text = quill.getText();
    splitText = text.split(/[ \n]+/);
    varCounter = 0;
    resetVariables();

    for(let i = 0; i < splitText.length; i++) {
        console.log(splitText[i]);
        if(splitText[i] == 'var') {
//  check to make sure variable is valid
            if(splitText[i + 2] == '=' && splitText[i + 1] != null && splitText[i + 3] != null) {
//  variable is valid, build string to send to variables
                var varString = splitText[i + 1] + "-" + splitText[i + 3] + "-" + varCounter;
                variableList.splice(i, 0, splitText[i +1]);
                createVariable(varString);
                varCounter++;
            }
            else {
//  skip invalid variable
            }
        }
        else {
//  skip words not var
        }
    }
    drawVariables();
}
/*  variableChecks()
*
*   This function is meant to be a redone version of the variableCheck() function
*   The goal is to make the function more programmer friendly and fix the bugs that
*   have proben to be a challence to remove.
*/
function variableChecks() {
    const text = quill.getText();
    splitText = text.split(/[ \n]+/);
    variableLocations = [];
    
    variableCounter = 0;
    for(let i = 0; i < splitText.length; i++) {
        console.log(splitText[i]);
        if(splitText[i] == 'var') {
            console.log('found variable');
            variableCounter++;
            variableLocations.push(i);
        }
    }

    if(variableList.length = 0 && variableCounter > 0) {
//  add the first variable to the list
        varString = splitText[variableLocations[0]] + "-" + splitText[variableLocations[0] + 3] + "-0";
        createVariable();
        variableList.push()
    }
    else if(variableList.length != variableCounter) {
//  the user either created or deleted a variable
        if(variableList.length > variableCounter) {
//  the user deleted at least one variable
            if(variableList.length - variableCounter > 1) {
//  the user deleted more than one variable
                console.log('More than one variable deleted');
                variableReset();
            }
            else {
//  the user deleted one variable
                console.log('One variable deleted');
                changeVariable();
            }
        }
        else {
//  the user created at least one variable
            if(variableCounter - variableList.length > 1) {
//  the user created more than one variable
                console.log('More than one variable created');
                variableReset();
            }
            else {
//  the user created one variable
                console.log('One variable created');
            }
        }
    }
}

/*  highlightLine(line)
*   line = line number that needs to be highlighted
*   this function is responsible for highlighting the line given
*   all other lines should be reset to default colors
*   this function should only work when the editor
*
*   I think the formatText function may work better than formatLine
*/
function highlightLine(line) {
    lineNumber = parseInt(line);
    console.log('Highlighting line: ' + line);
    if(editMode) {
        return -1;
// highlightLine should only be called if editor is in debug mode
    }
// set all editor contents to not highlighted
    quill.removeFormat(0, quill.length);

    quill.formatLine(line, line + 1, 'color', 'red');
}