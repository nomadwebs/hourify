import { errors, validate } from 'com'

const { SystemError } = errors

export default (userId, targetUserId, imageFile) => {
    if (!userId) throw new SystemError('userId is required')
    if (!targetUserId) throw new SystemError('targetUserId is required')
    if (!imageFile) throw new SystemError('imageFile is required')

    return (async () => {
        try {
            // Primero subimos la imagen
            const formData = new FormData()
            formData.append('image', imageFile)

            const uploadResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/uploadProfileImage`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.token}`
                },
                body: formData
            })
            console.log('uploadResponse: ', uploadResponse)

            if (!uploadResponse.ok) {
                const error = await uploadResponse.json()
                throw new SystemError(error.message)
            }

            const { imageUrl } = await uploadResponse.json()

            // Si la subida fue exitosa, actualizamos el perfil
            const updateResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/updateProfileImage/${targetUserId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ imageUrl })
            })
            console.log('updateResponse: ', updateResponse)
            if (!updateResponse.ok) {
                const error = await updateResponse.json()
                throw new SystemError(error.message)
            }

            return {
                success: true,
                message: 'Profile image updated successfully',
                imageUrl
            }

        } catch (error) {
            if (error instanceof SystemError) {
                return {
                    success: false,
                    error: 'SystemError',
                    message: error.message
                }
            } else {
                return {
                    success: false,
                    error: 'SystemError',
                    message: 'Failed to update profile image'
                }
            }
        }
    })()
} 