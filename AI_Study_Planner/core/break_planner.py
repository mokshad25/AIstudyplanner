def break_plan(difficulty):

    if difficulty <= 2:
        return {"cycles":1,"break":5}

    elif difficulty == 3:
        return {"cycles":2,"break":15}

    else:
        return {"cycles":3,"break":25}
