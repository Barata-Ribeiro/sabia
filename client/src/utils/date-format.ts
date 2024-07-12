export function dateFormat(dateString: string, locale: string) {
    const date = new Date(dateString)
    const isEnglish = locale === "en"

    return date.toLocaleDateString(isEnglish ? "en-US" : "pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

export function dateTimeFormat(dateString: string, locale: string) {
    const date = new Date(dateString)
    const isEnglish = locale === "en"

    const selectYearMonthAndDay = date.toLocaleDateString(isEnglish ? "en-US" : "pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })

    const selectTime = date.toLocaleTimeString(isEnglish ? "en-US" : "pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    })

    return selectTime + " · " + selectYearMonthAndDay
}

export function dateToHowLongAgo(dateString: string, locale: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)

    const isEnglish = locale === "en"

    if (diffSec < 60) return isEnglish ? "Just now" : "Agora"
    else if (diffMin < 60) return `${diffMin} min`
    else if (diffHour < 24) return `${diffHour} ${isEnglish ? "hour" : "hora"}${diffHour > 1 ? "s" : ""}`
    else
        return date.toLocaleDateString(isEnglish ? "en-US" : "pt-BR", {
            month: "short",
            day: "numeric"
        })
}
