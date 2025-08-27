// ============================================================================
// RUTA: GET /api/coordinadores/my-area
// DESCRIPCIÓN: Información completa del área coordinada
// CONTROLLER: coordinadorController.getMyArea
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
// QUERY PARAMETERS:
//   - includeStatistics (boolean, incluir estadísticas detalladas)
//   - includeAlerts (boolean, incluir alertas pendientes)
// RESPONSE: Información completa área con métricas

// ============================================================================
// RUTA: GET /api/coordinadores/my-instructores
// DESCRIPCIÓN: Instructores bajo supervisión
// CONTROLLER: coordinadorController.getMyInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación)
//   - estado (Activo/Inactivo/Vacaciones/Licencia)
//   - especialidad (filtrar por especialidad)
//   - disponibilidad (boolean, solo disponibles)
//   - sortBy (nombre/especialidad/carga)
//   - order (asc/desc)
// RESPONSE: Lista instructores con métricas carga trabajo

// ============================================================================
// RUTA: GET /api/coordinadores/my-aprendices
// DESCRIPCIÓN: Aprendices en programas coordinados
// CONTROLLER: coordinadorController.getMyAprendices
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación)
//   - programa (filtrar por programa)
//   - ficha (filtrar por ficha)
//   - estadoFormacion (En Formación/Etapa Productiva/Certificado)
//   - modalidadEP (filtrar por modalidad EP)
//   - proximosVencer (boolean, próximos vencer)
// RESPONSE: Lista aprendices con progreso EP

// ============================================================================
// RUTA: PUT /api/coordinadores/approve-hours/:registroHorasId
// DESCRIPCIÓN: Aprobar horas instructor del área
// CONTROLLER: coordinadorController.approveInstructorHours
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateMongoId('registroHorasId')
//   - validation.validateHorasApproval
// PARAMS:
//   - registroHorasId: ID registro horas a aprobar
// VALIDACIONES BODY:
//   - body('observaciones').optional().isLength({max: 500})
// VALIDACIONES NEGOCIO:
//   - Instructor pertenece área coordinador
//   - Horas no aprobadas previamente
//   - Dentro presupuesto área
// RESPONSE: Confirmación aprobación con datos actualizados

// ============================================================================
// RUTA: PUT /api/coordinadores/reject-hours/:registroHorasId
// DESCRIPCIÓN: Rechazar horas instructor con motivo
// CONTROLLER: coordinadorController.rejectInstructorHours
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateMongoId('registroHorasId')
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// RESPONSE: Confirmación rechazo

// ============================================================================
// RUTA: GET /api/coordinadores/area-statistics
// DESCRIPCIÓN: Estadísticas área coordinada
// CONTROLLER: coordinadorController.getAreaStatistics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateStatisticsParams
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año, default: mes)
//   - includeComparative (boolean, comparar período anterior)
//   - detailLevel (basic/detailed/full)
//   - format (json/pdf/excel)
// RESPONSE: Estadísticas completas área con comparativas

// ============================================================================
// RUTA: GET /api/coordinadores/area-alerts
// DESCRIPCIÓN: Alertas área coordinada
// CONTROLLER: coordinadorController.getAreaAlerts
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
// QUERY PARAMETERS:
//   - criticidad (CRÍTICA/MODERADA/INFORMATIVA)
//   - categoria (instructores/aprendices/fichas/presupuesto)
//   - limit (default: 20, max: 100)
//   - soloNoResueltas (boolean, default: true)
// RESPONSE: Lista alertas priorizadas por criticidad

// ============================================================================
// RUTA: POST /api/coordinadores/assign-instructor
// DESCRIPCIÓN: Asignar instructor al área
// CONTROLLER: coordinadorController.assignInstructorToArea
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateInstructorAssignment
// VALIDACIONES BODY:
//   - body('instructorId').isMongoId()
//   - body('especialidadAsignada').notEmpty().isLength({max: 200})
//   - body('horasSemanales').isInt({min: 10, max: 40})
//   - body('fechaInicioAsignacion').optional().isISO8601().toDate()
// VALIDACIONES NEGOCIO:
//   - Instructor disponible y activo
//   - Especialidad compatible área
//   - Área tiene cupo disponible
// RESPONSE: Confirmación asignación con datos actualizados

// ============================================================================
// RUTA: PUT /api/coordinadores/reassign-etapas
// DESCRIPCIÓN: Reasignar EP entre instructores
// CONTROLLER: coordinadorController.reassignEtapasProductivas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateBulkReassignment
// VALIDACIONES BODY:
//   - body('fromInstructorId').isMongoId()
//   - body('toInstructorId').isMongoId()
//   - body('etapaProductivaIds').isArray({min: 1, max: 20})
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - Ambos instructores pertenecen área
//   - EP pueden ser reasignadas
//   - Instructor destino disponible
// RESPONSE: Reporte reasignación con EP afectadas

// ============================================================================
// RUTA: GET /api/coordinadores/area-reports
// DESCRIPCIÓN: Generar reportes área
// CONTROLLER: coordinadorController.generateAreaReports
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateReportGeneration
// QUERY PARAMETERS:
//   - reportType (INSTRUCTOR_PERFORMANCE/STUDENT_PROGRESS/HOURS_SUMMARY/etc.)
//   - period (YYYY-MM o rango fechas)
//   - includeGraphics (boolean, incluir gráficos)
//   - format (pdf/excel/csv)
// VALIDACIONES QUERY:
//   - query('reportType').isIn(['INSTRUCTOR_PERFORMANCE', 'STUDENT_PROGRESS', 'HOURS_SUMMARY', 'CERTIFICATION_RATES'])
//   - query('period').matches(/^\d{4}-\d{2}$/) // YYYY-MM format
// RESPONSE: Reporte generado o URL descarga

// ============================================================================
// RUTA: PUT /api/coordinadores/manage-instructor/:instructorId
// DESCRIPCIÓN: Gestionar instructor del área
// CONTROLLER: coordinadorController.manageAreaInstructors
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
//   - validation.validateInstructorManagement
// PARAMS:
//   - instructorId: ID instructor a gestionar
// QUERY PARAMETERS:
//   - action (assignToArea/removeFromArea/updateSpecialty/updateAvailability)
// VALIDACIONES BODY (según action):
//   - Para updateSpecialty: body('nuevaEspecialidad').notEmpty()
//   - Para updateAvailability: body('horasDisponibles').isInt({min: 0, max: 200})
// RESPONSE: Estado actualizado instructor

// ============================================================================
// RUTA: GET /api/coordinadores/performance-monitoring
// DESCRIPCIÓN: Monitoreo rendimiento área tiempo real
// CONTROLLER: coordinadorController.monitorAreaPerformance
// MIDDLEWARES:
//   - auth.auth