import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [eventId, setEventId] = useState(null);

  const setEvent = (id) => {
    setEventId(id);
  };

  return (
    <EventContext.Provider value={{ eventId, setEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
