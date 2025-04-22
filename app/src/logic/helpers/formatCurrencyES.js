import { errors } from "com";

const { SystemError } = errors;

export default (amount) => {

    try {
        const formattedAmount = new Intl.NumberFormat('es-ES', {
            style: 'currency', currency: 'EUR'
        }).format(amount)

        return formattedAmount

    } catch {
        throw new SystemError(error.message)
    }

}