// ============================================================================
// FUNCIÓN: getAllBitacoras
// DESCRIPCIÓN: Listar bitácoras con filtros avanzados
// PARÁMETROS: page, limit, search, instructor, etapaProductiva, estado, fechaVencimiento
// FILTROS:
// - Por instructor asignado
// - Por etapa productiva
// - Por estado (Pendiente/Ejecutada/Verificada)
// - Por fecha vencimiento próxima
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParameters() - Parámetros filtro

// ============================================================================
// FUNCIÓN: getBitacoraById
// DESCRIPCIÓN: Obtener bitácora específica con detalles
// PARÁMETROS: bitacoraId
// INCLUYE:
// - Datos bitácora y número secuencial
// - Información aprendiz y EP
// - Instructor asignado
// - Archivos adjuntos
// - Historial observaciones
// - Estado validación
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe

// ============================================================================
// FUNCIÓN: createBitacora
// DESCRIPCIÓN: Crear nueva bitácora (automático al crear EP)
// PARÁMETROS: bitacoraData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, numeroBitacora
// - fechaPresentacion, fechaVencimiento
// REGLAS AUTOMÁTICAS:
// - numeroBitacora secuencial (1-12)
// - fechaVencimiento = fechaPresentacion + 15 días
// - estado inicial "Pendiente"
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateNumeroBitacoraSequence() - Número secuencial correcto
// - validateMaxBitacorasPerEP() - Máximo 12 bitácoras por EP
// - validateFechaPresentacionValid() - Fecha presentación válida
// FUNCIONES INTERNAS:
// - scheduleVencimientoAlert() - Programar alerta vencimiento
// - notifyInstructor() - Notificar instructor asignado

// ============================================================================
// FUNCIÓN: updateBitacora
// DESCRIPCIÓN: Actualizar bitácora existente
// PARÁMETROS: bitacoraId, updateData
// CAMPOS ACTUALIZABLES:
// - observaciones
// - observacionInstructor
// - archivoAdjunto
// - horasValidadas
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateCanUpdate() - Puede ser actualizada (no verificada)
// - validateInstructorAssigned() - Instructor asignado puede actualizar
// - validateFileFormat() - Formato archivo permitido

// ============================================================================
// FUNCIÓN: uploadBitacoraFile
// DESCRIPCIÓN: Subir archivo bitácora firmada
// PARÁMETROS: bitacoraId, file, uploaderUserId
// FORMATOS PERMITIDOS: PDF, DOC, DOCX
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateFileFormat() - Formato archivo válido
// - validateFileSize() - Tamaño archivo permitido
// - validateUserCanUpload() - Usuario puede subir archivo
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar en OneDrive
// - updateBitacoraStatus() - Actualizar a "Ejecutada"
// - notifyInstructor() - Notificar instructor para revisión

// ============================================================================
// FUNCIÓN: validateBitacora
// DESCRIPCIÓN: Marcar bitácora como verificada por instructor
// PARÁMETROS: bitacoraId, instructorId, horasAprobadas, observaciones
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateInstructorAuthorized() - Instructor autorizado
// - validateBitacoraExecuted() - Bitácora en estado "Ejecutada"
// - validateHorasAprobadas() - Horas aprobadas válidas
// - validateFileExists() - Archivo adjunto existe
// FUNCIONES INTERNAS:
// - updateBitacoraStatus() - Cambiar a "Verificada"
// - updateInstructorHours() - Sumar horas instructor
// - checkAllBitacorasCompleted() - Verificar si completó todas
// - updateEtapaProductivaProgress() - Actualizar progreso EP

// ============================================================================
// FUNCIÓN: rejectBitacora
// DESCRIPCIÓN: Rechazar bitácora por instructor
// PARÁMETROS: bitacoraId, instructorId, motivo
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateInstructorAuthorized() - Instructor autorizado
// - validateMotivoRequired() - Motivo rechazo requerido
// FUNCIONES INTERNAS:
// - updateBitacoraStatus() - Cambiar a "Pendiente"
// - addObservacionRechazo() - Agregar observación rechazo
// - notifyAprendiz() - Notificar aprendiz rechazo

// ============================================================================
// FUNCIÓN: getBitacorasByEtapaProductiva
// DESCRIPCIÓN: Bitácoras específicas de una EP
// PARÁMETROS: etapaProductivaId, includeFiles
// RESPUESTA: Lista ordenada por número bitácora

// ============================================================================
// FUNCIÓN: getBitacorasByInstructor
// DESCRIPCIÓN: Bitácoras asignadas a instructor
// PARÁMETROS: instructorId, estado, fechaInicio, fechaFin
// FILTROS: Por estado y rango fechas
// RESPUESTA: Lista con prioridad por vencimiento

// ============================================================================
// FUNCIÓN: addBitacoraObservacion
// DESCRIPCIÓN: Agregar observación a bitácora
// PARÁMETROS: bitacoraId, observacion, usuarioId, tipoObservacion
// TIPOS: "Instructor", "Coordinador", "Sistema"
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateObservacionRequired() - Observación no vacía
// - validateUserCanObserve() - Usuario puede observar

// ============================================================================
// FUNCIÓN: checkBitacorasVencidas
// DESCRIPCIÓN: Verificar bitácoras vencidas o próximas vencer
// PARÁMETROS: diasAnticipacion
// RESPUESTA: Lista bitácoras con alertas
// USO: Alertas automáticas sistema

// ============================================================================
// FUNCIÓN: getBitacoraProgress
// DESCRIPCIÓN: Progreso bitácora específica
// PARÁMETROS: bitacoraId
// RESPUESTA:
// - Estado actual
// - Días hasta vencimiento
// - Archivos adjuntos
// - Observaciones pendientes

// ============================================================================
// FUNCIÓN: generateBitacoraReport
// DESCRIPCIÓN: Reporte detallado bitácora
// PARÁMETROS: bitacoraId
// INCLUYE:
// - Datos completos bitácora
// - Historial observaciones
// - Enlaces archivos adjuntos
// - Timeline de actividades

// ============================================================================
// FUNCIÓN: bulkValidateBitacoras
// DESCRIPCIÓN: Validar múltiples bitácoras
// PARÁMETROS: bitacoraIds[], instructorId, observaciones
// USO: Instructor valida varias bitácoras simultáneamente

// ============================================================================
// FUNCIÓN: extendBitacoraDeadline
// DESCRIPCIÓN: Extender fecha vencimiento bitácora
// PARÁMETROS: bitacoraId, nuevaFechaVencimiento, motivo
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateCanExtend() - Puede extenderse
// - validateNewDateValid() - Nueva fecha válida
// - validateAuthorizedToExtend() - Usuario autorizado

// ============================================================================
// FUNCIÓN: getBitacorasByDateRange
// DESCRIPCIÓN: Bitácoras por rango fechas
// PARÁMETROS: fechaInicio, fechaFin, estado
// USO: Reportes mensuales y estadísticas

// ============================================================================
// FUNCIÓN: calculateBitacoraStatistics
// DESCRIPCIÓN: Estadísticas bitácoras
// PARÁMETROS: periodo, instructor, modalidad
// RESPUESTA:
// - Total bitácoras por estado
// - Promedio tiempo validación
// - Tasa cumplimiento plazos
// - Distribución por instructor