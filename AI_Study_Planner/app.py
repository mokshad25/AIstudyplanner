import streamlit as st
import datetime
import pandas as pd
import altair as alt
import time

from utils.storage import load_data, save_data
from core.scheduler import generate_schedule
from core.priority_engine import calculate_priority


st.set_page_config(page_title="AI Study Planner", page_icon="🔮", layout="wide")

DATA_PATH = "data/subjects.json"


st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap');

html, body, [class*="css"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
}

.stApp {
    background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
}

.glass-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    margin-bottom: 20px;
}

.gradient-text {
    background: linear-gradient(90deg,#6366f1,#a855f7,#ec4899);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight:700;
    font-size:3rem;
}

.pomodoro-timer{
    font-size:5rem;
    font-weight:800;
    text-align:center;
    background:linear-gradient(90deg,#a855f7,#ec4899);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}
</style>
""", unsafe_allow_html=True)


with st.sidebar:

    st.image("https://cdn-icons-png.flaticon.com/512/3858/3858711.png", width=80)

    st.markdown("### AI Study Planner")

    menu = st.radio(
        "Navigation",
        ["Dashboard","Add Subject","Generate Schedule","Revision","Productivity"],
        label_visibility="collapsed"
    )

    st.divider()



# ---------------- DASHBOARD ----------------

if menu == "Dashboard":

    st.markdown('<p class="gradient-text">Overview Dashboard</p>', unsafe_allow_html=True)

    subjects = load_data(DATA_PATH)

    total_topics = sum(s["syllabus_total"] for s in subjects)
    completed_topics = sum(s["syllabus_completed"] for s in subjects)

    completion = 0
    if total_topics > 0:
        completion = (completed_topics/total_topics)*100

    focus_hours = completed_topics * 1.5

    m1,m2,m3,m4 = st.columns(4)

    with m1:
        st.metric("Total Topics", total_topics)

    with m2:
        st.metric("Focus Hours", round(focus_hours,1))

    with m3:
        st.metric("Completion", f"{completion:.1f}%")

    with m4:
        st.metric("Subjects", len(subjects))


    # -------- Better Chart --------

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)

    st.subheader("Study Distribution")

    if subjects:

        data = []

        for s in subjects:

            remaining = s["syllabus_total"] - s["syllabus_completed"]

            data.append({
                "Subject": s["name"],
                "Completed": s["syllabus_completed"],
                "Remaining": remaining
            })

        df = pd.DataFrame(data)

        df_melt = df.melt(id_vars="Subject", var_name="Status", value_name="Topics")

        chart = alt.Chart(df_melt).mark_bar().encode(
            x="Subject",
            y="Topics",
            color="Status",
            tooltip=["Subject","Status","Topics"]
        ).properties(height=350)

        st.altair_chart(chart, use_container_width=True)

    else:

        st.info("Add subjects to see analytics.")

    st.markdown('</div>', unsafe_allow_html=True)


    # -------- Adaptive AI Recommendation --------

    st.subheader("🎯 AI Recommendation")

    if subjects:

        best_subject = max(subjects, key=lambda s: calculate_priority(s))

        remaining = best_subject["syllabus_total"] - best_subject["syllabus_completed"]

        st.success(
            f"""
            **Today's Focus: {best_subject['name']}**

            Remaining Topics: **{remaining}**

            The AI selected this subject because it has the highest priority based on:
            difficulty, exam proximity, and remaining syllabus.
            """
        )



# ---------------- ADD SUBJECT ----------------

elif menu == "Add Subject":

    st.markdown('<p class="gradient-text">New Target</p>', unsafe_allow_html=True)

    st.markdown('<div class="glass-card">', unsafe_allow_html=True)

    col1,col2 = st.columns([1,1], gap="large")

    with col1:

        subject = st.text_input("Subject Title")

        exam_date = st.date_input("Deadline / Exam Date", value=datetime.date(2026,3,15))

        difficulty = st.select_slider(
            "Intensity Level",
            options=["Low","Medium","High","Critical"]
        )

    with col2:

        topics = st.number_input("Total Topics", value=10)

        done = st.number_input("Topics Finished", value=0, max_value=topics)

        progress = (done/topics) if topics>0 else 0

        st.progress(progress)

        st.caption(f"Status: {int(progress*100)}% Complete")

    if st.button("Initialize Subject"):

        subjects = load_data(DATA_PATH)

        difficulty_map = {
            "Low":1,
            "Medium":2,
            "High":3,
            "Critical":4
        }

        new_subject = {
            "name": subject.title(),
            "exam_date": str(exam_date),
            "difficulty": difficulty_map[difficulty],
            "syllabus_total": topics,
            "syllabus_completed": done
        }

        subjects.append(new_subject)

        save_data(DATA_PATH, subjects)

        st.balloons()

        st.success(f"{subject} added successfully!")

    st.markdown('</div>', unsafe_allow_html=True)



# ---------------- GENERATE SCHEDULE ----------------

elif menu == "Generate Schedule":

    st.markdown('<p class="gradient-text">AI Schedule</p>', unsafe_allow_html=True)

    subjects = load_data(DATA_PATH)

    if not subjects:

        st.warning("Add subjects first.")

    else:

        schedule = generate_schedule(subjects)

        df = pd.DataFrame(schedule)

        st.subheader("Optimized Study Plan")

        st.table(df)


        # -------- Explainable AI --------

        st.subheader("🧠 AI Reasoning")

        for s in subjects:

            remaining = s["syllabus_total"] - s["syllabus_completed"]

            exam = datetime.datetime.strptime(s["exam_date"], "%Y-%m-%d").date()

            days_left = (exam - datetime.date.today()).days

            st.info(
                f"""
                **{s['name']}**

                Remaining Topics: {remaining}

                Days Until Exam: {days_left}

                Difficulty Level: {s['difficulty']}

                Priority Score: {round(calculate_priority(s),2)}

                The AI prioritized this subject based on exam urgency,
                syllabus workload, and difficulty level.
                """
            )



# ---------------- REVISION ----------------

elif menu == "Revision":

    st.markdown('<p class="gradient-text">Spaced Repetition</p>', unsafe_allow_html=True)

    subjects = load_data(DATA_PATH)

    if subjects:

        for s in subjects:

            remaining = s["syllabus_total"] - s["syllabus_completed"]

            if remaining > 0:

                st.checkbox(f"{s['name']} review remaining topics ({remaining})")

    else:

        st.info("No subjects available.")



# ---------------- PRODUCTIVITY ----------------

elif menu == "Productivity":

    st.markdown('<p class="gradient-text">Focus Engine</p>', unsafe_allow_html=True)
    st.write("Structured deep-work sessions using the Pomodoro method.")

    # ---------- SESSION STATE ----------

    if "timer_running" not in st.session_state:
        st.session_state.timer_running = False

    if "time_left" not in st.session_state:
        st.session_state.time_left = 1500

    if "sessions_completed" not in st.session_state:
        st.session_state.sessions_completed = 0


    # ---------- MODE SELECTION ----------

    mode = st.radio(
        "Mode",
        ["Pomodoro (25m)", "Deep Work (90m)", "Short Break (5m)"],
        horizontal=True
    )


    if mode == "Pomodoro (25m)":
        total_time = 25 * 60
    elif mode == "Deep Work (90m)":
        total_time = 90 * 60
    else:
        total_time = 5 * 60


    # ---------- RESET TIMER WHEN MODE CHANGES ----------

    if st.session_state.time_left > total_time:
        st.session_state.time_left = total_time


    # ---------- TIMER DISPLAY ----------

    minutes = st.session_state.time_left // 60
    seconds = st.session_state.time_left % 60

    st.markdown(
        f'<p class="pomodoro-timer">{minutes:02d}:{seconds:02d}</p>',
        unsafe_allow_html=True
    )


    # ---------- BUTTONS ----------

    col1, col2, col3 = st.columns(3)

    with col1:
        if st.button("▶ Start"):
            st.session_state.timer_running = True

    with col2:
        if st.button("⏸ Pause"):
            st.session_state.timer_running = False

    with col3:
        if st.button("🔄 Reset"):
            st.session_state.timer_running = False
            st.session_state.time_left = total_time


    # ---------- TIMER LOOP ----------

    if st.session_state.timer_running:

        time.sleep(1)

        st.session_state.time_left -= 1

        if st.session_state.time_left <= 0:

            st.session_state.timer_running = False

            if "Break" not in mode:
                st.session_state.sessions_completed += 1
                st.success("Focus session completed! Take a break.")

            st.session_state.time_left = total_time

        st.rerun()


    # ---------- SESSION ANALYTICS ----------

    st.markdown("---")

    st.subheader("Productivity Stats")

    col1, col2 = st.columns(2)

    with col1:
        st.metric("Focus Sessions Completed", st.session_state.sessions_completed)

    with col2:
        focus_hours = round(st.session_state.sessions_completed * 25 / 60, 2)
        st.metric("Total Focus Hours", focus_hours)


    # ---------- MOTIVATION ----------

    st.markdown("---")

    st.info(
        """
        💡 **Focus Tip**

        Work in deep-focus intervals and avoid multitasking.
        The Pomodoro technique improves concentration and reduces burnout.
        """
    )