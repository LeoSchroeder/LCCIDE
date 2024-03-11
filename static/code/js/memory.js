
/*
*   This code is responsible for holding and displaying the memory during the
*   program. The memory should be updated from the flask app.
*
*   To add: A pointer to the memory location the program is on when stepping through
*           their code.
*           A pointer for the registers designated for special tasks like fp & sp.
*/

//  variables
var memory = [
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '']
    ];
var memoryView = [
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', '', '', '']
    ];
var viewMode = false;

// draw memory on page load
resetMemory();
setMemory("0-0-00-R0");
setMemory("0-1-00-R1");
setMemory("0-2-00-R2");
setMemory("0-3-00-R3");
setMemory("0-4-00-R4");
setMemory("0-5-00-R5");
setMemory("0-6-00-R6");
setMemory("0-7-00-FP");
setMemory("0-8-00-SP");
//drawMemory();

/*
*   
*/
function drawMemory() {
    const memoryArray = document.getElementById('memory');
    memoryArray.innerHTML = '';

    if(viewMode) {
// update memory with memoryView
        memoryView.forEach((row, i) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'memory-row';

            row.forEach((item, j) => {
                if(titledCell(j, i)) {
    // could do additional checks on cell's title name to make different colors depending on the variable type
                    const cell = document.createElement('div');
                    cell.className = 'titled-memory-cell';
                    titleText = item.split('-');
                    cell.textContent = titleText[1] + '\n' + titleText[0];
                    rowElement.appendChild(cell);                
                }
                else {
                    const cell = document.createElement('div');
                    cell.className = 'memory-cell';
                    cell.textContent = item;
                    rowElement.appendChild(cell);
                }
                
            });
            memoryArray.appendChild(rowElement);
        });
    }
    else {
// update memory normally
        memory.forEach((row, i) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'memory-row';

            row.forEach((item, j) => {
                if(titledCell(j, i)) {
    // could do additional checks on cell's title name to make different colors depending on the variable type
                    const cell = document.createElement('div');
                    cell.className = 'titled-memory-cell';
                    titleText = item.split('-');
                    cell.textContent = titleText[1] + '\n' + titleText[0];
                    rowElement.appendChild(cell);                
                }
                else {
                    const cell = document.createElement('div');
                    cell.className = 'memory-cell';
                    cell.textContent = item;
                    rowElement.appendChild(cell);
                }
                
            });
            memoryArray.appendChild(rowElement);
        });
    }
}

function resetMemory() {
    memory.forEach((row, i) => {
        row.forEach((item, j) => {
            memory[i][j] = '00';
            memoryView[i][j] = '00';
        });
    });
}
/*  IDEA    for future ref
*   add an if statement combined with a split on the data to see if you are calling
*   setMemory(message) or updatePointers(). if the first element in the split data is 
*   M setMemory is called if the first element is P updatePointers is called. This will
*   allow the app to update pointers when the user uses step or previous.
*/
const memorySocket = io.connect('http://' + document.domain + ':' + location.port);
memorySocket.on('memory_update', function (data) {
    console.log('memory updated: ', data);
    handleMemory(data);
});

/*  handleMemory(message)
*   This function is responsible for reciving a message from the memorySocket and
*   processing it properly
*   message =   "view"                      Puts memory in view mode.
*               "edit"                      Returns memory to edit mode.
*               "#-#-cellValue-cellName"    Changes memory value depending if 
*                                           memory is in view or edit mode.
*/
function handleMemory(message) {

    splitMessage = message.split('-');
    if(message == "view") {
        viewMode = true;
    }
    else if (message == "edit") {
        viewMode = false;
//  Set memoryView back to memory when debug is disabled
        memory.forEach((row, i) => {
            row.forEach((item, j) => {
                memoryView[i][j] = memory[i][j];
            });
        });
        drawMemory();
    }
    else if (viewMode) {
        setViewMemory(message);
    }
    else {
        setMemory(message);
    }
}

/*  setMemory(message)
*   This function is responsible for setting the numbers in the memory display.
*   This function will also be responsible for calling the update pointers function.
*
*   message = "#-#-memoryValue-cellName" 
*/
function setMemory(message) {
    
    newMemory = message.split('-');
    if(parseInt(newMemory[0]) < 0 || parseInt(newMemory[0]) > 9) {
        throw new Error('Memory col is out of bounds');
    }
    else if(parseInt(newMemory[1]) < 0 || parseInt(newMemory[0]) > 7) {
        throw new Error('Memory row is out of bounds');
    }
    else if(false/* Check to make newMemory is given a memory value*/) {
        throw new Error('Memory value is out of bounds');
    }
    console.log(newMemory[3]);
    if(newMemory[3] == null) {
        console.log("setting variable without header");
        memory[newMemory[0]][newMemory[1]] = newMemory[2];
    }
    else {
        console.log("setting variable with header");
        memory[newMemory[0]][newMemory[1]] = newMemory[2] + '-' + newMemory[3];
    }
    
    drawMemory();
}
/*  setViewMemory(message)
*   This function is responsible for setting the numbers in the memory display.
*   This function will also be responsible for calling the update pointers function.
*
*   message = "#-#-memoryValue-cellName" 
*/
function setViewMemory(message) {
    
    newMemory = message.split('-');
    if(parseInt(newMemory[0]) < 0 || parseInt(newMemory[0]) > 9) {
        throw new Error('Memory col is out of bounds');
    }
    else if(parseInt(newMemory[1]) < 0 || parseInt(newMemory[0]) > 7) {
        throw new Error('Memory row is out of bounds');
    }
    else if(false/* Check to make newMemory is given a memory value*/) {
        throw new Error('Memory value is out of bounds');
    }
    console.log(newMemory[3]);
    if(newMemory[3] == null) {
        console.log("setting variable without header");
        memoryView[newMemory[0]][newMemory[1]] = newMemory[2];
    }
    else {
        console.log("setting variable with header");
        memoryView[newMemory[0]][newMemory[1]] = newMemory[2] + '-' + newMemory[3];
    }
    drawMemory();
}

/*  titledCell()
*   returns true if the cell needs a title on it
*/
function titledCell(numX, numY) {
//    console.log('looking at location: ' + numX + ' ' + numY);
    if(memory[numY][numX].split('-').length > 1) {
        return true;
    }
    return false;
}