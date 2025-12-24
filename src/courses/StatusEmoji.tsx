
export function statusEmoji(status: string) {
    switch (status) {
        case "Open": return "🟢";
        case "Closed": return "🟦";
        default: return "⚠️";
    }
}