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
// RUTA: POST /api/administradores/maintenance
// DESCRIPCIÓN: Gestionar modo mantenimiento
// CONTROLLER: administradorController.manageSystemMaintenance
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateMaintenanceAction
// VALIDACIONES BODY:
//   - body('action').isIn(['enableMaintenance', 'disableMaintenance', 'scheduleMaintenance'])
//   - body('scheduledTime').if(body('action').equals('scheduleMaintenance')).isISO8601()
//   - body('duration').optional().isInt({min: 5, max: 480}) // minutos
//   - body('notifyUsers').isBoolean().default(true)
//   - body('reason').notEmpty().isLength({max: 500})
// RESPONSE: Estado mantenimiento actualizado

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
// RUTA: POST /api/administradores/bulk-operations
// DESCRIPCIÓN: Operaciones masivas sistema
// CONTROLLER: administradorController.bulkOperations
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateBulkOperation
// VALIDACIONES BODY:
//   - body('operationType').isIn(['BULK_USER_IMPORT', 'BULK_DATA_MIGRATION', 'BULK_UPDATE'])
//   - body('operationConfig').isObject()
//   - body('dryRun').isBoolean().default(false)
//   - body('confirmationCode').if(body('dryRun').equals(false)).notEmpty()
// CONFIRMACIÓN DOBLE: Operaciones destructivas requieren código confirmación
// RESPONSE: Resultado operación o simulación si dryRun=true

// ============================================================================
// RUTA: GET /api/administradores/health-check
// DESCRIPCIÓN: Verificación salud sistema
// CONTROLLER: administradorController.systemHealthCheck
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - runFullCheck (boolean, verificación completa)
//   - generateReport (boolean, generar reporte detallado)
//   - autoFix (boolean, reparar problemas automáticamente)
// VERIFICACIONES:
//   - Conectividad base datos
//   - Estado servicios externos
//   - Integridad archivos
//   - Performance sistema
//   - Configuración seguridad
// RESPONSE: Score salud (0-100) con problemas encontrados

// ============================================================================
// RUTA: POST /api/administradores/emergency
// DESCRIPCIÓN: Acciones emergencia situaciones críticas
// CONTROLLER: administradorController.emergencyActions
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateEmergencyAction
// VALIDACIONES BODY:
//   - body('emergencyType').isIn(['SECURITY_BREACH', 'SYSTEM_FAILURE', 'DATA_CORRUPTION'])
//   - body('immediateAction').notEmpty()
//   - body('notifyTeam').isBoolean().default(true)
//   - body('confirmationCode').notEmpty() // Código emergencia especial
// TIPOS EMERGENCIA Y ACCIONES:
//   - SECURITY_BREACH: Bloquear accesos, modo solo lectura
//   - SYSTEM_FAILURE: Activar respaldos, notificar técnicos
//   - DATA_CORRUPTION: Restaurar backup, modo mantenimiento
// RESPONSE: Confirmación acciones ejecutadas

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
// RUTA: PUT /api/administradores/integrations/:sistema
// DESCRIPCIÓN: Configurar integraciones externas
// CONTROLLER: administradorController.configureSystemIntegrations
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateIntegrationConfig
// PARAMS:
//   - sistema: ONEDRIVE/EMAIL_SERVICE/SMS_PROVIDER
// VALIDACIONES BODY:
//   - body('config').isObject()
//   - body('testConnection').isBoolean().default(true)
// CONFIGURACIÓN POR SISTEMA:
//   - ONEDRIVE: tenantId, clientId, clientSecret
//   - EMAIL_SERVICE: smtpHost, username, password
//   - SMS_PROVIDER: apiKey, fromNumber
// PROCESO:
//   1. Validar configuración
//   2. Probar conectividad si testConnection=true
//   3. Encriptar credenciales
//   4. Guardar configuración
// RESPONSE: Estado configuración y resultado test

// ============================================================================
// RUTA: POST /api/administradores/database-operations
// DESCRIPCIÓN: Operaciones directas base datos
// CONTROLLER: administradorController.manageDatabaseOperations
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateDatabaseOperation
// VALIDACIONES BODY:
//   - body('operation').isIn(['QUERY_DATA', 'UPDATE_RECORDS', 'REPAIR_DATA'])
//   - body('collection').notEmpty()
//   - body('query').isObject()
//   - body('backup').isBoolean().default(true)
//   - body('confirmationCode').notEmpty()
// OPERACIONES PERMITIDAS:
//   - QUERY_DATA: Consultas complejas
//   - UPDATE_RECORDS: Actualizaciones masivas
//   - REPAIR_DATA: Reparar datos corruptos
// RESTRICCIONES: Sin operaciones DROP, backup automático
// RESPONSE: Resultado operación con log detallado

// ============================================================================
// RUTA: GET /api/administradores/compliance-audit
// DESCRIPCIÓN: Herramientas cumplimiento normativo
// CONTROLLER: administradorController.complianceAndAudit
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - auditType (INTERNAL_AUDIT/EXTERNAL_AUDIT/COMPLIANCE_CHECK)
//   - period (período auditar)
//   - generateEvidence (boolean, generar evidencias)
//   - exportFormat (zip/pdf/excel)
// TIPOS AUDITORÍA:
//   - INTERNAL_AUDIT: Procedimientos internos
//   - EXTERNAL_AUDIT: Preparación auditoría externa
//   - COMPLIANCE_CHECK: Verificación normativas SENA
// EVIDENCIAS:
//   - Logs actividad completos
//   - Reportes cumplimiento
//   - Documentación procedimientos
//   - Trazabilidad cambios
// RESPONSE: Paquete evidencias completo

// ============================================================================
// RUTA: PUT /api/administradores/alerts-config
// DESCRIPCIÓN: Configurar alertas críticas sistema
// CONTROLLER: administradorController.configureSystemAlerts
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateAlertsConfig
// VALIDACIONES BODY:
//   - body('alertConfig').isObject()
//   - body('alertTypes').isArray()
//   - body('thresholds').isObject()
//   - body('notificationChannels').isArray()
// TIPOS ALERTAS:
//   - SYSTEM_ERROR: Errores críticos
//   - HIGH_LOAD: Carga alta servidor
//   - DISK_SPACE: Espacio bajo
//   - FAILED_BACKUPS: Fallos backup
//   - SECURITY_BREACH: Accesos sospechosos
// CONFIGURACIÓN:
//   - Umbrales activación
//   - Destinatarios notificación
//   - Canales (email/SMS/sistema)
//   - Escalación automática
// RESPONSE: Configuración alertas actualizada

// ============================================================================
// RUTA: GET /api/administradores/cache-management
// DESCRIPCIÓN: Gestión cache sistema
// CONTROLLER: administradorController.manageCacheSystem
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - action (status/clear/refresh/configure)
//   - cacheType (parametros/usuarios/reportes/all)
// ACCIONES CACHE:
//   - status: Estado actual cache
//   - clear: Limpiar cache específico o todo
//   - refresh: Refrescar cache desde BD
//   - configure: Configurar parámetros cache
// RESPONSE: Estado cache y resultado acción