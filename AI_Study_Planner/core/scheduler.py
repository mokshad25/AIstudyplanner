from core.priority_engine import calculate_priority
from core.break_planner import break_plan

def generate_schedule(subjects):

    subjects_sorted = sorted(
        subjects,
        key=lambda x: calculate_priority(x),
        reverse=True
    )

    schedule = []

    for s in subjects_sorted:

        difficulty = s["difficulty"]

        if difficulty <=2:
            length = 25
        elif difficulty ==3:
            length = 50
        elif difficulty ==4:
            length = 75
        else:
            length = 90

        break_data = break_plan(difficulty)

        schedule.append({
            "subject": s["name"],
            "duration": length,
            "cycles": break_data["cycles"],
            "break": break_data["break"]
        })

    return schedule
