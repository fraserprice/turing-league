"""Human implementation of Player."""
from player import Player

class Human(Player):

    def __init__(self, name, send_f):
        super(Human, self).__init__(name, False)
        self._send_f = send_f

    def start_game(self, role, rounds):
        self._send_f(event='started', data={'role' : role, 'rounds' : rounds})

    def send_message(self, message):
        self._send_f(event='message_received', data={'message' : message})

    def end_game(self, victory):
        self._send_f(event='finished', data={'win' : victory})
        # TODO: update stats
        # TODO: update global data structure
