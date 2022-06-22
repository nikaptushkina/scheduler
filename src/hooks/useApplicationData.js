import React, { useState , useEffect} from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

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

  function getDay(day) {
    const arrayIndexes = {
      Monday: 0, 
      Tuesday: 1, 
      Wednesday: 2, 
      Thursday: 3, 
      Friday: 4
    }
    return arrayIndexes[day]
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayBooked = getDay(state.day)

    let day = {
      ...state.days[dayBooked],
      spots: state.days[dayBooked].spots - 1
    }

    let days = state.days
    days[dayBooked] = day;

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment).then(() => setState(prev => ({...state, appointments, days})))
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayBooked = getDay(state.day)

    let day = {
      ...state.days[dayBooked],
      spots: state.days[dayBooked].spots + 1
    }

    let days = state.days
    days[dayBooked] = day;

    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment).then(() => setState(prev => ({...prev, appointments, days})))
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}