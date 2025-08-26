// ============================================================================
// FUNCIÓN: getAllInstructores  
// DESCRIPCIÓN: Listar instructores con filtros
// PARÁMETROS: page, limit, search, especialidad, tipoContrato, estado
// FILTROS:
// - Por nombre o documento
// - Por especialidad/área temática  
// - Por tipo contrato (Planta/Contratista)
// - Por estado (Activo/Inactivo/Vacaciones/Licencia)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParameters() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getInstructorById
// DESCRIPCIÓN: Obtener instructor con detalles completos
// PARÁMETROS: instructorId  
// INCLUYE:
// - Datos personales instructor
// - Asignaciones actuales EP
// - Horas programadas/ejecutadas mes actual
// - Proyección horas próximos meses
// - Historial asignaciones
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe

// ============================================================================
// FUNCIÓN: createInstructor
// DESCRIPCIÓN: Crear nuevo instructor
// PARÁMETROS: instructorData
// CAMPOS OBLIGATORIOS:
// - numeroDocumento, tipoDocumento, nombres, apellidos
// - email, especialidad, tipoContrato
// - areasTematicas, horasMensualesDisponibles
// VALIDACIONES:
// - validateDocumentUnique() - Documento único
// - validateEmailUnique() - Email único formato @sena.edu.co
// - validateTipoContrato() - Tipo contrato válido
// - validateAreasTematicas() - Áreas temáticas válidas
// - validateHorasDisponibles() - Horas disponibles positivas
// FUNCIONES INTERNAS:
// - createUserAccount() - Crear cuenta acceso sistema
// - sendWelcomeEmail() - Enviar credenciales acceso

// ============================================================================
// FUNCIÓN: updateInstructor
// DESCRIPCIÓN: Actualizar datos instructor
// PARÁMETROS: instructorId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos personales
// - Especialidad y áreas temáticas
// - Horas mensuales disponibles
// - Estado (Activo/Inactivo/Vacaciones/Licencia)
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateUpdateData() - Datos válidos
// - validateEmailUniqueOnUpdate() - Email único si cambia
// - validateNoActiveAssignments() - Sin asignaciones si inactiva

// ============================================================================
// FUNCIÓN: deleteInstructor
// DESCRIPCIÓN: Inactivar instructor
// PARÁMETROS: instructorId, motivo
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateNoActiveAssignments() - No asignaciones activas
// - validateMotivoRequired() - Motivo inactivación
// FUNCIONES INTERNAS:
// - reassignActiveEtapas() - Reasignar EP activas si aplica
// - notifyAffectedUsers() - Notificar usuarios afectados

// ============================================================================
// FUNCIÓN: getInstructorAsignaciones
// DESCRIPCIÓN: Asignaciones actuales instructor
// PARÁMETROS: instructorId, estado (opcional)
// RESPUESTA: Lista asignaciones con detalles EP y aprendices

// ============================================================================
// FUNCIÓN: getInstructorCargaTrabajo
// DESCRIPCIÓN: Carga trabajo actual instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA:
// - Horas programadas total
// - Horas ejecutadas total
// - Porcentaje utilización
// - Horas disponibles restantes
// - Distribución por modalidad

// ============================================================================
// FUNCIÓN: getInstructorProyeccionHoras
// DESCRIPCIÓN: Proyección horas próximos meses
// PARÁMETROS: instructorId, mesesAdelante
// RESPUESTA: Proyección mensual con distribución detallada

// ============================================================================
// FUNCIÓN: updateInstructorDisponibilidad
// DESCRIPCIÓN: Actualizar disponibilidad mensual instructor
// PARÁMETROS: instructorId, mes, año, horasDisponibles
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateMesAño() - Mes y año válidos
// - validateHorasDisponibles() - Horas positivas
// - validateNotExceedAssigned() - No exceder horas asignadas

// ============================================================================
// FUNCIÓN: checkInstructorOverload  
// DESCRIPCIÓN: Verificar sobrecarga horas instructor
// PARÁMETROS: instructorId, mes, año
// ALERTAS:
// - Sobrecarga horas mensuales
// - Proyección sobrecarga próximos meses
// - Recomendaciones redistribución

// ============================================================================
// FUNCIÓN: getInstructorsByArea
// DESCRIPCIÓN: Instructores disponibles por área temática
// PARÁMETROS: areaTematica, modalidad, horasRequeridas
// FILTROS:
// - Por área temática específica
// - Compatible con modalidad
// - Con horas disponibles suficientes
// RESPUESTA: Lista instructores con disponibilidad

// ============================================================================
// FUNCIÓN: assignInstructorToEtapa
// DESCRIPCIÓN: Asignar instructor a etapa productiva
// PARÁMETROS: instructorId, etapaProductivaId, tipoInstructor, horasProgramadas
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe y activo
// - validateEtapaProductivaExists() - EP existe y activa
// - validateTipoInstructorCompatible() - Tipo compatible con modalidad
// - validateInstructorDisponibilidad() - Instructor tiene horas disponibles
// - validateAreaTematicaCompatible() - Área temática compatible
// - validateNoAsignacionDuplicada() - No duplicar asignación mismo tipo
// FUNCIONES INTERNAS:
// - createAsignacion() - Crear registro asignación
// - updateProyeccionHoras() - Actualizar proyección instructor
// - notifyStakeholders() - Notificar asignación

// ============================================================================
// FUNCIÓN: removeInstructorFromEtapa
// DESCRIPCIÓN: Quitar instructor de etapa productiva
// PARÁMETROS: instructorId, etapaProductivaId, motivo
// VALIDACIONES:
// - validateAssignmentExists() - Asignación existe
// - validateMotivoRequired() - Motivo retiro
// - validateCanRemove() - Puede ser removido
// FUNCIONES INTERNAS:
// - updateAsignacionStatus() - Actualizar estado asignación
// - adjustProyeccionHoras() - Ajustar proyección horas
// - findReplacementInstructor() - Buscar reemplazo si necesario

// ============================================================================
// FUNCIÓN: getInstructorHistorialAsignaciones
// DESCRIPCIÓN: Historial completo asignaciones instructor
// PARÁMETROS: instructorId, año (opcional)
// RESPUESTA: Historial con fechas, modalidades, horas ejecutadas

// ============================================================================
// FUNCIÓN: calculateInstructorPerformance
// DESCRIPCIÓN: Calcular rendimiento instructor
// PARÁMETROS: instructorId, periodoInicio, periodoFin
// MÉTRICAS:
// - Porcentaje cumplimiento horas
// - Puntualidad entrega seguimientos/bitácoras
// - Tasa certificación aprendices asignados
// - Calificación promedio por aprendices