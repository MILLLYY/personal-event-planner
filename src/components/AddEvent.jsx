// src/components/AddEvent.jsx
import React, { useState, useContext, useEffect } from "react";
import { EventContext } from "../context/EventContext";
import { toast } from "react-toastify";
import EventSuccessAnimation from "./EventSuccessAnimation";
import "./AddEvent.css";

const AddEvent = () => {
  const { addEvent } = useContext(EventContext);
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    location: "",
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // auto-load saved form data from localStorage when the component mounts.
  useEffect(() => {
    const savedForm = localStorage.getItem("addEventForm");
    if (savedForm) {
      setEventForm(JSON.parse(savedForm));
    }
  }, []);

  // auto-save form data to localStorage whenever eventForm changes.
  useEffect(() => {
    localStorage.setItem("addEventForm", JSON.stringify(eventForm));
  }, [eventForm]);

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
      await addEvent(eventForm);
      toast.success("Event added successfully!");

      setEventForm({
        name: "",
        date: "",
        time: "",
        description: "",
        location: "",
      });
      localStorage.removeItem("addEventForm");

      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setIsSubmitting(false);
      }, 5000);
    } catch (error) {
      toast.error("Failed to add event. Please try again.");
      console.error("Error adding event:", error);
    }
  };

  return (
    <div className="add-event-wrapper">
      <h2>Add Event</h2>
      <EventSuccessAnimation show={showSuccessAnimation} />
      <form onSubmit={handleSubmit} className="add-event-form">
        <input
          name="name"
          placeholder="Event Name"
          value={eventForm.name}
          onChange={handleChange}
          required
          aria-label="Event Name"
        />
        <input
          name="date"
          type="date"
          value={eventForm.date}
          onChange={handleChange}
          required
          aria-label="Event Date"
        />
        <input
          name="time"
          type="time"
          value={eventForm.time}
          onChange={handleChange}
          required
          aria-label="Event Time"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={eventForm.description}
          onChange={handleChange}
          aria-label="Event Description"
        />
        <input
          name="location"
          placeholder="Location"
          value={eventForm.location}
          onChange={handleChange}
          aria-label="Event Location"
        />
        <button type="submit">
          {isSubmitting ? "Submitting..." : "Add Event"}
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
