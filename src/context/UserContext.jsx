import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

//create the context
export const UserContext = createContext();

//a provider component to wrap the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  //listens for changes in authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : null;

          setUser(currentUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //registers a new user and stores their profile in firestore
  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      //saves user profile to firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        uid: user.uid,
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  //log in an existing user
  const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      //sets user immediately after login
      setUser(user);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  //log out the current user
  const logoutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  //provide user data and auth functions to the rest of the app
  return (
    <UserContext.Provider
      value={{ user, loading, registerUser, loginUser, logoutUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
