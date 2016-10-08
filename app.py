from flask import Flask, render_template, session, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room, \
    close_room, rooms, disconnect
from threading import Timer
from player import Player
from human import Human
from chatbot import ChatBot
from bots import bot
from game import Game
import random
from db import database

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

players_in_game = {} # username -> game
players_in_lobby = {} # username -> timer
username_to_player = {} # username -> player
db = database.Database()

@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

@app.route('/highscores')
def highscores():
    return render_template('highscores.html')

@app.route('/leaderboards/bots', methods=['GET'])
def get_best_bots():
    return db.get_top_bots_table()

@app.route('/leaderboards/users', methods=['GET'])
def get_best_users():
    return db.get_top_users_table()

@socketio.on('start_request', namespace='/chat')
def start_request(message):
    print 'start request'

    username = message['nickname']

    if not (username in players_in_game) or (username in players_in_lobby):
        player = Human(username, request.sid)
        username_to_player[username] = player

        if not players_in_lobby:
            print 'adding ' + username  + ' to lobby...'
            timer = Timer(30.0, create_bot_game, (player,))
            players_in_lobby[player.name()] = timer
            timer.start()

        else:
            # remove first player form lobby
            opponent_username, opponent_timer = players_in_lobby.items()[0]
            opponent_timer.cancel()
            del players_in_lobby[opponent_username]
            opponent = username_to_player[opponent_username]

            print 'matching ' + player.name() + ' with ' + opponent.name()
            game = Game(player, opponent)
            players_in_game[player] = game
            players_in_game[opponent] = game
            
@socketio.on('message_submitted', namespace='/chat')
def message_submitted(message):
    print 'message submitted'
    players_in_game[username_to_player[message['user']]].message(message['user'], message['message'])

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

def create_bot_game(player):
    print player.name() + ' will play a bot game'
    random_bot = random.choice(bot.BOTS)
    chatbot = ChatBot(random_bot.bot_type(), random_bot.start_session())
    players_in_game[player] = Game(player, chatbot)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')
