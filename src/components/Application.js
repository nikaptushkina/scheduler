import React, { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";
import DayList from "components/DayList";
import axios from "axios";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers"),
    ]).then(([days, appointments, interviewers]) => {
      setState(prev => {
        return ({
          ...prev, days: days.data, appointments: appointments.data, interviewers: interviewers.data
        })
      })
    })
  }, []);

  const appointmentComponents = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id} 
        time={appointment.time} 
        interview={interview}
      />
    );
  })

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList 
          days={state.days}
          day={state.day}
          setDay={setDay}     
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
        <section className="schedule">
          {appointmentComponents}
          <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
