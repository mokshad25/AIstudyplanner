from datetime import datetime

def calculate_priority(subject):

    today = datetime.today()

    exam = datetime.strptime(subject["exam_date"], "%Y-%m-%d")

    days_left = (exam - today).days

    syllabus_remaining = subject["syllabus_total"] - subject["syllabus_completed"]

    priority = (
        subject["difficulty"] * 2 +
        syllabus_remaining * 1.5 +
        (1 / max(days_left,1)) * 100
    )

    return priority
