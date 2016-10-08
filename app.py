from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from threading import Timer
from db import database

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

user_to_session = {}
games = []
users_waiting = []
user_to_matching_thread = {}
#db = database.Database()

def create_bot_game(username):
    print 'creating a bot game'
    # games.append(Game(username, # random bot))
    # TODO: create a bot game
    users_waiting.remove(username)

def started(username, role):
    emit('started', {'role': role}, namespace='/chat')

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@app.route('/highscores')
def highscores():
    return render_template('highscores.html')

@app.route('/leaderboards/bots', methods=['GET'])
def get_best_bots():
 #   return db.get_top_bots_table()
    pass

@app.route('/leaderboards/users', methods=['GET'])
def get_best_users():
    #return db.get_top_users_table()
    pass

@socketio.on('start_request', namespace='/chat')
def start_request(message):
    print 'start request'

    username = message['nickname']
    # TODO: uniquely identify user socket
    # user_to_session[username] = request.namespace

    if not username in users_waiting:
        if not users_waiting:
            print 'adding user to queue...'
            users_waiting.append(username)
            user_to_matching_thread[username] = Timer(30.0, create_bot_game, username)
        else:
            print 'matching user'
            other_player = users_waiting[0]
            users_to_matching_thread[other_player].cancel()
            games.append(Game(username, other_player))
            users_waiting.remove(other_player)
            
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
    # TODO: notify game
    disconnect()

@socketio.on('connect', namespace='/chat')
def socket_connect():
    # TODO: 
    print 'connect'

@socketio.on('disconnect', namespace='/chat')
def socket_disconnect():
    print 'disconnect'

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
