// ============================================================================
// FUNCIÓN: getAllAsignaciones
// DESCRIPCIÓN: Listar todas las asignaciones con filtros
// PARÁMETROS: page, limit, search, instructor, modalidad, estado, fechaInicio, fechaFin
// FILTROS:
// - Por instructor específico
// - Por modalidad EP
// - Por estado asignación (Activo/Inactivo/Reasignado)
// - Por rango fechas asignación
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilter() - Rango fechas válido
// RESPUESTA: Lista asignaciones con datos instructor, aprendiz, modalidad

// ============================================================================
// FUNCIÓN: getAsignacionById  
// DESCRIPCIÓN: Obtener asignación específica con detalles
// PARÁMETROS: asignacionId
// INCLUYE:
// - Datos instructor y aprendiz
// - Detalles etapa productiva y modalidad
// - Horas programadas vs ejecutadas
// - Historial observaciones
// - Estado actual y fechas
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe

// ============================================================================
// FUNCIÓN: createAsignacion
// DESCRIPCIÓN: Crear nueva asignación instructor a EP
// PARÁMETROS: asignacionData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, instructorId, tipoInstructor
// - horasProgramadas, fechaAsignacion
// TIPOS INSTRUCTOR:
// - "Seguimiento": 2 horas base + 1 hora cada 4 bitácoras
// - "Técnico": Horas variables según modalidad
// - "Proyecto": 8 horas mensuales por proyecto
// VALIDACIONES CRÍTICAS:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorExists() - Instructor existe y activo
// - validateTipoInstructorCompatible() - Tipo compatible con modalidad
// - validateInstructorDisponible() - Instructor tiene horas disponibles
// - validateNoAsignacionDuplicada() - No duplicar asignación mismo tipo
// - validateAreaTematicaCompatible() - Área temática instructor compatible
// - validateHorasProgramadasValidas() - Horas según parámetros modalidad
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Actualizar proyección horas
// - createNotifications() - Notificar instructor y coordinador
// - scheduleBitacoraReviews() - Programar revisión bitácoras
// - updateEtapaProductivaInstructors() - Actualizar EP

// ============================================================================
// FUNCIÓN: updateAsignacion
// DESCRIPCIÓN: Actualizar asignación existente
// PARÁMETROS: asignacionId, updateData  
// CAMPOS ACTUALIZABLES:
// - horasProgramadas (con validaciones)
// - observaciones
// - estado
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanUpdate() - Puede ser actualizada
// - validateNewHorasDisponibles() - Instructor tiene horas disponibles
// - validateHorasNotExceedExecuted() - No reducir bajo horas ejecutadas

// ============================================================================
// FUNCIÓN: deleteAsignacion
// DESCRIPCIÓN: Eliminar/inactivar asignación
// PARÁMETROS: asignacionId, motivo
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanDelete() - Puede ser eliminada
// - validateMotivoRequired() - Motivo eliminación
// - validateNoActiveActivities() - Sin actividades pendientes
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Liberar horas instructor
// - transferPendingActivities() - Transferir actividades pendientes

// ============================================================================
// FUNCIÓN: reassignInstructor
// DESCRIPCIÓN: Reasignar EP de un instructor a otro
// PARÁMETROS: asignacionId, nuevoInstructorId, motivo
// CASOS USO:
// - Instructor se va o no disponible
// - Redistribución carga trabajo
// - Cambio área temática
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateNuevoInstructorExists() - Nuevo instructor existe y activo
// - validateNuevoInstructorDisponible() - Nuevo instructor disponible
// - validateAreaTematicaCompatible() - Nueva área temática compatible
// - validateMotivoReasignacion() - Motivo reasignación válido
// FUNCIONES INTERNAS:
// - updateAsignacionAnterior() - Marcar asignación anterior como reasignada
// - createNuevaAsignacion() - Crear nueva asignación
// - transferActivitiesPendientes() - Transferir actividades
// - updateProyeccionesHoras() - Actualizar ambos instructores
// - notifyAllStakeholders() - Notificar todos involucrados

// ============================================================================
// FUNCIÓN: getAsignacionesByInstructor
// DESCRIPCIÓN: Asignaciones específicas de un instructor
// PARÁMETROS: instructorId, estado, includeCompleted
// RESPUESTA: Lista asignaciones con progreso y fechas

// ============================================================================
// FUNCIÓN: getAsignacionesByEtapaProductiva
// DESCRIPCIÓN: Todos instructores asignados a una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Lista instructores con tipos y horas

// ============================================================================
// FUNCIÓN: updateHorasEjecutadas
// DESCRIPCIÓN: Actualizar horas ejecutadas en asignación
// PARÁMETROS: asignacionId, horasEjecutadas, descripcion
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe y activa
// - validateHorasNoExceedProgramadas() - No exceder horas programadas
// - validateDescripcionRequired() - Descripción actividad requerida
// - validateHorasPositivas() - Horas positivas
// FUNCIONES INTERNAS:
// - updateRegistroHoras() - Crear registro horas detallado
// - updateInstructorProyeccion() - Actualizar proyección
// - checkCompletionStatus() - Verificar si completó asignación

// ============================================================================
// FUNCIÓN: extendHorasProgramadas
// DESCRIPCIÓN: Extender horas programadas asignación
// PARÁMETROS: asignacionId, horasAdicionales, motivo
// CASOS USO: EP requiere más tiempo del programado
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanExtend() - Puede extenderse
// - validateInstructorDisponibilidad() - Instructor disponible
// - validateMotivoExtension() - Motivo extensión válido

// ============================================================================
// FUNCIÓN: getAsignacionProgress
// DESCRIPCIÓN: Progreso detallado asignación
// PARÁMETROS: asignacionId
// RESPUESTA:
// - Porcentaje horas ejecutadas
// - Actividades completadas
// - Bitácoras revisadas
// - Seguimientos realizados
// - Tiempo restante estimado

// ============================================================================
// FUNCIÓN: generateAsignacionReport
// DESCRIPCIÓN: Generar reporte asignación
// PARÁMETROS: asignacionId, periodoInicio, periodoFin
// INCLUYE:
// - Resumen horas ejecutadas
// - Actividades realizadas
// - Observaciones registradas
// - Evaluación cumplimiento

// ============================================================================
// FUNCIÓN: bulkReassignInstructores
// DESCRIPCIÓN: Reasignación masiva instructores
// PARÁMETROS: instructorSalienteId, instructorNuevoId, motivo
// USO: Instructor sale del sistema
// VALIDACIONES:
// - validateInstructorSalienteExists() - Instructor saliente existe
// - validateInstructorNuevoCapacidad() - Nuevo instructor capacidad
// - validateAreasTematicasCompatibles() - Areas compatibles

// ============================================================================
// FUNCIÓN: checkAsignacionesVencidas
// DESCRIPCIÓN: Verificar asignaciones próximas vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas automáticas sistema

// ============================================================================
// FUNCIÓN: calculateInstructorWorkload
// DESCRIPCIÓN: Calcular carga trabajo instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA: Distribución horas por asignación y modalidad