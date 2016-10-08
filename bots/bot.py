from chatterbotapi import ChatterBotFactory, ChatterBotType
class Bot:

    def __init__(self, bot_type):
        factory = ChatterBotFactory()
        if (bot_type == "cleverbot"):
            self.bot = factory.create(ChatterBotType.CLEVERBOT)
        elif (bot_type == "pandorabots"):
            self.bot = factory.create(ChatterBotType.PANDORABOTS,'b0dafd24ee35a477')
        elif (bot_type == "jabberwacky"):
            self.bot = factory.create(ChatterBotType.JABBERWACKY)
        else:
            print("Invalid bot type")

    def start_session(self, bot):
        return self.bot.create_session()
