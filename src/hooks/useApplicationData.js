import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    }).catch(error => console.log(`Error: ${error.message}`));
  }, []);

  function bookInterview(id, interview) {
    
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    const dayBooked = state.days.filter(day => day.name === state.day)
    const dayIndex = state.days.findIndex(day => day.name === state.day)

    const updateSpot = {
      ...dayBooked[0],
      spots: (state.appointments[id].interview ? dayBooked[0].spots : dayBooked[0].spots - 1)
    }

    const days = [
      ...state.days.slice(0, dayIndex),
      updateSpot,
      ...state.days.slice(dayIndex + 1)
    ]

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => {        
        setState(prev => ({...prev, appointments, days}));
      });
  }   
  
  function cancelInterview(id) {
    
    const cancelledAppointment = {
      ...state.appointments[id],
      interview: null
    };

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
