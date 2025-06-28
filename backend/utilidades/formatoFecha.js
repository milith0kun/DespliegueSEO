/**
 * Utilidades para formateo de fechas
 */

/**
 * Formatea una fecha en formato legible
 * @param {Date|string} fecha - Fecha a formatear
 * @param {Object} opciones - Opciones de formateo
 * @returns {string} Fecha formateada
 */
exports.formatearFecha = (fecha, opciones = {}) => {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);
  
  const opcionesPorDefecto = {
    dia: true,
    hora: true,
    formato: 'es-ES'
  };
  
  const config = { ...opcionesPorDefecto, ...opciones };
  
  const opcionesFormato = {};
  
  if (config.dia) {
    opcionesFormato.day = '2-digit';
    opcionesFormato.month = '2-digit';
    opcionesFormato.year = 'numeric';
  }
  
  if (config.hora) {
    opcionesFormato.hour = '2-digit';
    opcionesFormato.minute = '2-digit';
  }
  
  return fechaObj.toLocaleString(config.formato, opcionesFormato);
};

/**
 * Calcula la diferencia entre dos fechas en formato legible
 * @param {Date|string} fechaInicio - Fecha inicial
 * @param {Date|string} fechaFin - Fecha final (por defecto es la fecha actual)
 * @returns {string} Diferencia en formato legible
 */
exports.tiempoTranscurrido = (fechaInicio, fechaFin = new Date()) => {
  const inicio = fechaInicio instanceof Date ? fechaInicio : new Date(fechaInicio);
  const fin = fechaFin instanceof Date ? fechaFin : new Date(fechaFin);
  
  const diferenciaMs = fin - inicio;
  const segundos = Math.floor(diferenciaMs / 1000);
  
  if (segundos < 60) {
    return 'hace un momento';
  }
  
  const minutos = Math.floor(segundos / 60);
  if (minutos < 60) {
    return `hace ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
  }
  
  const horas = Math.floor(minutos / 60);
  if (horas < 24) {
    return `hace ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
  }
  
  const dias = Math.floor(horas / 24);
  if (dias < 30) {
    return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`;
  }
  
  const meses = Math.floor(dias / 30);
  if (meses < 12) {
    return `hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }
  
  const años = Math.floor(meses / 12);
  return `hace ${años} ${años === 1 ? 'año' : 'años'}`;
};
