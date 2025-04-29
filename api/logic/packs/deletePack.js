import { Activity, Payment, Pack, User } from 'dat';
import { validate, errors } from 'com'; // Importa tus validaciones y errores

const { SystemError, NotFoundError, AuthorizationError } = errors;

export default async (userId, packId) => { // Usamos async directamente
    validate.id(packId, 'packId'); // Valida el formato del ID del pack
    validate.id(userId, 'userId'); // Valida el formato del ID del usuario solicitante

    try {
        // 1. Buscar el pack a eliminar
        console.log(`>>> Buscando pack ${packId}...`);
        const packToDelete = await Pack.findById(packId);

        // Si el pack no existe, lanzar error
        if (!packToDelete) {
            throw new NotFoundError(`Pack with ID ${packId} not found.`);
        }
        console.log(`>>> Pack ${packId} encontrado.`);


        // 2. Validar que el usuario solicitante tiene permiso (debe ser el proveedor)
        if (packToDelete.provider.toString() !== userId) {
            throw new AuthorizationError(`User with ID ${userId} is not authorized to delete pack ${packId}.`);
        }
        console.log(`>>> Usuario ${userId} autorizado.`);


        // --- PUNTO CRÍTICO: RIESGO DE INCONSISTENCIA EMPIEZA AQUÍ ---
        // Si el script falla *después* de cualquiera de las siguientes operaciones (deleteMany, updateOne, deleteOne)
        // pero antes de la última, los datos quedarán parcialmente eliminados/actualizados.

        // 3. Eliminar activities asociadas
        console.log(`>>> Eliminando activities asociadas al pack ${packId}...`);
        const deleteActivitiesResult = await Activity.deleteMany(
            { pack: packToDelete._id } // Filtra por el ID del pack asociado
        );
        console.log(`>>> Eliminadas ${deleteActivitiesResult.deletedCount} activities.`);

        // 4. Eliminar pagos asociados
        console.log(`>>> Eliminando payments asociados al pack ${packId}...`);
        const deletePaymentsResult = await Payment.deleteMany(
            { pack: packToDelete._id } // Filtra por el ID del pack asociado
        );
        console.log(`>>> Eliminados ${deletePaymentsResult.deletedCount} payments.`);


        // 5. Actualizar el usuario proveedor para eliminar la referencia del pack
        console.log(`>>> Eliminando referencia del pack ${packId} en ownPacks del usuario ${packToDelete.provider}...`);
        const updateUserResult = await User.updateOne(
            { _id: packToDelete.provider }, // Filtra por el ID del proveedor del pack
            { $pull: { ownPacks: packToDelete._id } } // Usa $pull para eliminar el ID del pack del array ownPacks
        );

        // Opcional: Verificar si se modificó el usuario (debería ser 1 si el ID estaba en el array)
        if (updateUserResult.modifiedCount === 0) {
            console.warn(`>>> Referencia del pack ${packId} no encontrada en ownPacks del usuario ${packToDelete.provider}.`);
        } else {
            console.log(`>>> Referencia del pack ${packId} eliminada de ownPacks del usuario ${packToDelete.provider}.`);
        }


        // 6. Eliminar el documento del pack principal
        console.log(`>>> Eliminando documento del pack ${packId}...`);
        const deletePackResult = await Pack.deleteOne(
            { _id: packToDelete._id } // Filtra por el ID del pack
        );

        // Verificar que el pack fue eliminado (debería ser 1)
        if (deletePackResult.deletedCount === 0) {
            console.error(`>>> ERROR: No se eliminó el documento del pack ${packId}. Dependencias ya eliminadas y usuario actualizado.`);
            // Aquí podrías considerar lanzar un error diferente o logear esto como una inconsistencia seria.
            // Esto deja datos inconsistentes (Pack existe, pero sus dependencias no y User no lo referencia).
            throw new SystemError(`Failed to delete pack document ${packId}. Data inconsistency possible.`);
        } else {
            console.log(`>>> Documento del pack ${packId} eliminado.`);
        }

        // Si llegamos aquí sin lanzar un error (excepto por el caso deleteCount === 0), consideramos que "funcionó".

        // Retornar un resultado
        return {
            success: deletePackResult.deletedCount > 0, // Consideramos éxito si el pack principal se eliminó
            packId: packId,
            deletedActivitiesCount: deleteActivitiesResult.deletedCount,
            deletedPaymentsCount: deletePaymentsResult.deletedCount,
            userOwnPacksModified: updateUserResult.modifiedCount > 0,
            note: deletePackResult.deletedCount === 0 ? 'Pack document was not deleted.' : undefined
        };

    } catch (error) {
        // Capturar y relanzar errores específicos o convertirlos a SystemError
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error; // Lanzar errores de negocio específicos
        } else {
            // Para otros errores (DB errors, etc.), lanzar un SystemError
            console.error(`>>> Error inesperado al eliminar pack ${packId}:`, error);
            throw new SystemError(`Error deleting pack: ${error.message}`);
        }
    }
};