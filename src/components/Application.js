import React, { useState, useEffect } from "react";
import "components/Application.scss";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import DayList from "components/DayList";
import axios from "axios";
import useApplicationData from "../hooks/useApplicationData";

export default function Application(props) {
  // get from hook to user in component
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

  // get appointments for certain day using the current state and day
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // create array of appointment components for day (each gets info from individual appoitment as props)
  const appointmentComponents = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    // get omtervoewers available for that day
    const interviewers = getInterviewersForDay(state, state.day);
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id} 
        time={appointment.time} 
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
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
