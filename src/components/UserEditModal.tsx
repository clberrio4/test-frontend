import React, { useEffect, useRef, useState } from "react";
import type { IUser } from "../models/user";

interface EditUserModalProps {
  user: IUser;
  onClose: () => void;
  loading: boolean;
  onSave: (updatedUser: { email: string; balance: number }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({ email: "", balance: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setFormData({ email: user.email, balance: user.balance });
    }
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  const handleSave = () => {
    onSave({ ...formData });
    onClose();
  };

  return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
                   
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Editar Usuario</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Cuanto Dinero vas a agreagar ($)
          </label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) =>
              setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })
            }
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition "
            disabled={loading}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
