// src/components/EventItem.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../context/EventContext";
import "./EventItem.css";

//component to display a single event item
const EventItem = ({ event }) => {
  //destructure context values
  const { events, setEvents, removeEvent } = useContext(EventContext);
  return (
    <div className="event-item">
      <div className="event-content">
        <h3 className="event-title">{event.name}</h3>
        <p className="event-datetime">
          {event.date} at {event.time}
        </p>
        {event.description && (
          <p className="event-description">{event.description}</p>
        )}
        {event.location && (
          <p className="event-location">
            <em>{event.location}</em>
          </p>
        )}
      </div>
      <button
        className="delete-button"
        onClick={async () => {
          //remove event from firestore via context function
          await removeEvent(event.id);

          //update local state to reflect deletion
          setEvents(events.filter((e) => e.id !== event.id)); // Remove from state
        }}
      >
        Delete
      </button>
      <Link to={`/edit-event/${event.id}`}>
        <button className="edit-button">Edit</button>
      </Link>
    </div>
  );
};

export default EventItem;
