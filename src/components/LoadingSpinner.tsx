export default function LoadingSpinner({ text = "Cargando..." }: { text?: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 text-lg">{text}</p>
            </div>
        </div>
    );
}
