"""Human implementation of Player."""
from player import Player
from flask_socketio import emit

class Human(Player):

    def __init__(self, name, sid):
        super(Human, self).__init__(name, False)
        self._sid = sid

    def start_game(self, role, rounds):
        print 'sending start game to ' + self.name()
        emit('started', {'role' : role}, room=self._sid)

    def send_message(self, message):
        print 'sending message to ' + self.name()
        emit('message_received', {'message' : message}, room=self._sid)

    def end_game(self, victory):
        print 'sending end game to ' + self.name()
        emit('finished', {'win' : victory}, room=self._sid)
        # TODO: update stats
        # TODO: update global data structure
