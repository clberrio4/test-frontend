import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type {IUser}  from "../models/user";


type UserContextType = {
    selectedUser: IUser | null;
    setSelectedUser: (user: IUser | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    return (
        <UserContext.Provider value={{ selectedUser, setSelectedUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de un UserProvider");
    }
    return context;
};