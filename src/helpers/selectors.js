export function getAppointmentsForDay(state, day) {
  if (!state.days) {
    return [];
  }
  if (state.days.length < 1) {
    return [];
  }

  console.log(state.days);

  let appointmentsForDay = state.days.find(e => e.name === day);
  if (!appointmentsForDay) {
    return [];
  }
  return (!appointmentsForDay || appointmentsForDay.appointments.length < 1) ? [] : appointmentsForDay.appointments.map(apptID => apptID = state.appointments[apptID]);
}