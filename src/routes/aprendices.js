// ============================================================================
// RUTA: GET /api/aprendices
// DESCRIPCIÓN: Listar aprendices con filtros y paginación
// CONTROLLER: aprendizController.getAllAprendices
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page (default: 1)
//   - limit (default: 10, max: 100)
//   - search (buscar por documento/nombre)
//   - ficha (filtrar por ficha específica)
//   - programa (filtrar por programa)
//   - estado (filtrar por estado: Activo/Inactivo)
//   - estadoFormacion (En Formación/Etapa Productiva/Certificado/Retirado)
// VALIDACIONES QUERY:
//   - query('page').optional().isInt({min: 1})
//   - query('limit').optional().isInt({min: 1, max: 100})
//   - query('search').optional().isLength({min: 2, max: 50})
//   - query('estado').optional().isIn(['Activo', 'Inactivo'])
// RESPONSE: { aprendices[], totalPages, currentPage, totalRecords }

// ============================================================================
// RUTA: GET /api/aprendices/:id
// DESCRIPCIÓN: Obtener aprendiz específico con detalles completos
// CONTROLLER: aprendizController.getAprendizById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validateMongoId('id')
// PARAMS:
//   - id: ObjectId del aprendiz
// VALIDACIONES PARAMS:
//   - param('id').isMongoId().withMessage('ID aprendiz inválido')
// RESPONSE: Datos completos aprendiz con EP, bitácoras, seguimientos

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
// RUTA: GET /api/aprendices/:id/etapas-productivas
// DESCRIPCIÓN: Historial etapas productivas del aprendiz
// CONTROLLER: aprendizController.getAprendizEtapasProductivas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAprendizAccess // Puede ver sus propios datos
//   - validation.validateMongoId('id')
// PERMISOS: Aprendiz solo sus datos, otros roles todos los datos

// ============================================================================
// RUTA: GET /api/aprendices/:id/bitacoras
// DESCRIPCIÓN: Bitácoras del aprendiz
// CONTROLLER: aprendizController.getAprendizBitacoras
// MIDDLEWARES: Similares al anterior
// QUERY PARAMETERS:
//   - etapaProductivaId (opcional, filtrar por EP específica)

// ============================================================================
// RUTA: GET /api/aprendices/:id/seguimientos
// DESCRIPCIÓN: Seguimientos del aprendiz
// CONTROLLER: aprendizController.getAprendizSeguimientos
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/aprendices/:id/certificaciones
// DESCRIPCIÓN: Estado certificaciones del aprendiz
// CONTROLLER: aprendizController.getAprendizCertificaciones
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/aprendices/:id/alertas
// DESCRIPCIÓN: Alertas y vencimientos próximos del aprendiz
// CONTROLLER: aprendizController.checkAprendizVencimientos
// MIDDLEWARES: Similares al anterior

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