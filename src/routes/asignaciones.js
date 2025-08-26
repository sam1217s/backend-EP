// ============================================================================
// RUTA: GET /api/asignaciones
// DESCRIPCIÓN: Listar asignaciones con filtros
// CONTROLLER: asignacionController.getAllAsignaciones
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por aprendiz documento/nombre)
//   - instructor (filtrar por instructor específico)
//   - modalidad (filtrar por modalidad EP)
//   - estado (Activo/Inactivo/Reasignado)
//   - tipoInstructor (Seguimiento/Técnico/Proyecto)
//   - fechaAsignacionDesde, fechaAsignacionHasta (rango fechas)
// VALIDACIONES QUERY:
//   - query('estado').optional().isIn(['Activo', 'Inactivo', 'Reasignado'])
//   - query('tipoInstructor').optional().isIn(['Seguimiento', 'Técnico', 'Proyecto'])
// PERMISOS POR ROL:
//   - Instructor: Solo sus asignaciones
//   - Coordinador: Asignaciones de su área
//   - Administrador: Todas las asignaciones

// ============================================================================
// RUTA: GET /api/asignaciones/:id
// DESCRIPCIÓN: Obtener asignación específica con detalles
// CONTROLLER: asignacionController.getAsignacionById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAsignacionAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos instructor, aprendiz, EP, modalidad, horas programadas/ejecutadas

// ============================================================================
// RUTA: POST /api/asignaciones
// DESCRIPCIÓN: Crear nueva asignación instructor-EP
// CONTROLLER: asignacionController.createAsignacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateAsignacionCreation
// VALIDACIONES BODY CRÍTICAS:
//   - body('etapaProductivaId').isMongoId()
//   - body('instructorId').isMongoId()
//   - body('tipoInstructor').isIn(['Seguimiento', 'Técnico', 'Proyecto'])
//   - body('horasProgramadas').isInt({min: 1, max: 200})
//   - body('fechaAsignacion').optional().isISO8601().toDate()
// VALIDACIONES NEGOCIO:
//   - EP existe y activa
//   - Instructor existe y activo
//   - Tipo instructor compatible con modalidad
//   - Instructor disponible (horas)
//   - No duplicar asignación mismo tipo
//   - Área temática instructor compatible
//   - Horas según parámetros modalidad
// BODY REQUEST:
// {
//   "etapaProductivaId": "ObjectId",
//   "instructorId": "ObjectId",
//   "tipoInstructor": "Seguimiento",
//   "horasProgramadas": 16,
//   "observaciones": "Asignación inicial"
// }

// ============================================================================
// RUTA: PUT /api/asignaciones/:id
// DESCRIPCIÓN: Actualizar asignación existente
// CONTROLLER: asignacionController.updateAsignacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateAsignacionUpdate
// CAMPOS ACTUALIZABLES:
//   - horasProgramadas (con validaciones disponibilidad)
//   - observaciones
//   - estado (con restricciones)
// VALIDACIONES:
//   - No reducir horas por debajo de ejecutadas
//   - Instructor debe tener horas disponibles para aumento

// ============================================================================
// RUTA: DELETE /api/asignaciones/:id
// DESCRIPCIÓN: Eliminar/inactivar asignación
// CONTROLLER: asignacionController.deleteAsignacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - Sin actividades pendientes
//   - Transferir responsabilidades si necesario

// ============================================================================
// RUTA: PUT /api/asignaciones/:id/reasignar
// DESCRIPCIÓN: Reasignar EP a otro instructor
// CONTROLLER: asignacionController.reassignInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateReasignacion
// VALIDACIONES BODY:
//   - body('nuevoInstructorId').isMongoId()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - Nuevo instructor existe y activo
//   - Nuevo instructor disponible
//   - Área temática compatible
//   - Motivo reasignación válido
// CASOS USO:
//   - Instructor no disponible
//   - Redistribución carga trabajo
//   - Cambio área temática

// ============================================================================
// RUTA: GET /api/asignaciones/instructor/:instructorId
// DESCRIPCIÓN: Asignaciones específicas de instructor
// CONTROLLER: asignacionController.getAsignacionesByInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - estado (opcional: Activo/Completado)
//   - includeCompleted (boolean, incluir completadas)

// ============================================================================
// RUTA: GET /api/asignaciones/etapa-productiva/:epId
// DESCRIPCIÓN: Instructores asignados a EP específica
// CONTROLLER: asignacionController.getAsignacionesByEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// RESPONSE: Lista instructores con tipos y horas programadas/ejecutadas

// ============================================================================
// RUTA: PUT /api/asignaciones/:id/horas-ejecutadas
// DESCRIPCIÓN: Actualizar horas ejecutadas
// CONTROLLER: asignacionController.updateHorasEjecutadas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorOrAdmin
// VALIDACIONES BODY:
//   - body('horasEjecutadas').isFloat({min: 0})
//   - body('descripcion').notEmpty().isLength({min: 5, max: 500})
//   - body('fecha').optional().isISO8601().toDate()
// VALIDACIONES NEGOCIO:
//   - No exceder horas programadas
//   - Descripción actividad requerida
//   - Horas positivas
// FUNCIONES AUTOMÁTICAS:
//   - Crear registro horas detallado
//   - Actualizar proyección instructor
//   - Verificar completación asignación

// ============================================================================
// RUTA: PUT /api/asignaciones/:id/extender-horas
// DESCRIPCIÓN: Extender horas programadas
// CONTROLLER: asignacionController.extendHorasProgramadas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('horasAdicionales').isInt({min: 1, max: 100})
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - Instructor disponibilidad para horas adicionales
//   - EP requiere más tiempo del programado

// ============================================================================
// RUTA: GET /api/asignaciones/:id/progreso
// DESCRIPCIÓN: Progreso detallado asignación
// CONTROLLER: asignacionController.getAsignacionProgress
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAsignacionAccess
// RESPONSE:
// {
//   "porcentajeHorasEjecutadas": 75.5,
//   "actividadesCompletadas": 8,
//   "bitacorasRevisadas": 6,
//   "seguimientosRealizados": 2,
//   "tiempoRestanteEstimado": "15 días",
//   "estadoGeneral": "En progreso"
// }

// ============================================================================
// RUTA: GET /api/asignaciones/:id/reporte
// DESCRIPCIÓN: Generar reporte asignación
// CONTROLLER: asignacionController.generateAsignacionReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodoInicio, periodoFin (opcional, rango fechas)
//   - formato (pdf/excel)
// INCLUYE:
//   - Resumen horas ejecutadas
//   - Actividades realizadas
//   - Observaciones registradas
//   - Evaluación cumplimiento

// ============================================================================
// RUTA: PUT /api/asignaciones/bulk-reassign
// DESCRIPCIÓN: Reasignación masiva instructores
// CONTROLLER: asignacionController.bulkReassignInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('instructorSalienteId').isMongoId()
//   - body('instructorNuevoId').isMongoId()
//   - body('motivo').notEmpty()
// USO: Instructor sale del sistema, reasignar todas sus EP

// ============================================================================
// RUTA: GET /api/asignaciones/vencidas
// DESCRIPCIÓN: Asignaciones próximas vencer
// CONTROLLER: asignacionController.checkAsignacionesVencidas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - diasAnticipacion (default: 15)
// USO: Alertas automáticas sistema

// ============================================================================
// RUTA: GET /api/asignaciones/instructor/:instructorId/workload
// DESCRIPCIÓN: Carga trabajo instructor específico
// CONTROLLER: asignacionController.calculateInstructorWorkload
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (opcional, default: actual)
// RESPONSE: Distribución horas por asignación y modalidad