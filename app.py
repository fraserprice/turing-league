from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)
thread = None

def background_thread():
    """Example of how to send server generated events to clients."""
    count = 0
    while True:
        socketio.sleep(10)
        count += 1
        socketio.emit('my_response',
                      {'data': 'Server generated event', 'count': count},
                      namespace='/test')

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@socketio.on('start_request', namespace='/chat')
def start_request(message):
    print 'start request'
    # TODO: start matchmaking process
    # global thread
    # if thread is None:
    #     thread = socketio.start_background_task(target=background_thread)
    print message['nickname']

@socketio.on('message_submitted', namespace='/chat')
def message_submitted(message):
    print 'message submitted'
    # TODO: notify game
    print message['message']

@socketio.on('bot_decision', namespace='/chat')
def bot_decision(message):
    print 'bot decision'
    # TODO: notify game
    print message['bot']

@socketio.on('stop_request', namespace='/chat')
def stop_request():
    print 'stop request'
    # TODO: norufy gane
    disconnect()

@socketio.on('connect', namespace='/chat')
def test_connect():
    # TODO: 
    print 'connect'

@socketio.on('disconnect', namespace='/chat')
def test_disconnect():
    print 'disconnect'

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
