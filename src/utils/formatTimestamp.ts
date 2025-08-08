export const formatTimestamp = (timestamp: number): string => {
    if (!timestamp) return '';

    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(timestamp));
};
