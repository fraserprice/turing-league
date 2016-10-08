import MySQLdb
class Database:

   #DO NOT CHANGE THE QUERY FORMAT. PYTHON DOESN'T LIKE IT :(   

    def __init__(self):
        self.db = MySQLdb.connect(host="localhost",                         
                             user="root",         
                             passwd="TuringLeague69!",
                             db="turingleague_db")

    def get_top_users_table(self):
        cur = self.db.cursor()
        mat =  cur.execute(
                "SELECT name, (wins - loses) as score FROM user GROUP BY id ORDER BY score DESC")
        rows = cur.fetchall()
        output = []
        for row in rows:
            output.append(row)
        return output
    
    def get_top_bots_table(self):
        cur = self.db.cursor()
        mat =  cur.execute(
                "SELECT name, (wins - loses) as score FROM bot GROUP BY id ORDER BY score DESC")
        rows = cur.fetchall()
        output = []
        for row in rows:
            output.append(row)
        return output

    def get_best_user(self):
        cur = self.db.cursor()
        mat = cur.execute(
            "SELECT name, (wins - loses) as score FROM user GROUP BY id ORDER BY score DESC LIMIT 1")
        return cur.fetchone()[0]

    def get_best_bot(self):
        cur = self.db.cursor()
        mat = cur.execute(
            "SELECT name, (wins - loses) as score FROM bot GROUP BY id ORDER BY score DESC LIMIT 1")
        return cur.fetchone()[0]

    def increment_user_wins(self, user_name):
        cur = self.db.cursor()
        query = "UPDATE user SET wins = wins + 1 WHERE name = '%s' " % (user_name)
        cur.execute(query)
        self.db.commit()


    def increment_bot_wins(self, bot_name):
        cur = self.db.cursor()
        query = "UPDATE bot SET wins = wins + 1 WHERE name = '%s' " % (bot_name)
        cur.execute(query)
        self.db.commit()

    def increment_user_loses(self, user_name):
        cur = self.db.cursor()
        query = "UPDATE user SET loses = loses + 1 WHERE name = '%s' " % (user_name)
        cur.execute(query)
        self.db.commit()

    def increment_bot_loses(self, bot_name):
        cur = self.db.cursor()
        query = "UPDATE bot SET loses = loses + 1 WHERE name = '%s' " % (bot_name)
        cur.execute(query)
        self.db.commit()
