import React, { createContext, useContext, useState } from 'react';

const SuccessMessageContext = createContext();

export const useSuccessMessage = () => useContext(SuccessMessageContext);

export const SuccessMessageProvider = ({ children }) => {
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000); // Efface après 3s
  };

  return (
    <SuccessMessageContext.Provider value={{ successMessage, setSuccessMessage, showSuccessMessage }}>
      {children}
    </SuccessMessageContext.Provider>
  );
};