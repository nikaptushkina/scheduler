import React, { Fragment } from 'react';
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import { getAppointmentsForDay, getInterview, getInterviewsForDay } from "helpers/selectors";
import Form from "components/Appointment/Form";
import "components/Appointment/styles.scss";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";
import Create from "components/Appointment/Form";
import Edit from "components/Appointment/Form";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  // called when saving form data
  function save(name, interviewer) {
    // create new interview object when form is submitted
    const interview = {
      student: name,
      interviewer
    };
    // for users to see that request is being processed
    transition(SAVING);
    // call to book interview using id of appointment for that block and add new interview object- returns promise then showing appointment
    props.bookInterview(props.id, interview).then(
      () => transition(SHOW)
    ).catch(function (error) {transition(ERROR_SAVE, true)})
  };

  // called to transition to confirm request mode when clicking delete button
  function deleteAppointment() {
    transition(CONFIRM);
  }

  // called when confirming delete
  function confirmDeleteAppointment() {
    // shows users a processing delete screen
    transition(DELETING, true);
    // cancel interview function with id of appointent to remove from database- returns promise which shows empty appointment slot
    props.cancelInterview(props.id).then(() => transition(EMPTY)).catch(function (error) {transition(ERROR_DELETE, true)})
  }

  function edit() {
    transition(EDIT);
  }

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article data-testid="appointment" className="appointment">
    <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
          <Form
            interviewers={props.interviewers}
            onCancel={() => back()}
            onSave={save}
            onDelete={deleteAppointment}
          />
      )}
      {mode === SHOW && (
          <Show
            student={props.interview && props.interview.student}
            interviewer={props.interview && props.interview.interviewer}
            onDelete={deleteAppointment}
            onEdit={edit}
          />
      )}
      {mode === SAVING && (
          <Status
            message={SAVING}
          />
      )}
      {mode === CONFIRM && (
        <Confirm
          message={"Are you sure you would like to delete?"}
          onConfirm={confirmDeleteAppointment}
          onCancel={() => back()}
        />
      )}
      {mode === DELETING && (
        <Status
          message={DELETING}
        />
      )}
      {mode === EDIT && (
      <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={() => back()}
        onSave={save}
      />
      )}
      {mode === ERROR_SAVE && (
        <Error
        message={"Could not save message. Please try again."}
        onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
        message={"Could not delete message. Please try again."}
        onClose={back}
        />
      )}
    </article>
  )
}