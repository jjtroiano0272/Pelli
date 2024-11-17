import { createContext, useContext, useState, ReactNode } from 'react';

// [ AS JAVASCRIPT]
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setAuth = authUser => {
    setUser(authUser);
  };

  const setUserData = userData => {
    setUser({ ...userData });
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

/**
|--------------------------------------------------
|  [ AS TYPESCRIPT]
|--------------------------------------------------
*/
// type Props = {
//   children?: ReactNode;
// };

// type IAuthContext = {
//   // authenticated: boolean;
//   // setAuthenticated: (newState: boolean) => void;
//   user: Record<string, any> | null;
//   setAuth: (authUser: Record<string, any>) => void;
//   setUserData: (userData: Record<string, any>) => void;
// };

// Was previously createContext()
// const AuthContext = createContext<IAuthContext | null>(null);

// export const AuthProvider = ({ children }: Props) => {
//   const [user, setUser] = useState<Record<string, any> | null>(null);

//   const setAuth = (authUser: Record<string, any>) => {
//     setUser(authUser);
//   };

//   const setUserData = (userData: Record<string, any>) => {
//     setUser({ ...userData });
//   };

//   return (
//     <AuthContext.Provider value={{ user, setAuth, setUserData }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
