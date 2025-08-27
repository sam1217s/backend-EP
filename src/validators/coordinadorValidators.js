// ============================================================================
// VALIDADOR: validateAreaAccess
// DESCRIPCIÓN: Validar coordinador puede acceder recurso de su área
// PARÁMETROS: coordinadorId, resourceType, resourceId
// RECURSOS VALIDADOS:
// - instructor: Instructor pertenece área coordinador
// - ficha: Ficha corresponde programa área
// - aprendiz: Aprendiz en programa área
// - etapaProductiva: EP con instructor área
// LÓGICA: Verificar coordinador tiene permisos sobre recurso específico

// ============================================================================
// VALIDADOR: validateInstructorAreaAssignment
// DESCRIPCIÓN: Validar asignación instructor a área coordinador
// PARÁMETROS: instructorData, areaAsignada
// VALIDACIONES:
// - validateInstructorAvailable() - Instructor disponible
// - validateSpecialtyMatch() - Especialidad compatible área
// - validateAreaCapacity() - Área tiene cupo instructor
// - validateNoConflictingAssignments() - Sin asignaciones conflictivas

// ============================================================================
// VALIDADOR: validateHorasApprovalPermissions  
// DESCRIPCIÓN: Validar coordinador puede aprobar horas específicas
// PARÁMETROS: coordinadorId, registroHorasId
// VALIDACIONES:
// - validateInstructorInArea() - Instructor pertenece área coordinador
// - validateHorasNotApproved() - Horas no aprobadas previamente
// - validateWithinBudget() - Horas dentro presupuesto área
// - validateActivityValid() - Actividad válida para modalidad

// ============================================================================
// VALIDADOR: validateAreaStatisticsAccess
// DESCRIPCIÓN: Validar acceso estadísticas área específica
// PARÁMETROS: coordinadorId, areaRequested, periodo
// VALIDACIONES:
// - validateAreaPermissions() - Coordinador puede ver estadísticas área
// - validatePeriodRange() - Período solicitado válido (max 2 años)
// - validateDataAvailable() - Datos disponibles para período

// ============================================================================
// VALIDADOR: validateBulkHorasApproval
// DESCRIPCIÓN: Validar aprobación masiva horas instructores
// PARÁMETROS: coordinadorId, registroHorasIds
// VALIDACIONES:
// - validateAllInstructorsInArea() - Todos instructores del área
// - validateNoneApproved() - Ninguna hora aprobada previamente
// - validateBulkBudgetImpact() - Impacto presupuesto área total
// - validateBulkLimit() - No exceder límite operaciones masivas (50)

// ============================================================================
// VALIDADOR: validateEtapaProductivaReassignment
// DESCRIPCIÓN: Validar reasignación EP entre instructores
// PARÁMETROS: fromInstructorId, toInstructorId, etapaProductivaIds
// VALIDACIONES:
// - validateBothInstructorsInArea() - Ambos instructores del área
// - validateEtapasCanBeReassigned() - EP en estado permiten reasignación
// - validateTargetInstructorCapacity() - Instructor destino disponible
// - validateSpecialtyCompatibility() - Especialidad compatible con EP
// - validateReassignmentLimit() - No exceder límite reasignaciones diarias

// ============================================================================
// VALIDADOR: validateAreaReportGeneration
// DESCRIPCIÓN: Validar generación reportes área
// PARÁMETROS: coordinadorId, reportType, period, includeData
// VALIDACIONES:
// - validateReportTypePermissions() - Coordinador puede generar tipo reporte
// - validatePeriodData() - Datos disponibles período solicitado
// - validateReportFrequency() - No exceder frecuencia generación reportes
// - validateIncludeDataPermissions() - Permisos incluir datos específicos

// ============================================================================
// VALIDADOR: validateAreaSettingsConfiguration
// DESCRIPCIÓN: Validar configuración parámetros área
// PARÁMETROS: coordinadorId, areaSettings
// VALIDACIONES:
// - validateSettingsStructure() - Estructura configuración válida
// - validateThresholdRanges() - Umbrales dentro rangos permitidos
// - validateNotificationConfig() - Configuración notificaciones válida
// - validateDashboardWidgets() - Widgets dashboard permitidos
// - validateReportScheduling() - Programación reportes válida

// ============================================================================
// VALIDADOR: validateInstructorManagementAction
// DESCRIPCIÓN: Validar acciones gestión instructor
// PARÁMETROS: coordinadorId, instructorId, action, actionData
// ACCIONES VALIDADAS:
// - updateSpecialty: Actualizar especialidad
// - updateAvailability: Cambiar disponibilidad horas
// - reassignWorkload: Redistribuir carga trabajo
// - removeFromArea: Quitar instructor del área
// VALIDACIONES:
// - validateActionPermissions() - Coordinador puede realizar acción
// - validateInstructorInArea() - Instructor pertenece área
// - validateActionData() - Datos acción válidos
// - validateNoActiveAssignments() - Sin asignaciones críticas activas

// ============================================================================
// VALIDADOR: validateAreaCapacityPlanning
// DESCRIPCIÓN: Validar planificación capacidad área
// PARÁMETROS: coordinadorId, planningHorizon, projectionData
// VALIDACIONES:
// - validatePlanningHorizon() - Horizonte planificación válido (max 24 meses)
// - validateProjectionData() - Datos proyección coherentes
// - validateHistoricalData() - Datos históricos suficientes para proyección
// - validateSeasonalFactors() - Factores estacionales válidos

// ============================================================================
// VALIDADOR: validateAreaBudgetTracking
// DESCRIPCIÓN: Validar seguimiento presupuesto área
// PARÁMETROS: coordinadorId, budgetPeriod, budgetData
// VALIDACIONES:
// - validateBudgetPeriod() - Período presupuesto válido
// - validateBudgetData() - Datos presupuesto coherentes
// - validateExpenditureTracking() - Seguimiento gastos correcto
// - validateProjectionAccuracy() - Proyecciones dentro rangos esperados

// ============================================================================
// FUNCIONES AUXILIARES VALIDACIÓN:
// - isInstructorInCoordinatorArea(coordinadorId, instructorId)
// - isFichaInCoordinatorPrograms(coordinadorId, fichaId)  
// - isAprendizInCoordinatorArea(coordinadorId, aprendizId)
// - calculateAreaBudgetImpact(coordinadorId, horasAdicionales)
// - validateSpecialtyAreaCompatibility(especialidad, areas)
// - checkAreaCapacityForInstructor(areaId, instructorProfile)
// - validateCoordinatorPermissionLevel(coordinadorId, permissionType)