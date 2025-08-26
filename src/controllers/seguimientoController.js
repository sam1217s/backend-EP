// ============================================================================
// FUNCIÓN: getAllSeguimientos
// DESCRIPCIÓN: Listar seguimientos con filtros
// PARÁMETROS: page, limit, search, instructor, etapaProductiva, estado, tipo
// FILTROS:
// - Por instructor responsable
// - Por etapa productiva
// - Por estado (Programada/Ejecutada/Pendiente/Verificada)
// - Por tipo (Inicial/Intermedio/Final)
// - Por fecha programada próxima
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParams() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getSeguimientoById
// DESCRIPCIÓN: Obtener seguimiento específico con detalles
// PARÁMETROS: seguimientoId
// INCLUYE:
// - Datos seguimiento y tipo
// - Información aprendiz y EP
// - Instructor asignado
// - Documentos adjuntos
// - Resultados seguimiento
// - Plan mejoramiento si aplica
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe

// ============================================================================
// FUNCIÓN: createSeguimiento
// DESCRIPCIÓN: Crear nuevo seguimiento (automático al crear EP)
// PARÁMETROS: seguimientoData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, numeroSeguimiento, tipo
// - fechaProgramada, fechaLimite
// REGLAS AUTOMÁTICAS:
// - 3 seguimientos por EP (Inicial, Intermedio, Final)
// - fechaProgramada distribuida en tiempo EP
// - fechaLimite = fechaProgramada + 7 días
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateNumeroSeguimientoSequence() - Número secuencial (1-3)
// - validateTipoSeguimientoCorresponds() - Tipo corresponde a número
// - validateFechaProgramadaValid() - Fecha programada dentro período EP
// FUNCIONES INTERNAS:
// - assignInstructorSeguimiento() - Asignar instructor
// - scheduleAlerts() - Programar alertas vencimiento

// ============================================================================
// FUNCIÓN: updateSeguimiento
// DESCRIPCIÓN: Actualizar seguimiento existente
// PARÁMETROS: seguimientoId, updateData
// CAMPOS ACTUALIZABLES:
// - fechaProgramada (solo si no ejecutado)
// - observaciones
// - observacionInstructor
// - resultados
// - planMejoramiento
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateCanUpdate() - Puede ser actualizado
// - validateInstructorAuthorized() - Instructor autorizado actualizar

// ============================================================================
// FUNCIÓN: executeSeguimiento
// DESCRIPCIÓN: Marcar seguimiento como ejecutado
// PARÁMETROS: seguimientoId, instructorId, resultados, planMejoramiento
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateInstructorAuthorized() - Instructor asignado autorizado
// - validateSeguimientoNotExecuted() - No ejecutado previamente
// - validateResultadosRequired() - Resultados obligatorios
// - validateDateInRange() - Fecha ejecución dentro rango permitido
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Ejecutada"
// - updateInstructorHours() - Sumar 2 horas instructor
// - scheduleNextSeguimiento() - Programar siguiente si aplica
// - checkAllSeguimientosCompleted() - Verificar completitud

// ============================================================================
// FUNCIÓN: uploadSeguimientoDocument
// DESCRIPCIÓN: Subir documento seguimiento
// PARÁMETROS: seguimientoId, file, uploaderUserId
// FORMATOS: PDF, DOC, DOCX
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateFileFormat() - Formato válido
// - validateFileSize() - Tamaño permitido
// - validateUserCanUpload() - Usuario puede subir
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar archivo
// - linkFileToSeguimiento() - Vincular archivo

// ============================================================================
// FUNCIÓN: verifySeguimiento
// DESCRIPCIÓN: Verificar seguimiento por coordinador
// PARÁMETROS: seguimientoId, coordinadorId, observaciones
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateSeguimientoExecuted() - Seguimiento ejecutado
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateDocumentExists() - Documento adjunto existe
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Verificada"
// - updateEtapaProductivaProgress() - Actualizar progreso EP

// ============================================================================
// FUNCIÓN: rejectSeguimiento
// DESCRIPCIÓN: Rechazar seguimiento
// PARÁMETROS: seguimientoId, coordinadorId, motivo
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Pendiente"
// - addObservacionRechazo() - Agregar observación
// - notifyInstructor() - Notificar instructor

// ============================================================================
// FUNCIÓN: getSeguimientosByEtapaProductiva
// DESCRIPCIÓN: Seguimientos de EP específica
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Los 3 seguimientos ordenados por número

// ============================================================================
// FUNCIÓN: getSeguimientosByInstructor
// DESCRIPCIÓN: Seguimientos asignados a instructor
// PARÁMETROS: instructorId, estado, fechaInicio, fechaFin
// RESPUESTA: Lista con prioridad por fecha límite

// ============================================================================
// FUNCIÓN: createSeguimientoExtraordinario
// DESCRIPCIÓN: Crear seguimiento extraordinario por problemas
// PARÁMETROS: etapaProductivaId, instructorId, motivo, fechaProgramada
// CASOS USO: Problemas en empresa, aprendiz con dificultades
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorExists() - Instructor existe
// - validateMotivoRequired() - Motivo obligatorio
// - validateNotExceedMaxSeguimientos() - No exceder límite
// FUNCIONES INTERNAS:
// - assignAdditionalHours() - Asignar 2 horas adicionales
// - createSpecialAlert() - Crear alerta especial

// ============================================================================
// FUNCIÓN: scheduleSeguimientoDate
// DESCRIPCIÓN: Programar nueva fecha seguimiento
// PARÁMETROS: seguimientoId, nuevaFecha, motivo
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateNotExecuted() - No ejecutado aún
// - validateNewDateValid() - Nueva fecha válida
// - validateInAdvance() - Con mínimo 24h anticipación

// ============================================================================
// FUNCIÓN: addSeguimientoObservacion
// DESCRIPCIÓN: Agregar observación seguimiento
// PARÁMETROS: seguimientoId, observacion, usuarioId, tipo
// TIPOS: "Instructor", "Coordinador", "Sistema", "Empresa"

// ============================================================================
// FUNCIÓN: getSeguimientosVencidos
// DESCRIPCIÓN: Seguimientos vencidos o próximos vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas automáticas

// ============================================================================
// FUNCIÓN: getSeguimientoProgress
// DESCRIPCIÓN: Progreso seguimiento específico
// PARÁMETROS: seguimientoId
// RESPUESTA:
// - Estado actual
// - Días hasta límite
// - Documentos adjuntos
// - Avance plan mejoramiento

// ============================================================================
// FUNCIÓN: generateSeguimientoReport
// DESCRIPCIÓN: Reporte detallado seguimiento
// PARÁMETROS: seguimientoId
// INCLUYE:
// - Datos completos seguimiento
// - Resultados detallados
// - Plan mejoramiento
// - Historial observaciones

// ============================================================================
// FUNCIÓN: bulkScheduleSeguimientos
// DESCRIPCIÓN: Programar múltiples seguimientos
// PARÁMETROS: etapaProductivaIds[], fechasProgramadas[]
// USO: Programación masiva mensual

// ============================================================================
// FUNCIÓN: calculateSeguimientoStatistics
// DESCRIPCIÓN: Estadísticas seguimientos
// PARÁMETROS: periodo, instructor, modalidad
// RESPUESTA:
// - Total seguimientos por estado
// - Tasa cumplimiento fechas
// - Promedio tiempo ejecución
// - Distribución por tipo

// ============================================================================
// FUNCIÓN: validateAllSeguimientosCompleted
// DESCRIPCIÓN: Validar si EP completó todos seguimientos
// PARÁMETROS: etapaProductivaId
// RESPUESTA: boolean + detalles faltantes
// USO: Validación previa certificación