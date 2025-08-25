import React, { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { useEvent } from "../context/EventContext";
import EventList from "../components/EventList";
import CalendarView from "../components/CalendarView";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import moment from "moment";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useUser(); // ensure Firebase is tracking user state correctly
  const { events = [] } = useEvent();
  const [filterQuery, setFilterQuery] = useState("");
  const db = getFirestore();
  const notifiedRef = useRef(new Set());

  const checkUpcomingEvents = async (userId) => {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

    const eventsRef = collection(db, "users", userId, "events");
    const querySnapshot = await getDocs(eventsRef);
    const q = query(eventsRef, where("userId", "==", userId));

    querySnapshot.forEach((doc) => {
      const event = doc.data();
      const eventTime = new Date(event.date + " " + event.time);

      if (eventTime > now && eventTime < fifteenMinutesLater) {
        new Notification("Upcoming Event", {
          body: `Your event "${event.name}" starts soon!`,
        });
      }
    });
  };

  useEffect(() => {
    //ensure the user is logged in before checking events
    if (!user) return;

    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission !== "granted") {
        alert(
          "Notifications are disabled. Enable them in browser settings to receive event reminders."
        );
        return;
      }

      console.log("Notifications enabled!");

      // call checkUpcomingEvents after permission is granted
      checkUpcomingEvents(user.uid);
    });

    //this starts the notification checking interval
    const interval = setInterval(() => {
      const now = moment();
      events.forEach((event) => {
        const eventKey = event.id
          ? event.id
          : `${event.name}-${event.date}-${event.time}`;
        if (!notifiedRef.current.has(eventKey)) {
          const eventTime = moment(
            `${event.date} ${event.time}`,
            "YYYY-MM-DD HH:mm"
          );
          const diff = eventTime.diff(now);
          if (diff > 0 && diff < 15 * 60 * 1000) {
            new Notification("Upcoming Event", {
              body: `Your event "${event.name}" starts soon!`,
            });
            notifiedRef.current.add(eventKey);
          }
        }
      });
    }, 60000);

    //this cleans up the interval when component unmounts
    return () => clearInterval(interval);

    //this ensures dependencies are tracked correctly
  }, [events, user]);

  // filters events based on the search query
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        {user ? (
          <h1 className="dashboard-greeting">
            Hii, {user.username || user.email}!
          </h1>
        ) : (
          <h1 className="dashboard-greeting">Welcome!</h1>
        )}
        <div className="dashboard-filter">
          <input
            type="text"
            placeholder="Search events..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            aria-label="Search events"
          />
        </div>
      </div>

      {}
      <div className="dashboard-content fade-in">
        <div className="dashboard-event-list">
          <EventList events={filteredEvents} />
        </div>
        <div className="dashboard-calendar-view">
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
