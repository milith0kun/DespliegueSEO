/**
 * Controlador para manejar las operaciones relacionadas con el formulario de contacto
 */

const { query } = require('../configuracion/db');
const { logger } = require('../utilidades/logger');
const { v4: uuidv4 } = require('uuid');
const { sendEmail, generarPlantillaNotificacion, generarPlantillaRespuesta } = require('../configuracion/email.config');
const { formatearFecha } = require('../utilidades/formatoFecha');

/**
 * Crea un nuevo mensaje de contacto
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
exports.crearContacto = async (req, res) => {
  const { nombre, email, telefono, empresa, mensaje, servicio_id } = req.body;
  
  try {
    // Validación básica
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({
        error: 'Los campos nombre, email y mensaje son obligatorios'
      });
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'El formato del correo electrónico no es válido'
      });
    }

    // Si se proporciona un servicio_id, verificar que exista y obtener su nombre
    let servicioNombre = null;
    if (servicio_id) {
      const servicioExiste = await query(
        'SELECT id, nombre FROM servicios WHERE id = $1',
        [servicio_id]
      );
      
      if (servicioExiste.rows.length === 0) {
        return res.status(404).json({
          error: 'El servicio especificado no existe'
        });
      }
      
      servicioNombre = servicioExiste.rows[0].nombre;
    }

    // Generar ID único para el contacto
    const contactoId = uuidv4();
    
    // Insertar en la base de datos
    const nuevoContacto = await query(
      `INSERT INTO contactos 
       (id, nombre, email, telefono, empresa, mensaje, servicio_id, estado)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'nuevo')
       RETURNING id, nombre, email, estado, fecha_creacion`,
      [contactoId, nombre, email, telefono || null, empresa || null, mensaje, servicio_id || null]
    );

    // Preparar datos para la notificación
    const contactoData = {
      ...nuevoContacto.rows[0],
      telefono,
      empresa,
      mensaje,
      servicio_nombre: servicioNombre
    };

    // Enviar notificación por correo al administrador
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
        subject: `Nuevo mensaje de contacto - ${nombre}`,
        html: generarPlantillaNotificacion(contactoData)
      });
      logger.info(`Notificación de contacto enviada a administrador: ${contactoId}`);
    } catch (emailError) {
      // No fallamos la petición si el correo falla, solo lo registramos
      logger.error('Error al enviar notificación de contacto:', emailError);
    }

    logger.info(`Nuevo contacto creado: ${email} - ${nombre} (ID: ${contactoId})`);
    
    res.status(201).json({
      mensaje: 'Mensaje enviado con éxito',
      contacto: nuevoContacto.rows[0]
    });

  } catch (error) {
    logger.error('Error al crear contacto:', error);
    res.status(500).json({
      error: 'Error interno del servidor al procesar el mensaje'
    });
  }
};

/**
 * Obtiene todos los mensajes de contacto (solo para administradores)
 */
exports.obtenerContactos = async (req, res) => {
  try {
    // Parámetros de paginación y filtrado
    const pagina = parseInt(req.query.pagina) || 1;
    const porPagina = parseInt(req.query.limite) || 10;
    const estado = req.query.estado || null;
    const busqueda = req.query.busqueda || null;
    
    // Calcular offset para paginación
    const offset = (pagina - 1) * porPagina;
    
    // Construir consulta base
    let sql = `
      SELECT c.*, s.nombre as servicio_nombre
      FROM contactos c
      LEFT JOIN servicios s ON c.interes_servicio = s.id
    `;
    
    // Agregar condiciones de filtrado
    const params = [];
    const condiciones = [];
    
    if (estado) {
      params.push(estado);
      condiciones.push(`c.estado = ?`);
    }
    
    if (busqueda) {
      params.push(`%${busqueda}%`);
      params.push(`%${busqueda}%`);
      params.push(`%${busqueda}%`);
      condiciones.push(`(c.nombre LIKE ? OR c.email LIKE ? OR c.mensaje LIKE ?)`);
    }
    
    if (condiciones.length > 0) {
      sql += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    // Agregar ordenamiento y paginación
    sql += ` ORDER BY c.creado_en DESC LIMIT ? OFFSET ?`;
    params.push(porPagina, offset);
    
    // Ejecutar consulta principal
    const resultado = await query(sql, params);
    
    // Consulta para obtener el total de registros (para metadata de paginación)
    let sqlCount = `SELECT COUNT(*) as total FROM contactos c`;
    if (condiciones.length > 0) {
      sqlCount += ` WHERE ${condiciones.join(' AND ')}`;
    }
    
    const resultadoCount = await query(sqlCount, params.slice(0, -2)); // Excluir los parámetros de LIMIT y OFFSET
    const total = resultadoCount.rows[0].total;
    
    // Formatear resultados
    const mensajes = resultado.rows.map(mensaje => ({
      ...mensaje,
      creado_en_formato: formatearFecha(mensaje.creado_en),
      respondido_en_formato: mensaje.ultimo_contacto ? formatearFecha(mensaje.ultimo_contacto) : null
    }));
    
    res.json({
      mensajes,
      metadata: {
        total,
        pagina,
        porPagina,
        totalPaginas: Math.ceil(total / porPagina)
      }
    });
  } catch (error) {
    logger.error('Error al obtener contactos:', error);
    res.status(500).json({
      error: 'Error al obtener los mensajes de contacto'
    });
  }
};

/**
 * Obtiene un mensaje de contacto específico por su ID
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
exports.obtenerContactoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resultado = await query(
      `SELECT c.*, s.nombre as servicio_nombre
       FROM contactos c
       LEFT JOIN servicios s ON c.interes_servicio = s.id
       WHERE c.id = ?`,
      [id]
    );
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: 'Mensaje no encontrado'
      });
    }
    
    const mensaje = resultado.rows[0];
    
    // Formatear fechas
    mensaje.creado_en_formato = formatearFecha(mensaje.creado_en);
    if (mensaje.ultimo_contacto) {
      mensaje.ultimo_contacto_formato = formatearFecha(mensaje.ultimo_contacto);
    }
    
    res.json({ mensaje });
  } catch (error) {
    logger.error('Error al obtener mensaje por ID:', error);
    res.status(500).json({
      error: 'Error al obtener el mensaje de contacto'
    });
  }
};

/**
 * Obtiene estadísticas de los mensajes de contacto
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
exports.obtenerEstadisticas = async (req, res) => {
  try {
    // Total de mensajes
    const totalResult = await query('SELECT COUNT(*) as total FROM contactos');
    const totalMensajes = totalResult.rows[0].total;
    
    // Mensajes por estado
    const porEstadoResult = await query(
      'SELECT estado, COUNT(*) as cantidad FROM contactos GROUP BY estado'
    );
    
    // Mensajes por prioridad
    const porPrioridadResult = await query(
      'SELECT prioridad, COUNT(*) as cantidad FROM contactos GROUP BY prioridad'
    );
    
    // Mensajes por servicio
    const porServicioResult = await query(
      `SELECT s.nombre, COUNT(c.id) as cantidad 
       FROM contactos c 
       LEFT JOIN servicios s ON c.interes_servicio = s.id 
       GROUP BY s.nombre`
    );
    
    // Mensajes por mes (últimos 6 meses)
    const porMesResult = await query(
      `SELECT 
         DATE_FORMAT(creado_en, '%Y-%m') as mes, 
         COUNT(*) as cantidad 
       FROM contactos 
       WHERE creado_en >= DATE_SUB(NOW(), INTERVAL 6 MONTH) 
       GROUP BY DATE_FORMAT(creado_en, '%Y-%m') 
       ORDER BY mes ASC`
    );
    
    // Tiempo promedio de respuesta (en horas)
    const tiempoRespuestaResult = await query(
      `SELECT 
         AVG(TIMESTAMPDIFF(HOUR, creado_en, ultimo_contacto)) as promedio 
       FROM contactos 
       WHERE ultimo_contacto IS NOT NULL`
    );
    
    const estadisticas = {
      totalMensajes,
      mensajesPorEstado: porEstadoResult.rows,
      mensajesPorPrioridad: porPrioridadResult.rows,
      mensajesPorServicio: porServicioResult.rows,
      mensajesPorMes: porMesResult.rows,
      tiempoPromedioRespuesta: tiempoRespuestaResult.rows[0]?.promedio || 0
    };
    
    res.json(estadisticas);
  } catch (error) {
    logger.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      error: 'Error al obtener estadísticas de mensajes'
    });
  }
};

/**
 * Responde a un mensaje de contacto
 * @param {Object} req - Objeto de solicitud de Express
 * @param {Object} res - Objeto de respuesta de Express
 */
exports.responderContacto = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta, asunto } = req.body;
    
    if (!respuesta) {
      return res.status(400).json({
        error: 'La respuesta es obligatoria'
      });
    }
    
    // Verificar que el mensaje existe
    const mensajeResult = await query(
      'SELECT * FROM contactos WHERE id = $1',
      [id]
    );
    
    if (mensajeResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Mensaje no encontrado'
      });
    }
    
    const mensaje = mensajeResult.rows[0];
    
    // Preparar datos para la respuesta
    const datosRespuesta = {
      nombre: mensaje.nombre,
      respuesta: respuesta
    };
    
    // Enviar correo electrónico usando la configuración centralizada
    await sendEmail({
      to: mensaje.email,
      subject: asunto || `Re: Consulta en Ecos del SEO`,
      html: generarPlantillaRespuesta(datosRespuesta)
    });
    
    // Actualizar estado del mensaje
    await query(
      `UPDATE contactos 
       SET estado = 'respondido', 
           ultimo_contacto = CURRENT_TIMESTAMP, 
           notas = CONCAT(COALESCE(notas, ''), '\n\n--- Respuesta enviada el ', NOW(), ' ---\n', $1)
       WHERE id = $2`,
      [respuesta, id]
    );
    
    logger.info(`Respuesta enviada al contacto ID: ${id} - ${mensaje.email}`);
    
    res.json({
      mensaje: 'Respuesta enviada correctamente',
      id
    });
  } catch (error) {
    logger.error('Error al responder mensaje:', error);
    res.status(500).json({
      error: 'Error al responder al mensaje de contacto'
    });
  }
};

/**
 * Actualiza el estado de un mensaje de contacto (solo para administradores)
 */
exports.actualizarEstadoContacto = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Validar que el estado sea válido
    const estadosValidos = ['nuevo', 'en_proceso', 'atendido', 'archivado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado no válido. Debe ser uno de: ${estadosValidos.join(', ')}`
      });
    }

    // Verificar si el contacto existe
    const contactoExiste = await query(
      'SELECT id FROM contactos WHERE id = $1',
      [id]
    );

    if (contactoExiste.rows.length === 0) {
      return res.status(404).json({
        error: 'El contacto especificado no existe'
      });
    }

    // Actualizar el estado
    const resultado = await query(
      `UPDATE contactos 
       SET estado = $1, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, estado, fecha_actualizacion`,
      [estado, id]
    );

    logger.info(`Estado del contacto ${id} actualizado a: ${estado}`);
    
    res.json({
      mensaje: 'Estado actualizado correctamente',
      contacto: resultado.rows[0]
    });

  } catch (error) {
    logger.error('Error al actualizar estado de contacto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
