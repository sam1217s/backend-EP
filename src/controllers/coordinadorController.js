// ============================================================================
// FUNCIÓN: getMyArea
// DESCRIPCIÓN: Información completa del área coordinada
// PARÁMETROS: coordinadorId (extraído del token)
// INCLUYE:
// - Datos áreas asignadas
// - Programas bajo supervisión
// - Instructores del área
// - Fichas activas área
// - Estadísticas generales área
// - Alertas pendientes área
// VALIDACIONES:
// - validateCoordinadorExists() - Coordinador existe y activo
// - validateAreaAssignment() - Tiene áreas asignadas
// RESPUESTA: Información completa área con métricas actuales

// ============================================================================
// FUNCIÓN: getMyInstructores
// DESCRIPCIÓN: Instructores bajo supervisión del coordinador
// PARÁMETROS: estado, especialidad, disponibilidad, page, limit
// INCLUYE:
// - Datos personales instructores
// - Carga trabajo actual
// - Asignaciones EP actuales
// - Disponibilidad horas
// - Performance evaluaciones
// FILTROS:
// - Por estado (Activo/Inactivo/Vacaciones/Licencia)
// - Por especialidad específica
// - Por disponibilidad horas
// VALIDACIONES:
// - validateCoordinadorPermissions() - Coordinador puede ver instructores
// - validateAreaFilter() - Filtros válidos para área
// RESPUESTA: Lista instructores con métricas rendimiento

// ============================================================================
// FUNCIÓN: getMyAprendices
// DESCRIPCIÓN: Aprendices en programas coordinados
// PARÁMETROS: programa, ficha, estadoFormacion, modalidadEP, page, limit
// INCLUYE:
// - Datos básicos aprendices
// - Estado formación actual
// - EP activas con progreso
// - Instructores asignados
// - Próximos vencimientos
// FILTROS:
// - Por programa específico
// - Por ficha específica
// - Por estado formación
// - Por modalidad EP
// VALIDACIONES:
// - validateProgramAccess() - Coordinador puede ver aprendices programa
// - validateFichaAccess() - Coordinador puede ver aprendices ficha
// RESPUESTA: Lista aprendices con estado progreso

// ============================================================================
// FUNCIÓN: approveInstructorHours
// DESCRIPCIÓN: Aprobar horas instructor del área
// PARÁMETROS: registroHorasId, observaciones
// VALIDACIONES CRÍTICAS:
// - validateInstructorInArea() - Instructor pertenece área coordinada
// - validateHorasNotApproved() - Horas no aprobadas previamente
// - validateCoordinadorCanApprove() - Coordinador autorizado aprobar
// - validateHorasWithinBudget() - Horas dentro presupuesto área
// - validateActivityCorrespondsToAssignment() - Actividad corresponde asignación
// PROCESO:
// 1. Validar permisos y datos
// 2. Marcar horas como aprobadas
// 3. Actualizar presupuesto área
// 4. Crear entrada pre-nómina
// 5. Notificar instructor aprobación
// 6. Log auditoría aprobación

// ============================================================================
// FUNCIÓN: rejectInstructorHours
// DESCRIPCIÓN: Rechazar horas instructor con motivo
// PARÁMETROS: registroHorasId, motivo
// VALIDACIONES:
// - validateInstructorInArea() - Instructor del área
// - validateMotivoRequired() - Motivo rechazo obligatorio
// - validateCoordinadorCanReject() - Coordinador puede rechazar
// PROCESO:
// 1. Marcar horas como rechazadas
// 2. Registrar motivo rechazo
// 3. Notificar instructor con motivo
// 4. Permitir corrección y re-envío
// 5. Log auditoría rechazo

// ============================================================================
// FUNCIÓN: getAreaStatistics
// DESCRIPCIÓN: Estadísticas completas área coordinada
// PARÁMETROS: periodo, includeComparative, detailLevel
// ESTADÍSTICAS INCLUIDAS:
// - Total instructores por estado
// - Total aprendices por estado formación
// - EP activas por modalidad
// - Tasa certificación área
// - Horas ejecutadas vs programadas
// - Performance instructores
// - Alertas críticas área
// COMPARATIVAS:
// - Versus período anterior
// - Versus otras áreas centro
// - Versus metas asignadas
// VALIDACIONES:
// - validatePeriodRange() - Período válido (máximo 1 año)
// - validateComparisonData() - Datos comparación disponibles

// ============================================================================
// FUNCIÓN: manageAreaInstructors
// DESCRIPCIÓN: Gestionar instructores del área
// PARÁMETROS: action, instructorId, newData
// ACCIONES DISPONIBLES:
// - assignToArea: Asignar instructor al área
// - removeFromArea: Quitar instructor del área
// - updateSpecialty: Actualizar especialidad
// - updateAvailability: Actualizar disponibilidad
// - reassignWorkload: Reasignar carga trabajo
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateActionPermitted() - Coordinador puede realizar acción
// - validateAreaCapacity() - Área tiene capacidad instructor
// - validateSpecialtyMatch() - Especialidad compatible área
// FUNCIONES INTERNAS:
// - updateInstructorAssignment() - Actualizar asignación
// - redistributeWorkload() - Redistribuir carga si necesario
// - notifyInstructorChange() - Notificar cambios

// ============================================================================
// FUNCIÓN: getAreaAlerts
// DESCRIPCIÓN: Alertas específicas del área coordinada
// PARÁMETROS: criticidad, categoria, limit
// TIPOS ALERTAS ÁREA:
// - Instructores sobrecargados área
// - EP próximas vencer área
// - Bitácoras atrasadas área
// - Seguimientos pendientes área
// - Fichas próximas vencer área
// - Presupuesto horas excedido
// CRITICIDAD:
// - CRÍTICA: Requiere acción inmediata
// - MODERADA: Requiere atención próxima
// - INFORMATIVA: Solo información
// VALIDACIONES:
// - validateAlertAccess() - Coordinador puede ver alertas área
// - validateCriticalityFilter() - Filtro criticidad válido

// ============================================================================
// FUNCIÓN: generateAreaReports
// DESCRIPCIÓN: Generar reportes específicos área
// PARÁMETROS: reportType, period, includeGraphics, format
// TIPOS REPORTES:
// - INSTRUCTOR_PERFORMANCE: Rendimiento instructores área
// - STUDENT_PROGRESS: Progreso aprendices área
// - HOURS_SUMMARY: Resumen horas área
// - CERTIFICATION_RATES: Tasas certificación área
// - AREA_COMPARISON: Comparación con otras áreas
// - MONTHLY_SUMMARY: Resumen mensual ejecutivo
// FORMATOS:
// - PDF: Reportes ejecutivos presentación
// - Excel: Datos análisis detallado
// - CSV: Datos procesamiento externo
// VALIDACIONES:
// - validateReportType() - Tipo reporte válido para coordinador
// - validatePeriodData() - Datos período disponibles
// - validateFormatSupported() - Formato soportado

// ============================================================================
// FUNCIÓN: assignInstructorToArea
// DESCRIPCIÓN: Asignar instructor al área coordinada
// PARÁMETROS: instructorId, especialidadAsignada, horasSemanales
// VALIDACIONES:
// - validateInstructorAvailable() - Instructor disponible asignación
// - validateSpecialtyMatch() - Especialidad compatible área
// - validateAreaCapacity() - Área tiene cupo instructor
// - validateHorasDistribution() - Distribución horas válida
// - validateNoConflicts() - Sin conflictos asignación
// PROCESO:
// 1. Validar disponibilidad y compatibilidad
// 2. Crear asignación instructor-área
// 3. Actualizar especialidad si necesario
// 4. Configurar horas semanales
// 5. Notificar instructor asignación
// 6. Actualizar métricas área

// ============================================================================
// FUNCIÓN: reassignEtapasProductivas
// DESCRIPCIÓN: Reasignar EP entre instructores del área
// PARÁMETROS: fromInstructorId, toInstructorId, etapaProductivaIds, motivo
// CASOS USO:
// - Instructor sale de vacaciones
// - Redistribución carga trabajo
// - Instructor cambia especialidad
// - Optimización asignaciones
// VALIDACIONES:
// - validateBothInstructorsInArea() - Ambos instructores del área
// - validateEtapasCanBeReassigned() - EP pueden ser reasignadas
// - validateTargetInstructorCapacity() - Instructor destino disponible
// - validateSpecialtyCompatibility() - Especialidad compatible EP
// - validateMotivoReassignment() - Motivo reasignación válido
// PROCESO:
// 1. Validar instructores y EP
// 2. Calcular impacto reasignación
// 3. Actualizar asignaciones
// 4. Transferir responsabilidades
// 5. Notificar instructores y aprendices
// 6. Actualizar proyecciones horas

// ============================================================================
// FUNCIÓN: monitorAreaPerformance
// DESCRIPCIÓN: Monitorear rendimiento área en tiempo real
// PARÁMETROS: metricsType, refreshInterval
// MÉTRICAS TIEMPO REAL:
// - Instructores activos vs total
// - EP en progreso vs completadas
// - Horas ejecutadas día actual
// - Alertas generadas hoy
// - Certificaciones pendientes
// - Bitácoras vencidas hoy
// INDICADORES PERFORMANCE:
// - Verde: Performance normal
// - Amarillo: Requiere atención
// - Rojo: Requiere acción inmediata
// USO: Dashboard tiempo real coordinador

// ============================================================================
// FUNCIÓN: planAreaCapacity
// DESCRIPCIÓN: Planificar capacidad área próximos períodos
// PARÁMETROS: planningHorizon, includeSeasonal, includeGrowth
// PLANIFICACIÓN INCLUYE:
// - Proyección aprendices próximos períodos
// - Necesidades instructores adicionales
// - Distribución especialidades requeridas
// - Presupuesto horas necesario
// - Identificación cuellos botella
// FACTORES CONSIDERADOS:
// - Tendencias históricas área
// - Fichas próximas iniciar
// - Variaciones estacionales
// - Metas crecimiento área
// RESPUESTA: Plan capacidad con recomendaciones

// ============================================================================
// FUNCIÓN: configureAreaSettings
// DESCRIPCIÓN: Configurar parámetros específicos área
// PARÁMETROS: areaSettings
// CONFIGURACIONES ÁREA:
// - Umbrales alertas específicas
// - Distribución horas por modalidad
// - Configuración reportes automáticos
// - Notificaciones personalizadas
// - Dashboard widgets específicos
// VALIDACIONES:
// - validateSettingsStructure() - Estructura configuración válida
// - validateThresholds() - Umbrales dentro rangos permitidos
// - validateNotificationConfig() - Configuración notificaciones válida
// FUNCIONES INTERNAS:
// - updateAreaParameters() - Actualizar parámetros área
// - applySettingsToInstructors() - Aplicar configuración instructores
// - scheduleAutomaticReports() - Programar reportes automáticos