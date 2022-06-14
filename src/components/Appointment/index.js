import React, { Fragment } from 'react';
import "/Users/nika/scheduletaketwo/src/components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";
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

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  return (
    <article className="appointment">
    <Header time={props.time} />
    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === CREATE && (
        <Form
          interviewers={[]}
          onCancel={() => back()}
        />
    )}
    {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
    </article>
  )
}