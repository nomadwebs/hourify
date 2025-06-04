import logic from "../../../logic/index.js"
import { createFunctionalHandler } from '../../helpers/index.js'

export default createFunctionalHandler((req, res) => {

    // req.file contiene info sobre el archivo subido
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        })
    }

    // Por ejemplo, la URL accesible puede ser:
    const imageUrl = `/images/profile/${req.file.filename}`
    console.log('imageUrl: ', imageUrl)

    // Aquí puedes actualizar la base de datos del usuario si quieres

    res.status(201).json({
        success: true,
        imageUrl
    })

    /* return logic.uploadProfileImage(req, res)
        .then(imageUrl => {
            res.status(201).json({
                success: true,
                imageUrl
            })
        })
        .catch(error => {
            res.status(400).json({
                success: false,
                error: error.name,
                message: error.message
            })
        }) */
}) 