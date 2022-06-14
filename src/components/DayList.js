import React from "react";

import DayListItem from "./DayListItem";

export default function DayList(props) {
  let {days} = props;
  console.log(props.value);
  return (
    days.map(day =>
      <DayListItem
        key={day.id} 
        name={day.name} 
        spots={day.spots} 
        selected={day.name === props.day}
        setDay={props.setDay}
      />
    )
  )
}