import React, { useState, useEffect } from "react";
import Button from  "components/Button";
import InterviewerList from "components/InterviewerList";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  const [interviewerError, setInterviewerError] = useState("");

  const reset = () => {
    setName("");
    setInterviewer(null);
    setError("");
    setInterviewerError("");
  }

  const cancel = () => {
    reset();
    props.onCancel();
  }

  const validate = () => {
    if (name === "" && interviewer === null) {
      setError("Student name cannot be blank");
      setInterviewerError("Please select an interviewer");
      return;
    }

    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }

    if (interviewer === null) {
      setInterviewerError("Please select an interviewer");
      return;
    }
    
    setError("");
    setInterviewerError("");
    props.onSave(name, interviewer);
  };

  useEffect(() => {
    setInterviewerError("");
  }, [interviewer]);

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
        <input
          className="appointment__create-input text--semi-bold"
          name="name"
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setError("");
          }}
          data-testid="student-name-input"
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <section className="appointment__validation">{interviewerError}</section>
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => validate()}>Save</Button>
        </section>
      </section>
    </main>
  );
}; 