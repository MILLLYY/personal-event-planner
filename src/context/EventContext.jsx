import React, { useState, createContext, useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const db = getFirestore();

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  //fetchs events from Firestore when the app loads
  const fetchEvents = async () => {
    try {
      const auth = getAuth();
      const userUid = auth.currentUser?.uid;

      if (!userUid) {
        console.log("User not authenticated.");
        return;
      }

      const eventsRef = collection(getFirestore(), "users", userUid, "events");
      const querySnapshot = await getDocs(eventsRef);

      if (!querySnapshot.empty) {
        const eventList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventList);
      } else {
        console.log("No events found.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (eventData) => {
    try {
      const userUid = auth.currentUser?.uid;
      if (!userUid) return;

      const eventsRef = collection(firestore, "users", userUid, "events");
      const docRef = await addDoc(eventsRef, eventData);
      const newEvent = { id: docRef.id, ...eventData };

      // Update local state so the dashboard shows it instantly
      setEvents((prev) => [...prev, newEvent]);

      return newEvent;
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  //Remove event from Firestore
  const removeEvent = async (eventId) => {
    try {
      const auth = getAuth();
      const userUid = auth.currentUser?.uid;

      if (!userUid) {
        console.error("User not authenticated.");
        return;
      }

      const eventRef = doc(getFirestore(), "users", userUid, "events", eventId);
      await deleteDoc(eventRef);

      console.log("Event deleted successfully!");
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Update event in Firestore
  const updateEvent = async (updatedEvent) => {
    const userUid = auth.currentUser?.uid;
    if (!userUid) {
      console.error("User not authenticated.");
      return;
    }

    try {
      const eventRef = doc(db, "users", userUid, "events", updatedEvent.id);
      await updateDoc(eventRef, updatedEvent);

      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  //  fetch events when the provider initializes

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchEvents();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <EventContext.Provider
      value={{ events, setEvents, addEvent, removeEvent, updateEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};

// add this export for `useEvent`
export const useEvent = () => useContext(EventContext);
