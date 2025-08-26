// ============================================================================
// RUTA: GET /api/bitacoras
// DESCRIPCIÓN: Listar bitácoras con filtros avanzados
// CONTROLLER: bitacoraController.getAllBitacoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por aprendiz documento/nombre)
//   - instructor (filtrar por instructor asignado)
//   - etapaProductiva (filtrar por EP específica)
//   - estado (Pendiente/Ejecutada/Verificada)
//   - fechaVencimientoDesde, fechaVencimientoHasta (próximas vencer)
//   - numeroBitacora (filtrar por número específico)
// VALIDACIONES QUERY:
//   - query('estado').optional().isIn(['Pendiente', 'Ejecutada', 'Verificada'])
//   - query('numeroBitacora').optional().isInt({min: 1, max: 12})
// PERMISOS POR ROL:
//   - Instructor: Solo bitácoras asignadas a él
//   - Coordinador: Bitácoras de su área/programa
//   - Administrador: Todas las bitácoras

// ============================================================================
// RUTA: GET /api/bitacoras/:id
// DESCRIPCIÓN: Obtener bitácora específica con detalles
// CONTROLLER: bitacoraController.getBitacoraById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeBitacoraAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos bitácora, aprendiz, EP, instructor, archivos, observaciones

// ============================================================================
// RUTA: POST /api/bitacoras
// DESCRIPCIÓN: Crear nueva bitácora (automático al crear EP)
// CONTROLLER: bitacoraController.createBitacora
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Sistema']) // Solo llamadas internas automáticas
// NOTA: Generalmente no se usa directamente, se crean automáticamente al crear EP

// ============================================================================
// RUTA: PUT /api/bitacoras/:id
// DESCRIPCIÓN: Actualizar bitácora existente
// CONTROLLER: bitacoraController.updateBitacora
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeBitacoraUpdate
//   - validation.validateBitacoraUpdate
// CAMPOS ACTUALIZABLES:
//   - observaciones (aprendiz/coordinador)
//   - observacionInstructor (solo instructor asignado)
//   - horasValidadas (solo instructor)
// VALIDACIONES:
//   - Bitácora no verificada
//   - Usuario apropiado para cada campo
// PERMISOS:
//   - Aprendiz: Solo observaciones generales
//   - Instructor: Observaciones instructor y horas validadas
//   - Coordinador: Observaciones generales

// ============================================================================
// RUTA: POST /api/bitacoras/:id/upload-file
// DESCRIPCIÓN: Subir archivo bitácora firmada
// CONTROLLER: bitacoraController.uploadBitacoraFile
// MIDDLEWARES:
//   - auth.authenticateToken
//   - upload.single('bitacoraFile')
//   - roleValidator.authorizeBitacoraUpload
//   - validation.validateBitacoraFileUpload
// VALIDACIONES FILE:
//   - Formato: PDF, DOC, DOCX
//   - Tamaño máximo: 10MB
//   - Nombre archivo válido
// VALIDACIONES NEGOCIO:
//   - Bitácora existe y activa
//   - Usuario autorizado (aprendiz propietario o instructor asignado)
//   - Bitácora no verificada aún
//   - Máximo 1 archivo por bitácora
// PROCESO:
//   1. Validar archivo y permisos
//   2. Generar nombre único
//   3. Subir a OneDrive
//   4. Actualizar estado a "Ejecutada"
//   5. Notificar instructor para revisión

// ============================================================================
// RUTA: PUT /api/bitacoras/:id/validar
// DESCRIPCIÓN: Validar bitácora por instructor
// CONTROLLER: bitacoraController.validateBitacora
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Instructor'])
//   - validation.validateBitacoraValidation
// VALIDACIONES BODY:
//   - body('horasAprobadas').isFloat({min: 0, max: 50})
//   - body('observaciones').optional().isLength({max: 1000})
// VALIDACIONES NEGOCIO:
//   - Bitácora existe y en estado "Ejecutada"
//   - Instructor autorizado (asignado a la EP)
//   - Archivo adjunto existe
//   - Horas aprobadas válidas
// PROCESO:
//   1. Validar permisos y estado
//   2. Marcar como "Verificada"
//   3. Registrar horas instructor (0.25h por bitácora)
//   4. Actualizar progreso EP
//   5. Verificar si completó todas bitácoras

// ============================================================================
// RUTA: PUT /api/bitacoras/:id/rechazar
// DESCRIPCIÓN: Rechazar bitácora por instructor
// CONTROLLER: bitacoraController.rejectBitacora
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Instructor'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// PROCESO:
//   1. Cambiar estado a "Pendiente"
//   2. Agregar observación rechazo
//   3. Notificar aprendiz

// ============================================================================
// RUTA: GET /api/bitacoras/etapa-productiva/:epId
// DESCRIPCIÓN: Bitácoras de EP específica
// CONTROLLER: bitacoraController.getBitacorasByEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// QUERY PARAMETERS:
//   - includeFiles (boolean, incluir enlaces archivos)
// RESPONSE: Lista ordenada por número bitácora (1-12)

// ============================================================================
// RUTA: GET /api/bitacoras/instructor/:instructorId
// DESCRIPCIÓN: Bitácoras asignadas a instructor
// CONTROLLER: bitacoraController.getBitacorasByInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - estado (opcional: Pendiente/Ejecutada/Verificada)
//   - fechaInicio, fechaFin (rango fechas)
//   - prioridad (boolean, ordenar por vencimiento)
// RESPONSE: Lista priorizada por fecha vencimiento

// ============================================================================
// RUTA: POST /api/bitacoras/:id/observacion
// DESCRIPCIÓN: Agregar observación a bitácora
// CONTROLLER: bitacoraController.addBitacoraObservacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeBitacoraAccess
// VALIDACIONES BODY:
//   - body('observacion').notEmpty().isLength({min: 5, max: 1000})
//   - body('tipoObservacion').isIn(['Instructor', 'Coordinador', 'Sistema'])
// TIPOS OBSERVACIÓN:
//   - "Instructor": Observaciones instructor asignado
//   - "Coordinador": Observaciones coordinación
//   - "Sistema": Observaciones automáticas

// ============================================================================
// RUTA: GET /api/bitacoras/vencidas
// DESCRIPCIÓN: Bitácoras vencidas o próximas vencer
// CONTROLLER: bitacoraController.checkBitacorasVencidas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - diasAnticipacion (default: 7)
//   - soloVencidas (boolean, solo ya vencidas)
// RESPONSE: Lista bitácoras con alertas
// USO: Alertas automáticas sistema

// ============================================================================
// RUTA: GET /api/bitacoras/:id/progreso
// DESCRIPCIÓN: Progreso bitácora específica
// CONTROLLER: bitacoraController.getBitacoraProgress
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeBitacoraAccess
// RESPONSE:
// {
//   "estado": "Ejecutada",
//   "diasHastaVencimiento": 5,
//   "archivosAdjuntos": 1,
//   "observacionesPendientes": 0,
//   "validada": false,
//   "fechaVencimiento": "2024-03-15T23:59:59.000Z"
// }

// ============================================================================
// RUTA: GET /api/bitacoras/:id/reporte
// DESCRIPCIÓN: Reporte detallado bitácora
// CONTROLLER: bitacoraController.generateBitacoraReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// QUERY PARAMETERS:
//   - formato (pdf/json)
// INCLUYE:
//   - Datos completos bitácora
//   - Historial observaciones
//   - Enlaces archivos adjuntos
//   - Timeline actividades

// ============================================================================
// RUTA: PUT /api/bitacoras/bulk-validate
// DESCRIPCIÓN: Validar múltiples bitácoras
// CONTROLLER: bitacoraController.bulkValidateBitacoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Instructor'])
// VALIDACIONES BODY:
//   - body('bitacoraIds').isArray({min: 1, max: 20})
//   - body('observaciones').optional().isLength({max: 1000})
// USO: Instructor valida varias bitácoras simultáneamente

// ============================================================================
// RUTA: PUT /api/bitacoras/:id/extender-vencimiento
// DESCRIPCIÓN: Extender fecha vencimiento bitácora
// CONTROLLER: bitacoraController.extendBitacoraDeadline
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('nuevaFechaVencimiento').isISO8601().toDate()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - Nueva fecha posterior a actual
//   - Motivo válido
//   - Usuario autorizado

// ============================================================================
// RUTA: GET /api/bitacoras/estadisticas
// DESCRIPCIÓN: Estadísticas bitácoras
// CONTROLLER: bitacoraController.calculateBitacoraStatistics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año)
//   - instructor (opcional, estadísticas instructor específico)
//   - modalidad (opcional, filtrar por modalidad)
// RESPONSE:
// {
//   "totalBitacoras": 150,
//   "porEstado": { "Pendiente": 20, "Ejecutada": 80, "Verificada": 50 },
//   "promedioTiempoValidacion": "3.5 días",
//   "tasaCumplimientoPlazos": "85%",
//   "distribucionPorInstructor": {...}
// }

// ============================================================================
// RUTA: GET /api/bitacoras/download/:id
// DESCRIPCIÓN: Descargar archivo bitácora específica
// CONTROLLER: bitacoraController.downloadBitacoraFile
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeBitacoraAccess
// VALIDACIONES:
//   - Bitácora existe
//   - Archivo existe
//   - Usuario autorizado descargar
// RESPONSE: Stream archivo desde OneDrive