class Game:
    _ROUNDS = 10

    def __init__(self, attacker, defender):
        self._attacker = attacker
        
        if defender.is_bot():
            defender.set_game(self)

        self._defender = defender
        self._attacker.start_game('attacker', self._ROUNDS)
        self._defender.start_game('defender', self._ROUNDS)

    def message(self, username, message):
        if self._attacker.name() == username:
            self.attacker_message(message)
        else:
            self.defender_message(message)

    def attacker_message(self, message):
        self._defender.send_message(message)

    def defender_message(self, message):
        self._attacker.send_message(message)

    def attacker_guess(self, is_bot):
        if self._defender.is_bot == is_bot:
            attacker.end_game(True)
            defender.end_game(False)
        else:
            attacker.end_game(False)
            defender.end_game(True)
