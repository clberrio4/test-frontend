import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IUser } from '../models/user';

interface UpdatePocketPayload {
    userId: string;
    balance: number;
    email: string;
}

const updatePocket = async ({ userId, balance, email }: UpdatePocketPayload): Promise<IUser> => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/clients/${userId}/pocket`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { balance, email } }),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(`Error al actualizar balance: ${error}`);
    }

    const updatedUser = await res.json();
    return updatedUser;
};

export const useUpdateUserPocket = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePocket,
        onSuccess: (data: any) => {
            const udtedUser: IUser = data.data;

            queryClient.setQueryData<IUser[]>(['clients'], (old) =>
                old?.map((client) => (client.id === udtedUser.id ? { ...client, ...udtedUser } : client))
            );
        },
    });
};
