export function getAppointmentsForDay(state, day) {
  if (state.days.length < 1) {
    return [];
  }
  const dayAppointments = state.days.filter(obj => obj.name === day)[0];
  return (!dayAppointments || dayAppointments.appointments.length < 1) ? [] : dayAppointments.appointments.map(appID => appID = state.appointments[appID]);
}