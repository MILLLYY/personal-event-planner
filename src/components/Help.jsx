// src/components/Help.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Help.css";

const helpCards = [
  {
    id: 1,
    title: "Navigation",
    content:
      "Use the fixed header to seamlessly switch between your Dashboard, Add Event, and Help pages.",
  },
  {
    id: 2,
    title: "Login",
    content:
      "Sign in using your registered email and password. Forgot your details? Check your registration info.",
  },
  {
    id: 3,
    title: "Dashboard",
    content:
      "View your upcoming events in an organized list. Manage, edit, or delete events as needed.",
  },
  {
    id: 4,
    title: "Add Event",
    content:
      "Fill out the Add Event form with a few key details (name, date, time). Your event will appear immediately upon saving.",
  },
  {
    id: 5,
    title: "Edit/Delete",
    content:
      "Easily update or remove events when plans change – changes show up right away.",
  },
];

const FAQs = [
  {
    id: 1,
    question: "How do I create an event?",
    answer:
      "Go to the  the 'Add Event' page, fill in the details, and save. It will automatically appear in your dashboard.",
  },
  {
    id: 2,
    question: "How do I delete an event?",
    answer:
      "Go to your dashboard and click the 'Delete' button next to the event you wish to remove.",
  },
  {
    id: 3,
    question: "How do I update my profile?",
    answer:
      "profiles are not available yet ,coming soon..",
  },
  {
    id: 3,
    question: "How to see upcoming events?",
    answer:
      "Go to the 'Dashboard' page and you will see all of your upcoming events. ",
  },
  {
    id: 3,
    question: "I can't see my event?",
    answer:
      "If you previously added an event but can not see it anymore,search for your event on the search-event bar.",
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  // this filters FAQs based on the search query
  const filteredFAQs = FAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id) => setExpandedFAQ(expandedFAQ === id ? null : id);

  return (
    <div className="help-page">
      <motion.div
        className="help-content"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="help-title">Congradulations, Rockstar!!</h2>
        <p className="help-subtitle">
          Welcome to Envesta,We are here to help you get started.
          </p>
          <p>Browse our 
          quick help cards or search some specific topics for any further help.
        </p>

        {/* this is for help Cards with scaling effect */}
        <div className="help-cards">
          {helpCards.map((card) => (
            <motion.div
              key={card.id}
              className="help-card"
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 12px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <h3>{card.title}</h3>
              <p>{card.content}</p>
            </motion.div>
          ))}
        </div>

        {/* this is for the search Input */}
        <input
          type="text"
          className="faq-search"
          placeholder="Search help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search help topics"
        />

        {/* this is for FAQ Accordion with scaling and bounce effects */}
        <div className="faq-list">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="faq-item">
              <motion.button
                className="faq-question"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={expandedFAQ === faq.id ? "true" : "false"}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {faq.question}
                <motion.span
                  className={`arrow ${expandedFAQ === faq.id ? "rotated" : ""}`}
                  animate={{
                    // bounce effect when expanded
                    scale: expandedFAQ === faq.id ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  ▼
                </motion.span>
              </motion.button>
              <AnimatePresence>
                {expandedFAQ === faq.id && (
                  <motion.div
                    className="faq-answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          {filteredFAQs.length === 0 && (
            <p className="no-results">No matching topics found.</p>
          )}
        </div>

        
      </motion.div>
    </div>
  );
};

export default Help;