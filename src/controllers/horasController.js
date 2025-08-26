// ============================================================================
// FUNCIÓN: getAllRegistroHoras
// DESCRIPCIÓN: Listar registros horas con filtros
// PARÁMETROS: page, limit, search, instructor, mes, año, tipoActividad, aprobado
// FILTROS:
// - Por instructor específico
// - Por mes y año
// - Por tipo actividad (Seguimiento/Revisión Bitácora/Asesoría Técnica/Asesoría Proyecto)
// - Por estado aprobación
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateFilters() - Filtros fecha válidos

// ============================================================================
// FUNCIÓN: getRegistroHorasById
// DESCRIPCIÓN: Obtener registro horas específico
// PARÁMETROS: registroHorasId
// INCLUYE:
// - Datos registro horas
// - Información instructor y EP
// - Detalles actividad realizada
// - Estado aprobación
// VALIDACIONES:
// - validateRegistroExists() - Registro existe

// ============================================================================
// FUNCIÓN: createRegistroHoras
// DESCRIPCIÓN: Crear nuevo registro horas
// PARÁMETROS: registroHorasData
// CAMPOS OBLIGATORIOS:
// - instructorId, etapaProductivaId, aprendizId
// - fecha, tipoActividad, horasRegistradas, descripcion
// REGLAS HORAS POR ACTIVIDAD:
// - Seguimiento: 2 horas fijas
// - Revisión Bitácora: 0.25 horas (1 hora cada 4 bitácoras)
// - Asesoría Técnica: Variable según modalidad
// - Asesoría Proyecto: Variable según tipo proyecto
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe y activo
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorAssigned() - Instructor asignado a EP
// - validateTipoActividadValid() - Tipo actividad válido
// - validateHorasWithinLimits() - Horas dentro límites (0.5-8 diarias)
// - validateFechaNotFuture() - Fecha no futura
// - validateNoDuplicateEntry() - No duplicar mismo día/actividad
// - validateDescripcionRequired() - Descripción obligatoria
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Actualizar proyección horas
// - createApprovalRequest() - Crear solicitud aprobación

// ============================================================================
// FUNCIÓN: updateRegistroHoras
// DESCRIPCIÓN: Actualizar registro horas (solo si no aprobado)
// PARÁMETROS: registroHorasId, updateData
// CAMPOS ACTUALIZABLES:
// - horasRegistradas
// - descripcion
// - observaciones
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateNotApproved() - No aprobado aún
// - validateInstructorOwner() - Instructor propietario
// - validateHorasValid() - Nuevas horas válidas

// ============================================================================
// FUNCIÓN: approveRegistroHoras
// DESCRIPCIÓN: Aprobar registro horas
// PARÁMETROS: registroHorasId, coordinadorId, observaciones
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateNotApproved() - No aprobado previamente
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateWithinMonthlyLimit() - Dentro límite mensual instructor
// FUNCIONES INTERNAS:
// - updateRegistroStatus() - Marcar como aprobado
// - updateInstructorTotalHours() - Actualizar total horas instructor
// - createPayrollEntry() - Crear entrada nómina
// - notifyInstructor() - Notificar aprobación

// ============================================================================
// FUNCIÓN: rejectRegistroHoras
// DESCRIPCIÓN: Rechazar registro horas
// PARÁMETROS: registroHorasId, coordinadorId, motivo
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - addRejectionObservation() - Agregar observación rechazo
// - notifyInstructorRejection() - Notificar instructor

// ============================================================================
// FUNCIÓN: getHorasByInstructor
// DESCRIPCIÓN: Horas instructor por período
// PARÁMETROS: instructorId, mes, año, includeDetails
// RESPUESTA:
// - Total horas por tipo actividad
// - Horas aprobadas vs pendientes
// - Distribución por EP
// - Comparativo meses anteriores

// ============================================================================
// FUNCIÓN: getHorasByEtapaProductiva
// DESCRIPCIÓN: Horas registradas en EP específica
// PARÁMETROS: etapaProductivaId, mes, año
// RESPUESTA: Desglose horas por instructor y actividad

// ============================================================================
// FUNCIÓN: generateInstructorTimesheet
// DESCRIPCIÓN: Generar hoja tiempo instructor
// PARÁMETROS: instructorId, mes, año
// INCLUYE:
// - Detalle diario actividades
// - Total horas por tipo
// - Estado aprobación
// - Observaciones coordinador

// ============================================================================
// FUNCIÓN: bulkApproveHoras
// DESCRIPCIÓN: Aprobar múltiples registros horas
// PARÁMETROS: registroHorasIds[], coordinadorId, observaciones
// VALIDACIONES:
// - validateAllRegistrosExist() - Todos registros existen
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateNoneApproved() - Ninguno aprobado previamente

// ============================================================================
// FUNCIÓN: calculateInstructorPayroll
// DESCRIPCIÓN: Calcular nómina instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA:
// - Horas aprobadas por tipo
// - Tarifas por actividad
// - Total a pagar
// - Deducciones si aplica

// ============================================================================
// FUNCIÓN: getMonthlyHoursSummary
// DESCRIPCIÓN: Resumen mensual horas centro
// PARÁMETROS: mes, año, programa
// RESPUESTA:
// - Total horas por modalidad
// - Distribución por instructor
// - Comparativo presupuestado vs ejecutado
// - Tendencias y proyecciones

// ============================================================================
// FUNCIÓN: validateInstructorMonthlyLimit
// DESCRIPCIÓN: Validar límite mensual instructor
// PARÁMETROS: instructorId, mes, año, horasAdicionales
// REGLAS:
// - Máximo 160 horas mensuales base
// - Horas extra requieren aprobación especial
// - Distribución balanceada entre modalidades

// ============================================================================
// FUNCIÓN: createHorasFromActivities
// DESCRIPCIÓN: Crear registros horas automáticamente desde actividades
// PARÁMETROS: instructorId, mes, año
// FUENTES:
// - Seguimientos ejecutados (2h c/u)
// - Bitácoras validadas (0.25h c/u)
// - Asesorías programadas
// FUNCIONES INTERNAS:
// - getSeguimientosExecuted() - Obtener seguimientos mes
// - getBitacorasValidated() - Obtener bitácoras validadas
// - getAsesoriasRegistered() - Obtener asesorías registradas

// ============================================================================
// FUNCIÓN: getInstructorOvertime
// DESCRIPCIÓN: Calcular horas extra instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA: Horas que exceden límite mensual

// ============================================================================
// FUNCIÓN: generateHorasReport
// DESCRIPCIÓN: Generar reporte horas detallado
// PARÁMETROS: fechaInicio, fechaFin, instructorId, programa
// INCLUYE:
// - Resumen ejecutivo
// - Desglose por actividad
// - Análisis tendencias
// - Recomendaciones optimización

// ============================================================================
// FUNCIÓN: proyectarHorasProximoMes
// DESCRIPCIÓN: Proyectar horas instructor próximo mes
// PARÁMETROS: instructorId, mesProyeccion, añoProyeccion
// BASADO EN:
// - EP activas asignadas
// - Seguimientos programados
// - Bitácoras estimadas
// - Asesorías planificadas

// ============================================================================
// FUNCIÓN: getHoursStatistics
// DESCRIPCIÓN: Estadísticas horas sistema
// PARÁMETROS: periodo, modalidad, tipoInstructor
// RESPUESTA:
// - Promedio horas por modalidad
// - Distribución por tipo instructor
// - Eficiencia por actividad
// - Tendencias mensuales

// ============================================================================
// FUNCIÓN: exportHorasToExcel
// DESCRIPCIÓN: Exportar horas a Excel para nómina
// PARÁMETROS: mes, año, instructorIds[]
// FORMATO: Compatible con sistema nómina SENA