import { useQuery } from "@tanstack/react-query";
import type { IUser } from "../models/user"; // ajusta la ruta si es necesario

export const useClientById = (id: string) => {
    return useQuery<IUser, Error>({
        queryKey: ["client", id],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/clients/${id}`);
            if (!res.ok) {
                throw new Error("Error al obtener el cliente");
            }
            const { data } = await res.json();
            return data;
        },
        enabled: !!id,
    });
};
