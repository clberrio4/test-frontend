type Props = {
    name: string;
    lastname: string;
    balance: number;
};

export default function BalanceHeader({ name, lastname, balance }: Props) {
    const color =
        balance >= 400000 ? "text-green-600" :
            balance >= 100000 ? "text-yellow-500" : "text-red-600";

    return (
        <>
            <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-900">
                Hola <span className="text-blue-600">{name} {lastname}</span>, ¿deseas abrir un fondo?
            </h1>

            <h3 className="mt-2 mb-6 text-center text-gray-700">
                Monto disponible:
                <span className={`font-semibold ml-1 ${color}`}>
                    ${balance.toLocaleString()}
                </span>
            </h3>
        </>
    );
}
