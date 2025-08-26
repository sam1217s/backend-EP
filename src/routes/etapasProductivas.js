// ============================================================================
// RUTA: GET /api/etapas-productivas
// DESCRIPCIÓN: Listar etapas productivas con filtros avanzados
// CONTROLLER: etapaProductivaController.getAllEtapasProductivas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación)
//   - search (por aprendiz documento/nombre)
//   - modalidad (filtrar por modalidad)
//   - estado (Activo/Inactivo/Completado/Cancelado)
//   - empresa (filtrar por empresa)
//   - instructor (filtrar por instructor asignado)
//   - ficha (filtrar por ficha)
//   - fechaInicioDesde, fechaInicioHasta (rango fechas)
// VALIDACIONES QUERY:
//   - query('estado').optional().isIn(['Activo', 'Inactivo', 'Completado', 'Cancelado'])
//   - query('fechaInicioDesde').optional().isISO8601().toDate()
//   - query('fechaInicioHasta').optional().isISO8601().toDate()
// PERMISOS POR ROL:
//   - Instructor: Solo EP donde está asignado
//   - Coordinador: EP de su área/programa
//   - Administrador: Todas las EP

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id
// DESCRIPCIÓN: Obtener EP específica con detalles completos
// CONTROLLER: etapaProductivaController.getEtapaProductivaById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos completos EP, aprendiz, empresa, instructores, bitácoras, seguimientos

// ============================================================================
// RUTA: POST /api/etapas-productivas
// DESCRIPCIÓN: Crear nueva etapa productiva
// CONTROLLER: etapaProductivaController.createEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateEtapaProductivaCreation
// VALIDACIONES BODY CRÍTICAS:
//   - body('aprendizId').isMongoId()
//   - body('fichaId').isMongoId()
//   - body('programaId').isMongoId()
//   - body('modalidadId').isMongoId()
//   - body('fechaInicio').isISO8601().toDate()
//   - body('fechaFin').isISO8601().toDate().custom(validateFechaFinPosterior)
//   - body('horasRequeridas').isInt({min: 1}).default(864)
//   - body('nombreEmpresa').notEmpty().isLength({max: 200})
//   - body('telefonoEmpresa').matches(/^[0-9]{7,10}$/)
//   - body('emailEmpresa').isEmail()
//   - body('direccionEmpresa').notEmpty().isLength({max: 300})
//   - body('jefeFirmante').notEmpty().isLength({max: 150})
//   - body('telefonoJefe').matches(/^[0-9]{7,10}$/)
//   - body('emailJefe').isEmail()
// VALIDACIONES NEGOCIO:
//   - Aprendiz elegible para EP (completó lectiva)
//   - Máximo 3 EP por aprendiz
//   - No solapamiento fechas con otras EP
//   - Modalidad compatible con programa
//   - Ficha no vencida para registro
//   - Registro dentro tiempo permitido (6 meses para fichas nuevas)
// BODY REQUEST:
// {
//   "aprendizId": "ObjectId",
//   "fichaId": "ObjectId", 
//   "programaId": "ObjectId",
//   "modalidadId": "ObjectId",
//   "fechaInicio": "2024-03-01T00:00:00.000Z",
//   "fechaFin": "2024-08-31T23:59:59.999Z",
//   "horasRequeridas": 864,
//   "nombreEmpresa": "Empresa XYZ S.A.S",
//   "telefonoEmpresa": "3201234567",
//   "emailEmpresa": "contacto@empresa.com",
//   "direccionEmpresa": "Calle 123 #45-67, Bogotá",
//   "jefeFirmante": "Carlos Rodríguez",
//   "telefonoJefe": "3109876543",
//   "emailJefe": "carlos@empresa.com",
//   "observaciones": "Observaciones adicionales"
// }

// ============================================================================
// RUTA: PUT /api/etapas-productivas/:id
// DESCRIPCIÓN: Actualizar etapa productiva
// CONTROLLER: etapaProductivaController.updateEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateEtapaProductivaUpdate
// CAMPOS ACTUALIZABLES:
//   - Datos empresa y contactos
//   - Fechas (con restricciones)
//   - Observaciones
//   - Estado (con validaciones)
// RESTRICTIONS: No actualizar si certificada

// ============================================================================
// RUTA: DELETE /api/etapas-productivas/:id
// DESCRIPCIÓN: Cancelar etapa productiva
// CONTROLLER: etapaProductivaController.deleteEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// RESTRICTIONS: Solo cancelar si no certificada

// ============================================================================
// RUTA: PUT /api/etapas-productivas/:id/cambiar-modalidad
// DESCRIPCIÓN: Cambiar modalidad EP existente
// CONTROLLER: etapaProductivaController.changeEtapaProductivaModalidad
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('nuevaModalidadId').isMongoId()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// CASOS USO: Cambio de Pasantía a Vínculo Laboral por contratación

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/bitacoras
// DESCRIPCIÓN: Bitácoras específicas de la EP
// CONTROLLER: etapaProductivaController.getEtapaProductivaBitacoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/seguimientos
// DESCRIPCIÓN: Seguimientos específicos de la EP
// CONTROLLER: etapaProductivaController.getEtapaProductivaSeguimientos
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/instructores
// DESCRIPCIÓN: Instructores asignados a la EP
// CONTROLLER: etapaProductivaController.getEtapaProductivaInstructores
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/alertas
// DESCRIPCIÓN: Alertas específicas de la EP
// CONTROLLER: etapaProductivaController.checkEtapaProductivaAlerts
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/validar-certificacion
// DESCRIPCIÓN: Validar si EP puede certificarse
// CONTROLLER: etapaProductivaController.validateEtapaProductivaForCertification
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// RESPONSE: { canCertify: boolean, missingRequirements: [], details: {} }

// ============================================================================
// RUTA: PUT /api/etapas-productivas/:id/extender-plazo
// DESCRIPCIÓN: Extender fecha límite EP
// CONTROLLER: etapaProductivaController.extendEtapaProductivaDeadline
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('nuevaFechaFin').isISO8601().toDate()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/progreso
// DESCRIPCIÓN: Calcular progreso EP específica
// CONTROLLER: etapaProductivaController.calculateEtapaProductivaProgress
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// RESPONSE:
// {
//   "porcentajeHoras": 75.5,
//   "bitacorasEntregadas": 8,
//   "totalBitacoras": 12,
//   "seguimientosCompletados": 2,
//   "totalSeguimientos": 3,
//   "diasRestantes": 45,
//   "estadoGeneral": "En progreso"
// }

// ============================================================================
// RUTA: GET /api/etapas-productivas/vencimientos
// DESCRIPCIÓN: EP próximas a vencer
// CONTROLLER: etapaProductivaController.getEtapaProductivasByVencimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - diasAnticipacion (default: 30)
// USO: Alertas automáticas sistema

// ============================================================================
// RUTA: PUT /api/etapas-productivas/bulk-update-status
// DESCRIPCIÓN: Actualizar estado múltiples EP
// CONTROLLER: etapaProductivaController.bulkUpdateEtapasProductivasStatus
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('etapaProductivaIds').isArray({min: 1})
//   - body('nuevoEstado').isIn(['Activo', 'Inactivo', 'Completado', 'Cancelado'])
//   - body('motivo').notEmpty()

// ============================================================================
// RUTA: GET /api/etapas-productivas/:id/reporte
// DESCRIPCIÓN: Generar reporte detallado EP
// CONTROLLER: etapaProductivaController.generateEtapaProductivaReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - includeDocuments (boolean, incluir enlaces documentos)
//   - formato (pdf/excel)
// USO: Auditorías y reportes oficiales