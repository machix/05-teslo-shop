import { FC, useReducer } from "react";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface Props {
  children: React.ReactNode;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // methods
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
