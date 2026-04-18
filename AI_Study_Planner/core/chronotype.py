import pandas as pd

def find_best_hours(history):

    if len(history) == 0:
        return ["09:00","14:00","19:00"]

    df = pd.DataFrame(history)

    success = df[df["completed"] == True]

    hours = success["time"].value_counts()

    return list(hours.index[:3])
