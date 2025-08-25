import React, { useContext, useState, useEffect } from "react";
import { EventContext } from "../context/EventContext";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import EventItem from "./EventItem";
import "./EventList.css";

const EventList = () => {
  const { events, setEvents } = useContext(EventContext); //ensure events can be updated
  const [sortOrder, setSortOrder] = useState("asc");
  const db = getFirestore();

  useEffect(() => {
    const fetchEvents = async () => {
      const userUid = auth.currentUser?.uid;
      if (!userUid) return;

      const eventsRef = collection(firestore, "users", userUid, "events");
      const snapshot = await getDocs(eventsRef);
      const fetchedEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, []);

  //  sort events based on date/time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date + " " + a.time);
    const dateB = new Date(b.date + " " + b.time);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      <div className="filter-sort">
        <label>
          Sort by Date:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {}
      {!events.length ? (
        <p>Loading events...</p>
      ) : (
        sortedEvents.map((event) => <EventItem key={event.id} event={event} />)
      )}
    </div>
  );
};

export default EventList;
