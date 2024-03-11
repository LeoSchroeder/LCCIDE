import requests as req
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO

app = Flask(__name__, static_url_path='/static')
app.config['SECRET_KEY'] = 'MountUp'
socketio = SocketIO(app)

global editor_text;
global variableList;
currentStep = 0;
canEdit = True;
justCompiled = False;

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/code/')
def code():
    return render_template('index.html')

@app.route('/instructionset/')
def instructionset():
    return render_template('instructionset.html')

@app.route('/test/')
def test():
    return render_template('test.html')

#   Function to handle button presses on the compiler

@app.route('/code/quill-api', methods=['POST'])
def quill_api():
    global canEdit
    global currentStep
    if request.method == 'POST':
        data = request.get_json()
        message = data.get('message', '')
        if message == "compileButton":
            response = "perform compile logic"
            # Compile logic
            compileButton = compile()
            print(compileButton)
        elif message == "runButton":
            response = "perform run logic"
#   Run logic
#   Send editor contents to instruction set code with global editor_text.

#   Flask app recives memory location(s) changed and sets them with the set_memory(memory) function.
            memory = set_memory("1-1-10")
            print(memory)
            memory = set_memory("2-1-08")
            print(memory)
            memory = set_memory("7-3-1b")
            print(memory)
#   This code shows what it looks like to move the FP
#   Set previous fp to value without header tag
#   Set new fp to value with header tag
            memory = set_memory("0-7-00")
            print(memory)
            memory = set_memory("1-0-08-FP")
            print(memory)

#   Recive the output from the code and update the code output section.
#   Run should also recive the steps so it can display what step recived the error
            if(canEdit):
                outputString = "123456-No Error-" + str(editor_text.count('\n')) + "-" + str(editor_text.count('\n')) + "-run"
                output = set_output(outputString)
                print(output)
            else:
                outputString = "Error-Index out of bounds-0-" + str(editor_text.count('\n')) + "-debug"
                output = set_output(outputString)
                print(output)
        elif message == "previousButton":
            if canEdit:
                response = "In edit mode. previous logic disabled"
            else:
                if currentStep <= 0:
                    response = "Steps at 0 can't use previous"
                else:
                    response = "perform previous logic"
                    print(response)
                    # Previous logic
                    currentStep = currentStep - 1
                    response = str(currentStep)
        elif message == "stepButton":
            if canEdit:
                response = "In edit mode. step logic disabled"
            else:
                if editor_text.count('\n') <= currentStep:
                    response = "Max steps reached"
                else:
                    response = "perform step logic"
                    print(response)
                    # Step logic
                    currentStep = currentStep + 1
                    response = str(currentStep)
        elif message == "editMode":
            canEdit = True
            set_memory("edit")
            change_var("edit")
            currentStep = 0
            response = "enable edit mode"
        elif message == "debugMode":
            canEdit = False
            set_memory("view")
            change_var("display")
            currentStep = 0
            response = "enable debug mode"
        else:
            response = "unknown button sent/n" + message

        print(response)
        # Return a response
        return jsonify({"message": response})

@app.route('/code/compile', methods=['POST'])
def compile():
    global editor_text
    if editor_text:
        # Compile code if text is avaiable
        print("Editor Text:\n", editor_text)
        return jsonify({"message": "Text Ready To Compile"})
    else:
        print("No editor text")
        return jsonify({"message": "Text Not Avaiable"})


@app.route('/get-variables', methods=['POST'])
def get_variables():
    global variableList
    if request.method == 'POST':
        data = request.get_json()
        message = data.get('message', '')
        variableList = message;
        print(message);
        response = "String recived"
        print(response)
        # Return a response
        return jsonify({"message": response})

@app.route('/get-text', methods=['GET'])
def get_text():
    global editor_text
    editor_text = request.args.get('editorText')
    if editor_text:
        return jsonify({"message": "Text Ready To Compile"})
    else:
        print("No editor text")
        return jsonify({"message": "Text Not Available"})

#   These routes are responsible for sending messages to the javascript
#   via socketio.

#   newMemory should be sent in string format "row-col-newValue"
@app.route('/code/set-memory')
def set_memory(newMemory):
    print("setting memory with: ", newMemory)
    socketio.emit('memory_update', newMemory)
    return jsonify({"message": newMemory})

#   changeVariable should be sent in string format "add/delete-variableID-value"
@app.route('/code/change-var')
def change_var(changeVariable):
    print("changing variable: ", changeVariable)
    socketio.emit('change_var', changeVariable)
    return jsonify({"message": changeVariable})

#   newOutput should be sent in string format "codeOutput-errorOutput-currentStep-totalSteps"
#   if the editor is in edit mode the currentStep and totalSteps should be 00
@app.route('/code/set-output')
def set_output(newOutput):
    print("setting output with: ", newOutput)
    socketio.emit('output_update', newOutput)
    return jsonify({"message": newOutput})



if __name__ == "__main__":
    socketio.run(app, debug=True)
#    app.run(host="0.0.0.0", port=5000)