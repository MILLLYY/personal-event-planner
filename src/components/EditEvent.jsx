import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EventContext } from "../context/EventContext";
import { toast } from "react-toastify";
import "./EditEvent.css";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, updateEvent } = useContext(EventContext);

  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    location: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const existingEvent = events.find((e) => e.id === id);
    if (existingEvent) {
      setEventForm(existingEvent);
    } else {
      toast.error("Event not found.");
      navigate("/dashboard");
    }
  }, [id, events, navigate]);

  const handleChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventForm.name || !eventForm.date || !eventForm.time) {
      toast.error("Please fill in Event Name, Date, and Time.");
      return;
    }

    const eventDateTime = new Date(`${eventForm.date}T${eventForm.time}`);
    if (eventDateTime < new Date()) {
      toast.error("The event date and time must be in the future.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateEvent({ ...eventForm, id });
      toast.success("Event updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to update event.");
      console.error("Update error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-event-wrapper">
      <h2>Edit Event</h2>
      <form onSubmit={handleSubmit} className="edit-event-form">
        <input
          name="name"
          placeholder="Event Name"
          value={eventForm.name}
          onChange={handleChange}
          required
        />
        <input
          name="date"
          type="date"
          value={eventForm.date}
          onChange={handleChange}
          required
        />
        <input
          name="time"
          type="time"
          value={eventForm.time}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={eventForm.description}
          onChange={handleChange}
        />
        <input
          name="location"
          placeholder="Location"
          value={eventForm.location}
          onChange={handleChange}
        />
        <button type="submit">
          {isSubmitting ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
