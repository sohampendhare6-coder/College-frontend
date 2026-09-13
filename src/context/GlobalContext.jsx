import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getUsers } from "../api/users";

const UsersContext = createContext({
  users: [],
  setUsers: () => {},
  usersOptions: [],
  student: [],
  userNameMap: {},
});

export const GlobalContextProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const userNameMap = useMemo(() => {
    return users.reduce((acc, item) => {
      return {
        ...acc,
        [item.email]: item.email,
      };
    }, {});
  }, [users]);

  const usersOptions = useMemo(() => {
    return users.map((user) => ({
      label: userNameMap[user.email],
      value: user.email,
      role: user.role,
    }));
  }, [users, userNameMap]);

  const value = useMemo(
    () => ({
      users,
      setUsers,
      userNameMap,
      usersOptions,
    }),
    [users, userNameMap, usersOptions]
  );
  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider"
    );
  }
  return context;
};
