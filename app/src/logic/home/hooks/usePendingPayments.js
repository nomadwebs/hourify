// logic/usePendingPayments.js
import { useEffect, useState } from 'react'

export default function usePendingPayments(monthEarned, monthPayments) {
    const [pending, setPending] = useState(0)

    useEffect(() => {
        if (monthEarned !== undefined && monthPayments !== undefined) {
            const earned = Number(monthEarned || 0)
            const paid = Number(monthPayments || 0)
            setPending(earned - paid)
        }
    }, [monthEarned, monthPayments])

    return pending
}