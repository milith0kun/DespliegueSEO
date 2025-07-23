/**
 * Controlador de contactos
 * Gestiona operaciones CRUD para contactos y formularios de contacto
 */

const contactoModel = require('../modelos/contactoModel');

/**
 * Obtiene todos los contactos
 */
const getContactos = async (req, res) => {
    try {
        // Parámetros de paginación y filtrado
        const options = {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
            estado: req.query.estado,
            servicio: req.query.servicio,
            busqueda: req.query.busqueda
        };
        
        // Usar el modelo para obtener los contactos
        const result = await contactoModel.getContactos(options);
        
        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination
        });
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene un contacto por su ID
 */
const getContactoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Usar el modelo para obtener el contacto
        const contacto = await contactoModel.getContactoById(id);
        
        // Verificar si el contacto existe
        if (!contacto) {
            return res.status(404).json({
                success: false,
                message: 'Contacto no encontrado'
            });
        }
        
        return res.status(200).json({
            success: true,
            data: contacto
        });
    } catch (error) {
        console.error('Error al obtener contacto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Crea un nuevo contacto (desde el formulario público)
 */
const createContacto = async (req, res) => {
    try {
        const { nombre, email, telefono, mensaje, servicio } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, email y mensaje son requeridos'
            });
        }
        
        // Crear el objeto de contacto
        const nuevoContacto = {
            nombre,
            email,
            telefono,
            mensaje,
            servicio: servicio || 'general',
            estado: 'pendiente'
        };
        
        // Usar el modelo para crear el contacto
        const contactoCreado = await contactoModel.createContacto(nuevoContacto);
        
        return res.status(201).json({
            success: true,
            message: 'Mensaje enviado correctamente',
            data: contactoCreado
        });
    } catch (error) {
        console.error('Error al crear contacto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Actualiza el estado de un contacto
 */
const updateEstadoContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        // Validar campo requerido
        if (!estado) {
            return res.status(400).json({
                success: false,
                message: 'El estado es requerido'
            });
        }
        
        // Usar el modelo para actualizar el estado
        try {
            const result = await contactoModel.updateEstadoContacto(id, estado);
            
            return res.status(200).json({
                success: true,
                message: 'Estado del contacto actualizado correctamente'
            });
        } catch (error) {
            if (error.message === 'Contacto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error al actualizar estado del contacto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Añade una nota a un contacto
 */
const addNotaContacto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nota } = req.body;
        
        // Validar campo requerido
        if (!nota) {
            return res.status(400).json({
                success: false,
                message: 'La nota es requerida'
            });
        }
        
        // Obtener nombre del usuario desde la sesión
        const nombreUsuario = req.session.user.nombre;
        
        // Usar el modelo para añadir la nota
        try {
            const result = await contactoModel.addNotaContacto(id, nota, nombreUsuario);
            
            return res.status(200).json({
                success: true,
                message: 'Nota añadida correctamente',
                data: {
                    texto: nota,
                    fecha: new Date().toISOString(),
                    usuario: nombreUsuario
                }
            });
        } catch (error) {
            if (error.message === 'Contacto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error al añadir nota al contacto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Elimina un contacto
 */
const deleteContacto = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Usar el modelo para eliminar el contacto
        try {
            const result = await contactoModel.deleteContacto(id);
            
            return res.status(200).json({
                success: true,
                message: 'Contacto eliminado correctamente'
            });
        } catch (error) {
            if (error.message === 'Contacto no encontrado') {
                return res.status(404).json({
                    success: false,
                    message: 'Contacto no encontrado'
                });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

/**
 * Obtiene estadísticas de contactos
 */
const getEstadisticasContactos = async (req, res) => {
    try {
        // Usar el modelo para obtener las estadísticas
        const estadisticas = await contactoModel.getEstadisticas();
        
        return res.status(200).json({
            success: true,
            data: estadisticas
        });
    } catch (error) {
        console.error('Error al obtener estadísticas de contactos:', error);
        return res.status(500).json({
            success: false,
            message: 'Error en el servidor'
        });
    }
};

module.exports = {
    getContactos,
    getContactoById,
    createContacto,
    updateEstadoContacto,
    addNotaContacto,
    deleteContacto,
    getEstadisticasContactos
};
