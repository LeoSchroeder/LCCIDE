
/*
*


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
drawMemory();
resetMemory();
drawMemory();

function drawMemory() {
    const memoryArray = document.getElementById('memory')
    memoryArray.innerHTML = '';
    
    memory.forEach((row, i) => {
        const rowElement = document.createElement('div');
        rowElement.className = 'memory-row';

        row.forEach((item, j) => {
            const cell = document.createElement('div');
            cell.className = 'memory-cell';
            cell.textContent = item;
            rowElement.appendChild(cell);
        });
        memoryArray.appendChild(rowElement);
    });
}
function resetMemory() {
    memory.forEach((row, i) => {
        row.forEach((item, j) => {
            memory[i][j] = '00';
        });
    });
}
// function setMemory(int i, int j, int key) {
//     memory[i][j] = key;
//     drawMemory();
// }
*/
