import { useState } from "react";
import { useUser } from "../context/UserContext";
import type { IUser } from "../models/user";
import { useClients } from '../hooks/useClients';
import EditUserModal from "../components/UserEditModal";
import { useUpdateUserPocket } from "../hooks/useUpdateClient";
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function HomePage() {
    const { setSelectedUser } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [modalUser, setModalUser] = useState<IUser | null>(null);
    const navigate = useNavigate();

    const { clients, isLoading, isError, error } = useClients();
    const { mutate: updatePocket, isPending } = useUpdateUserPocket();

    const handleEditClick = (user: IUser) => {
        setModalUser(user);
        setShowModal(true);
    };

    const handleSave = (updatedUser: { email: string; balance: number; }) => {
        if (!modalUser) return;
        updatePocket(
            { ...updatedUser, userId: modalUser.id },
            {
                onError: (error) => {
                    alert(error.message);
                }
            }
        );
        if (!isPending) {
            setShowModal(false);
        }
    };

    const handleNavigate = (user: IUser) => {
        setSelectedUser(user);
        navigate(`/user/${user.id}`);
    };

    if (isLoading) return <LoadingSpinner />;
    if (isError) return <ErrorMessage message={error!.message} />;

    return (
        <div className="h-full overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 p-6 pb-12">
                {clients!.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white shadow-xl rounded-2xl p-6 pb-8 flex flex-col items-center text-center transition transform hover:scale-[1.02] hover:shadow-2xl"
                    >
                        <img src={user.avatarUrl} alt={user.name}
                            className="w-32 h-32 rounded-full ring-4 ring-blue-100 shadow-md mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                        <p className="text-sm text-gray-500 break-words leading-snug">{user.email}</p>
                        <p className="text-sm text-gray-600 font-medium mt-1">💰 ${user.balance.toLocaleString()}</p>

                        <div className="flex gap-3 mt-4">
                            <button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md p-2 shadow-lg transition"
                                onClick={() => handleEditClick(user)}>Editar</button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md p-2 shadow-lg transition"
                                onClick={() => handleNavigate(user)}>Suscribirme</button>
                        </div>
                    </div>
                ))}
            </div>
            {showModal && modalUser && (
                <EditUserModal
                    user={modalUser}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    loading={isPending}
                />
            )}
        </div>
    );
}
