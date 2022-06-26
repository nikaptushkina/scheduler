import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  // group states into one object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  // when called, update state
  const setDay = day => setState({ ...state, day });

  // data request using axios, set state with data received
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    }).catch(error => console.log(`Error: ${error.message}`));
  }, []);

  // add appointment interview data into database
  function bookInterview(id, interview) {
    
    // update appoitnment with object passed in
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    // add appointment into list of them
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // filter to find dat that was booked and its index - used to change day correctly into the array of days
    const dayBooked = state.days.filter(day => day.name === state.day)
    const dayIndex = state.days.findIndex(day => day.name === state.day)

    const updateSpot = {
      ...dayBooked[0],
      spots: (state.appointments[id].interview ? dayBooked[0].spots : dayBooked[0].spots - 1)
    }

    // replace state of specific day with updated day (adjusts spots remaining)
    const days = [
      ...state.days.slice(0, dayIndex),
      updateSpot,
      ...state.days.slice(dayIndex + 1)
    ]

    // promise returned to save in Appointment/index
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {        
        setState(prev => ({...prev, appointments, days}));
      });
  }   
  
  // cancels interview for specific appointment
  function cancelInterview(id) {
    
    // update appointment to change interview = null
    const cancelledAppointment = {
      ...state.appointments[id],
      interview: null
    };

    // add cancelled appointment to list of appointments to replace one from list
    const appointments = {
      ...state.appointments,
      [id]: cancelledAppointment
    };
    
    const dayBooked = state.days.filter(day => day.name === state.day)
    const dayIndex = state.days.findIndex(day => day.name === state.day)

    const updateSpot = {
      ...dayBooked[0],
      spots: (dayBooked[0].spots + 1)
    }

    // replace with updated day to adjust spots remaining
    const days = [
      ...state.days.slice(0, dayIndex),
      updateSpot,
      ...state.days.slice(dayIndex + 1)
    ]

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => {        
        setState(prev => ({...prev, appointments, days}));
      });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
