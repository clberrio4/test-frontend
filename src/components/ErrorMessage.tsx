interface ErrorMessageProps {
    title?: string;
    message?: string;
}

export default function ErrorMessage({
    title = "¡Ups! Algo salió mal",
    message = "Ocurrió un error inesperado.",
}: ErrorMessageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-2">{title}</h2>
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    );
}
