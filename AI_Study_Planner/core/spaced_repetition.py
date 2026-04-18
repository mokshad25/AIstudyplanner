from datetime import datetime

intervals = [1,3,7,14,30]

def due_revisions(topics):

    today = datetime.today()

    due = []

    for t in topics:

        last = datetime.strptime(t["last_studied"],"%Y-%m-%d")

        days = (today - last).days

        if days in intervals:
            due.append(t)

    return due
