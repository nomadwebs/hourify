import { useState, useRef } from 'react'
import { Button } from '../../library'
import useContex from '../useContext'
import logic from '../../logic'

export default function ImageEditModal({ isOpen, onClose, onSave, currentImage }) {
    const [selectedImage, setSelectedImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const fileInputRef = useRef(null)
    const { alert } = useContex()

    const handleImageSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen no puede ser mayor a 2MB', 'error')
                return
            }
            setSelectedImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        if (!selectedImage) {
            alert('Por favor, selecciona una imagen', 'error')
            return
        }

        try {
            const userId = logic.getUserId()
            const result = await logic.updateProfileImage(userId, userId, selectedImage)
            console.log('result: ', result)
            if (result.success) {
                onSave(result.imageUrl)
                alert('Profile image has been updated', 'success')
                onClose()
            } else {
                alert(result.message, 'error')
            }
        } catch (error) {
            alert(error.message, 'error')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold mb-4">Editar imagen de perfil</h3>

                <div className="mb-4">
                    <div className="w-48 h-48 mx-auto mb-4 relative">
                        <img
                            src={preview || currentImage}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                    />
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full mb-2"
                    >
                        Seleccionar imagen
                    </Button>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-color_primary hover:bg-color_primaryHover"
                    >
                        Guardar
                    </Button>
                </div>
            </div>
        </div>
    )
} 