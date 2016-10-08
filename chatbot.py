"""ChatBot implementation of Player."""
from player import Player

class ChatBot(Player):

    def __init__(self, name, session):
        super(ChatBot, self).__init__(name, True)
        self._session = session

    def set_game(self, game):
        self._game = game

    def start_game(self, role, rounds):
        pass

    def send_message(self, message):
        self._game.defender_message(self._session.think(message))

    def end_game(self, victory):
        # TODO: update stats
        pass
