// corregido

// ============================================================================
// RUTA: GET /api/administradores/users
// DESCRIPCIÓN: Gestionar todos los usuarios del sistema
// CONTROLLER: administradorController.getAllUsers
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (nombre, documento, email)
//   - rol (Aprendiz/Instructor/Coordinador/Administrador)
//   - estado (Activo/Inactivo/Bloqueado)
//   - fechaCreacionDesde, fechaCreacionHasta
//   - ordenarPor (fechaCreacion/ultimoAcceso/nombres)
// RESPONSE: Lista usuarios con información básica y estadísticas

// ============================================================================
// RUTA: POST /api/administradores/users
// DESCRIPCIÓN: Crear usuario de cualquier rol
// CONTROLLER: administradorController.createUser
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateUserCreation
// VALIDACIONES BODY:
//   - body('numeroDocumento').isLength({min: 6, max: 15}).matches(/^[0-9]+$/)
//   - body('tipoDocumento').isIn(['CC', 'TI', 'CE', 'PEP'])
//   - body('nombres').notEmpty().isLength({max: 100})
//   - body('apellidos').notEmpty().isLength({max: 100})
//   - body('email').isEmail().normalizeEmail()
//   - body('rol').isIn(['Aprendiz', 'Instructor', 'Coordinador', 'Administrador'])
//   - body('justificacion').if(body('rol').equals('Administrador')).notEmpty()
// CAMPOS CONDICIONALES:
//   - Si rol=Aprendiz: fichaId, programaId
//   - Si rol=Instructor: especialidad, areasTematicas
//   - Si rol=Coordinador: areasAsignadas
//   - Si rol=Administrador: nivelAcceso, justificacion
// RESPONSE: Usuario creado con credenciales generadas

// ============================================================================
// RUTA: GET /api/administradores/system-stats
// DESCRIPCIÓN: Estadísticas completas del sistema
// CONTROLLER: administradorController.getSystemStats
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateStatsParams
// QUERY PARAMETERS:
//   - periodo (dia/semana/mes/año)
//   - includeDetails (boolean, incluir detalles)
//   - categoria (usuarios/sistema/performance/seguridad)
//   - format (json/pdf/excel)
// RESPONSE: Dashboard ejecutivo con KPIs sistema

// ============================================================================
// RUTA: GET /api/administradores/audit-logs
// DESCRIPCIÓN: Logs completos auditoría sistema
// CONTROLLER: administradorController.auditLogs
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateAuditParams
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos, max 1 año)
//   - usuario (opcional, filtrar usuario específico)
//   - accion (opcional, tipo acción específica)
//   - modulo (opcional, módulo sistema)
//   - nivel (DEBUG/INFO/WARN/ERROR/CRITICAL)
//   - search (búsqueda texto libre)
//   - page, limit (paginación)
//   - export (boolean, exportar resultados)
// VALIDACIONES QUERY:
//   - query('fechaInicio').isISO8601().toDate()
//   - query('fechaFin').isISO8601().toDate()
//   - query('nivel').optional().isIn(['DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL'])
// RESPONSE: Logs filtrados con opción exportación

// ============================================================================
// RUTA: GET /api/administradores/user-sessions
// DESCRIPCIÓN: Gestionar sesiones activas usuarios
// CONTROLLER: administradorController.manageUserSessions
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - action (listActiveSessions/terminateSession/forcePasswordReset)
//   - userId (opcional, usuario específico)
//   - sessionId (requerido para terminateSession)
// INFORMACIÓN SESIONES:
//   - Usuario y rol activo
//   - IP y geolocalización
//   - Dispositivo y navegador
//   - Hora inicio y última actividad
// RESPONSE: Lista sesiones o confirmación acción

// ============================================================================
// RUTA: GET /api/administradores/system-reports
// DESCRIPCIÓN: Reportes administrativos sistema
// CONTROLLER: administradorController.generateSystemReports
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateReportGeneration
// QUERY PARAMETERS:
//   - reportType (USER_ACTIVITY/SYSTEM_PERFORMANCE/SECURITY_AUDIT)
//   - period (YYYY-MM o rango fechas)
//   - format (pdf/excel/csv/json)
//   - includeGraphics (boolean)
//   - autoSchedule (boolean, programar automático)
// TIPOS REPORTES:
//   - USER_ACTIVITY: Actividad usuarios período
//   - SYSTEM_PERFORMANCE: Métricas performance
//   - SECURITY_AUDIT: Auditoría seguridad
//   - COMPLIANCE_REPORT: Cumplimiento normativo
// RESPONSE: Reporte generado o URL descarga

// ============================================================================
// RUTA: POST /api/aprendices
// DESCRIPCIÓN: Crear nuevo aprendiz
// CONTROLLER: aprendizController.createAprendiz
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateAprendizCreation
// VALIDACIONES BODY:
//   - body('numeroDocumento').isLength({min: 6, max: 15}).matches(/^[0-9]+$/)
//   - body('tipoDocumento').isIn(['CC', 'TI', 'CE', 'PEP'])
//   - body('nombres').notEmpty().isLength({max: 100}).trim()
//   - body('apellidos').notEmpty().isLength({max: 100}).trim()
//   - body('emailPersonal').isEmail().normalizeEmail()
//   - body('emailInstitucional').optional().isEmail().custom(validateSenaEmail)
//   - body('telefono').matches(/^[0-9]{10}$/)
//   - body('fichaId').isMongoId()
//   - body('programaId').isMongoId()
// BODY REQUEST:
// {
//   "numeroDocumento": "1234567890",
//   "tipoDocumento": "CC",
//   "nombres": "Juan Carlos",
//   "apellidos": "Pérez López", 
//   "emailPersonal": "juan@gmail.com",
//   "emailInstitucional": "juan@sena.edu.co",
//   "telefono": "3001234567",
//   "fichaId": "ObjectId",
//   "programaId": "ObjectId"
// }

// ============================================================================
// RUTA: PUT /api/aprendices/:id
// DESCRIPCIÓN: Actualizar datos aprendiz
// CONTROLLER: aprendizController.updateAprendiz
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateMongoId('id')
//   - validation.validateAprendizUpdate
// VALIDACIONES: Campos opcionales para actualización
// RESTRICTION: No permitir cambio documento, ficha, programa sin validación especial

// ============================================================================
// RUTA: DELETE /api/aprendices/:id
// DESCRIPCIÓN: Inactivar aprendiz (soft delete)
// CONTROLLER: aprendizController.deleteAprendiz
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateMongoId('id')
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// RESTRICTION: Solo administradores, requiere motivo


// ============================================================================
// RUTA: PUT /api/aprendices/:id/estado
// DESCRIPCIÓN: Cambiar estado formación aprendiz
// CONTROLLER: aprendizController.updateAprendizEstado
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateEstadoTransition
// VALIDACIONES BODY:
//   - body('nuevoEstado').isIn(['En Formación', 'Etapa Productiva', 'Certificado', 'Retirado'])
//   - body('observaciones').optional().isLength({max: 500})


// ============================================================================
// RUTA: PUT /api/aprendices/:id/transferir-ficha
// DESCRIPCIÓN: Transferir aprendiz entre fichas
// CONTROLLER: aprendizController.transferAprendizFicha
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('nuevaFichaId').isMongoId()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})


// ============================================================================
// RUTA: POST /api/aprendices/bulk-upload
// DESCRIPCIÓN: Carga masiva aprendices desde Excel/CSV
// CONTROLLER: aprendizController.bulkUploadAprendices
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - upload.single('file') // Middleware para manejar archivo
//   - validation.validateBulkUploadFile
// VALIDACIONES FILE:
//   - Formato: Excel (.xlsx) o CSV
//   - Tamaño máximo: 50MB
//   - Headers requeridos: numeroDocumento, tipoDocumento, nombres, apellidos, etc.
// RESPONSE: Reporte validación con errores y registros procesados


// ============================================================================
// RUTA: GET /api/instructores
// DESCRIPCIÓN: Listar instructores con filtros
// CONTROLLER: instructorController.getAllInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por nombre/documento)
//   - especialidad (filtrar por especialidad)
//   - tipoContrato (Planta/Contratista)
//   - estado (Activo/Inactivo/Vacaciones/Licencia)
//   - areasTematicas (filtrar por áreas)
// VALIDACIONES QUERY:
//   - query('tipoContrato').optional().isIn(['Planta', 'Contratista'])
//   - query('estado').optional().isIn(['Activo', 'Inactivo', 'Vacaciones', 'Licencia'])



// ============================================================================
// RUTA: GET /api/instructores/:id
// DESCRIPCIÓN: Obtener instructor específico con detalles
// CONTROLLER: instructorController.getInstructorById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess // Instructor puede ver sus datos
//   - validation.validateMongoId('id')
// PERMISOS: Instructor solo sus datos, Admin/Coordinador todos


// ============================================================================
// RUTA: POST /api/instructores/:id/asignar-ep
// DESCRIPCIÓN: Asignar instructor a etapa productiva
// CONTROLLER: instructorController.assignInstructorToEtapa
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('etapaProductivaId').isMongoId()
//   - body('tipoInstructor').isIn(['Seguimiento', 'Técnico', 'Proyecto'])
//   - body('horasProgramadas').isInt({min: 1, max: 200})

// ============================================================================
// RUTA: DELETE /api/instructores/:instructorId/ep/:etapaId
// DESCRIPCIÓN: Quitar instructor de etapa productiva
// CONTROLLER: instructorController.removeInstructorFromEtapa
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})

