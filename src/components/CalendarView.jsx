// src/components/CalendarView.jsx
import React, { useContext } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { EventContext } from "../context/EventContext";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";

const localizer = momentLocalizer(moment);

// CUSTOM TOOLBAR COMPONENT
// destructure toolbar properties for clarity and add accessibility attributes.
const CustomToolbar = ({ label, onNavigate, onView }) => {
  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          aria-label="Go to previous date"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          aria-label="Go to today"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          aria-label="Go to next date"
        >
          Next
        </button>
      </div>
      <span className="rbc-toolbar-label">{label}</span>
      <div className="rbc-btn-group view-buttons">
        <button type="button" onClick={() => onView("month")}>
          Month
        </button>
        <button type="button" onClick={() => onView("week")}>
          Week
        </button>
        <button type="button" onClick={() => onView("day")}>
          Day
        </button>
      </div>
    </div>
  );
};

const CalendarView = () => {
  // this ensures that  events are always an array
  const { events = [] } = useContext(EventContext);

  // parse events using Moment.js so that you reliably get Date objects
  const calendarEvents = events.map((ev) => ({
    title: ev.name,
    
    start: moment(`${ev.date} ${ev.time}`, "YYYY-MM-DD HH:mm").toDate(),
    end: moment(`${ev.date} ${ev.time}`, "YYYY-MM-DD HH:mm").toDate(),
    allDay: false,
  }));

  return (
    <div className="calendar-view">
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "50px" }}
        components={{
          toolbar: CustomToolbar, // this attaches the custom, interactive toolbar
        }}
      />
    </div>
  );
};

export default CalendarView;