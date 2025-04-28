import mongoose from 'mongoose';
import { Activity, Pack, User } from "dat"
import { validate, errors } from 'com'

const { SystemError, NotFoundError, OwnershipError } = errors

export default async (userId, activityId) => { // Usamos async directamente
    validate.id(activityId, 'activityId'); // Valida el formato del ID de la activity
    validate.id(userId, 'userId'); // Valida el formato del ID del usuario

    try {
        // 1. Buscar la activity a eliminar
        const activityToDelete = await Activity.findById(activityId);

        if (!activityToDelete) {
            throw new NotFoundError(`Activity with ID ${activityId} not found.`);
        }

        // 2. Buscar el pack asociado a la activity
        const associatedPack = await Pack.findById(activityToDelete.pack);

        // Si el pack asociado no existe (dato inconsistente), lanzar error
        if (!associatedPack) {
            // Esto indica un problema de integridad de datos
            console.error(`>>> ERROR DE INTEGRIDAD: Associated Pack with ID ${activityToDelete.pack} for activity ${activityId} not found.`);
            throw new SystemError(`Associated Pack for activity ${activityId} not found.`);
        }

        // 3. Validar que el usuario sea el dueño del pack (el proveedor)
        if (associatedPack.provider.toString() !== userId) {
            throw new AuthorizationError(`User with ID ${userId} is not authorized to delete activity ${activityId} as they are not the provider of the associated pack.`);
        }

        // 4. Revertir la cantidad en el pack
        let newRemainingQuantity = associatedPack.remainingQuantity;

        switch (activityToDelete.operation) {
            case 'substract':
                // Si la actividad restó cantidad, al eliminarla debemos sumarla de vuelta
                newRemainingQuantity += activityToDelete.quantity;
                console.log(`>>> Revertida operación 'substract': sumando ${activityToDelete.quantity} de vuelta al pack ${associatedPack._id}.`);
                break;
            case 'add':
                // Si la actividad sumó cantidad, al eliminarla debemos restarla de vuelta
                newRemainingQuantity -= activityToDelete.quantity;
                console.log(`>>> Revertida operación 'add': restando ${activityToDelete.quantity} del pack ${associatedPack._id}.`);
                break;
            case 'manual adjustment':
                console.warn(`>>> La activity ${activityId} es de tipo 'manual adjustment'. No se ajustará automáticamente la cantidad del pack ${associatedPack._id}.`);
                // No se hace ajuste automático por seguridad.
                break;
            default:
                console.warn(`>>> Operación de activity desconocida "${activityToDelete.operation}" para activity ${activityId}. No se ajustará la cantidad del pack.`);
        }

        // --- PUNTO CRÍTICO: RIESGO DE INCONSISTENCIA AQUÍ ---
        // Si el script falla *después* de esta actualización pero *antes* de la eliminación de la Activity,
        // el Pack tendrá la cantidad ajustada, pero la Activity *no* se habrá eliminado.

        // 5. Actualizar el pack con la nueva cantidad restante
        const updatePackResult = await Pack.updateOne(
            { _id: associatedPack._id },
            { $set: { remainingQuantity: newRemainingQuantity } }
        );
        console.log(`>>> Pack ${associatedPack._id} actualizado (modificados: ${updatePackResult.modifiedCount}).`);


        // 6. Eliminar la activity
        const deleteActivityResult = await Activity.deleteOne(
            { _id: activityToDelete._id }
        );

        // Verificar que la activity fue eliminada (debería ser 1)
        if (deleteActivityResult.deletedCount === 0) {
            console.error(`>>> ERROR: No se eliminó el documento de activity ${activityId}. El Pack ${associatedPack._id} ya fue ajustado.`);
            // Aquí podrías considerar lanzar un error diferente o logear esto como una inconsistencia seria.
            // Por ahora, simplemente logeamos el error y continuamos.
        } else {
            console.log(`>>> Documento de activity ${activityId} eliminado.`);
        }

        // Si llegamos aquí sin lanzar un error (excepto quizás por deleteCount === 0), consideramos que "funcionó".

        // Retornar un resultado
        return {
            success: deleteActivityResult.deletedCount > 0, // Consideramos éxito si la activity se eliminó
            activityId: activityId,
            packId: associatedPack._id,
            packNewRemainingQuantity: newRemainingQuantity,
            packModified: updatePackResult.modifiedCount > 0,
            note: deleteActivityResult.deletedCount === 0 ? 'Activity document was not deleted.' : undefined
        };

    } catch (error) {
        // Capturar y relanzar errores específicos o convertirlos a SystemError
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error; // Lanzar errores de negocio específicos
        } else {
            // Para otros errores (DB errors, etc.), lanzar un SystemError
            console.error(`>>> Error inesperado al eliminar activity ${activityId}:`, error);
            throw new SystemError(`Error deleting activity: ${error.message}`);
        }
    }
};
