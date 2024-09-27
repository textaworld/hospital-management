import { createContext, useReducer } from 'react';

export const ClassContext = createContext();

export const classReducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_DOCTOR':
      return {
        classs: Array.isArray(state.classs) ? [action.payload, ...state.classs] : [action.payload]
      };
    case 'SET_DOCTOR':
      return {
        classs: Array.isArray(action.payload) ? action.payload : []
      };
    case 'DELETE_DOCTOR':
      return {
        classs: Array.isArray(state.classs) ? state.classs.filter((w) => w._id !== action.payload) : []
      };
    default:
      return state;
  }
};

export const ClassContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(classReducer, {
    classs: [] // Ensure initial state is an array
  });

  return (
    <ClassContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ClassContext.Provider>
  );
};
