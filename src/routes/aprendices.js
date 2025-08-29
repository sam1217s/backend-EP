// corregido

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
//   - dni: Documento de identidad del aprendiz
// VALIDACIONES PARAMS:
//   - param('id').isMongoId().withMessage('ID aprendiz inválido')
// RESPONSE: Datos completos aprendiz con EP, bitácoras, seguimientos


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
// DESCRIPCIÓN: visualizar Bitácoras del aprendiz
// CONTROLLER: aprendizController.getAprendizBitacoras
// MIDDLEWARES: Similares al anterior
// QUERY PARAMETERS:
//   - etapaProductivaId (opcional, filtrar por EP específica)

// ============================================================================
// RUTA: GET /api/aprendices/:id/seguimientos
// DESCRIPCIÓN: visualizar Seguimientos del aprendiz
// CONTROLLER: aprendizController.getAprendizSeguimientos
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/aprendices/:id/certificaciones
// DESCRIPCIÓN: visualizar Estado certificaciones del aprendiz
// CONTROLLER: aprendizController.getAprendizCertificaciones
// MIDDLEWARES: Similares al anterior

// ============================================================================
// RUTA: GET /api/aprendices/:id/alertas
// DESCRIPCIÓN: Alertas y vencimientos próximos del aprendiz
// CONTROLLER: aprendizController.checkAprendizVencimientos
// MIDDLEWARES: Similares al anterior



