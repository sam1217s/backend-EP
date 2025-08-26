// ============================================================================
// RUTA: GET /api/seguimientos
// DESCRIPCIÓN: Listar seguimientos con filtros
// CONTROLLER: seguimientoController.getAllSeguimientos
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por aprendiz documento/nombre)
//   - instructor (filtrar por instructor responsable)
//   - etapaProductiva (filtrar por EP específica)
//   - estado (Programada/Ejecutada/Pendiente/Verificada)
//   - tipo (Inicial/Intermedio/Final)
//   - fechaProgramadaDesde, fechaProgramadaHasta (rango fechas)
// VALIDACIONES QUERY:
//   - query('estado').optional().isIn(['Programada', 'Ejecutada', 'Pendiente', 'Verificada'])
//   - query('tipo').optional().isIn(['Inicial', 'Intermedio', 'Final'])
// PERMISOS POR ROL:
//   - Instructor: Solo seguimientos asignados
//   - Coordinador: Seguimientos de su área
//   - Administrador: Todos los seguimientos

// ============================================================================
// RUTA: GET /api/seguimientos/:id
// DESCRIPCIÓN: Obtener seguimiento específico con detalles
// CONTROLLER: seguimientoController.getSeguimientoById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeSeguimientoAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos seguimiento, aprendiz, EP, instructor, documentos, resultados

// ============================================================================
// RUTA: POST /api/seguimientos
// DESCRIPCIÓN: Crear nuevo seguimiento (automático al crear EP)
// CONTROLLER: seguimientoController.createSeguimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Sistema']) // Solo llamadas automáticas
// NOTA: Generalmente automático al crear EP, crea 3 seguimientos programados

// ============================================================================
// RUTA: PUT /api/seguimientos/:id
// DESCRIPCIÓN: Actualizar seguimiento existente
// CONTROLLER: seguimientoController.updateSeguimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeSeguimientoUpdate
//   - validation.validateSeguimientoUpdate
// CAMPOS ACTUALIZABLES:
//   - fechaProgramada (solo si no ejecutado)
//   - observaciones
//   - observacionInstructor (solo instructor)
//   - resultados (solo instructor)
//   - planMejoramiento (solo instructor)
// PERMISOS:
//   - Instructor: Todos los campos
//   - Coordinador: Observaciones y fechas
//   - Aprendiz: Solo observaciones generales

// ============================================================================
// RUTA: PUT /api/seguimientos/:id/ejecutar
// DESCRIPCIÓN: Marcar seguimiento como ejecutado
// CONTROLLER: seguimientoController.executeSeguimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Instructor'])
//   - validation.validateSeguimientoExecution
// VALIDACIONES BODY:
//   - body('resultados').notEmpty().isLength({min: 20, max: 2000})
//   - body('planMejoramiento').optional().isLength({max: 1000})
//   - body('fechaEjecucion').optional().isISO8601().toDate()
// VALIDACIONES NEGOCIO:
//   - Seguimiento existe y programado
//   - Instructor asignado autorizado
//   - No ejecutado previamente
//   - Resultados obligatorios
//   - Fecha ejecución dentro rango permitido
// PROCESO:
//   1. Validar permisos y estado
//   2. Marcar como "Ejecutada"
//   3. Registrar horas instructor (2h por seguimiento)
//   4. Programar siguiente seguimiento si aplica
//   5. Verificar completitud todos seguimientos

// ============================================================================
// RUTA: POST /api/seguimientos/:id/upload-document
// DESCRIPCIÓN: Subir documento seguimiento
// CONTROLLER: seguimientoController.uploadSeguimientoDocument
// MIDDLEWARES:
//   - auth.authenticateToken
//   - upload.single('seguimientoFile')
//   - roleValidator.authorizeSeguimientoUpload
//   - validation.validateSeguimientoFileUpload
// VALIDACIONES FILE:
//   - Formato: PDF, DOC, DOCX
//   - Tamaño máximo: 10MB
// VALIDACIONES NEGOCIO:
//   - Seguimiento existe
//   - Usuario autorizado (instructor asignado)
// PROCESO:
//   1. Subir archivo a OneDrive
//   2. Vincular a seguimiento
//   3. Actualizar estado si corresponde

// ============================================================================
// RUTA: PUT /api/seguimientos/:id/verificar
// DESCRIPCIÓN: Verificar seguimiento por coordinador
// CONTROLLER: seguimientoController.verifySeguimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador', 'Administrador'])
//   - validation.validateSeguimientoVerification
// VALIDACIONES BODY:
//   - body('observaciones').optional().isLength({max: 1000})
// VALIDACIONES NEGOCIO:
//   - Seguimiento ejecutado
//   - Coordinador autorizado
//   - Documento adjunto existe
// PROCESO:
//   1. Marcar como "Verificada"
//   2. Actualizar progreso EP
//   3. Generar notificaciones

// ============================================================================
// RUTA: PUT /api/seguimientos/:id/rechazar
// DESCRIPCIÓN: Rechazar seguimiento
// CONTROLLER: seguimientoController.rejectSeguimiento
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador', 'Administrador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// PROCESO:
//   1. Cambiar estado a "Pendiente"
//   2. Agregar observación rechazo
//   3. Notificar instructor

// ============================================================================
// RUTA: GET /api/seguimientos/etapa-productiva/:epId
// DESCRIPCIÓN: Seguimientos de EP específica
// CONTROLLER: seguimientoController.getSeguimientosByEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// RESPONSE: Los 3 seguimientos (Inicial, Intermedio, Final) ordenados por número

// ============================================================================
// RUTA: GET /api/seguimientos/instructor/:instructorId
// DESCRIPCIÓN: Seguimientos asignados a instructor
// CONTROLLER: seguimientoController.getSeguimientosByInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - estado (opcional: filtrar por estado)
//   - fechaInicio, fechaFin (rango fechas)
//   - prioridad (boolean, ordenar por fecha límite)
// RESPONSE: Lista priorizada por fecha límite

// ============================================================================
// RUTA: POST /api/seguimientos/extraordinario
// DESCRIPCIÓN: Crear seguimiento extraordinario
// CONTROLLER: seguimientoController.createSeguimientoExtraordinario
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateSeguimientoExtraordinario
// VALIDACIONES BODY:
//   - body('etapaProductivaId').isMongoId()
//   - body('instructorId').isMongoId()
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
//   - body('fechaProgramada').isISO8601().toDate()
// CASOS USO:
//   - Problemas en empresa
//   - Aprendiz con dificultades
//   - Situaciones especiales
// VALIDACIONES NEGOCIO:
//   - EP existe y activa
//   - Instructor existe
//   - Motivo obligatorio
//   - No exceder límite seguimientos
// PROCESO:
//   1. Crear seguimiento tipo "Extraordinario"
//   2. Asignar 2 horas adicionales instructor
//   3. Crear alerta especial

// ============================================================================
// RUTA: PUT /api/seguimientos/:id/reprogramar
// DESCRIPCIÓN: Reprogramar fecha seguimiento
// CONTROLLER: seguimientoController.scheduleSeguimientoDate
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// VALIDACIONES BODY:
//   - body('nuevaFecha').isISO8601().toDate()
//   - body('motivo').notEmpty().isLength({min: 5, max: 500})
// VALIDACIONES NEGOCIO:
//   - No ejecutado aún
//   - Nueva fecha válida y futura
//   - Mínimo 24h anticipación
//   - Dentro período válido EP

// ============================================================================
// RUTA: POST /api/seguimientos/:id/observacion
// DESCRIPCIÓN: Agregar observación seguimiento
// CONTROLLER: seguimientoController.addSeguimientoObservacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeSeguimientoAccess
// VALIDACIONES BODY:
//   - body('observacion').notEmpty().isLength({min: 5, max: 1000})
//   - body('tipo').isIn(['Instructor', 'Coordinador', 'Sistema', 'Empresa'])
// TIPOS OBSERVACIÓN:
//   - "Instructor": Observaciones instructor
//   - "Coordinador": Observaciones coordinación  
//   - "Sistema": Automáticas
//   - "Empresa": Observaciones empresa/jefe inmediato

// ============================================================================
// RUTA: GET /api/seguimientos/vencidos
// DESCRIPCIÓN: Seguimientos vencidos o próximos vencer
// CONTROLLER: seguimientoController.getSeguimientosVencidos
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - diasAnticipacion (default: 7)
//   - soloVencidos (boolean)
// USO: Alertas automáticas

// ============================================================================
// RUTA: GET /api/seguimientos/:id/progreso
// DESCRIPCIÓN: Progreso seguimiento específico
// CONTROLLER: seguimientoController.getSeguimientoProgress
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeSeguimientoAccess
// RESPONSE:
// {
//   "estado": "Ejecutada",
//   "diasHastaLimite": 3,
//   "documentosAdjuntos": 1,
//   "avancePlanMejoramiento": "50%",
//   "fechaLimite": "2024-03-20T23:59:59.000Z"
// }

// ============================================================================
// RUTA: GET /api/seguimientos/:id/reporte
// DESCRIPCIÓN: Reporte detallado seguimiento
// CONTROLLER: seguimientoController.generateSeguimientoReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// INCLUYE:
//   - Datos completos seguimiento
//   - Resultados detallados
//   - Plan mejoramiento
//   - Historial observaciones

// ============================================================================
// RUTA: PUT /api/seguimientos/bulk-schedule
// DESCRIPCIÓN: Programar múltiples seguimientos
// CONTROLLER: seguimientoController.bulkScheduleSeguimientos
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('etapaProductivaIds').isArray({min: 1})
//   - body('fechasProgramadas').isArray({min: 1})
// USO: Programación masiva mensual

// ============================================================================
// RUTA: GET /api/seguimientos/estadisticas
// DESCRIPCIÓN: Estadísticas seguimientos
// CONTROLLER: seguimientoController.calculateSeguimientoStatistics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año)
//   - instructor (opcional)
//   - modalidad (opcional)
// RESPONSE:
// {
//   "totalSeguimientos": 90,
//   "porEstado": {...},
//   "tasaCumplimientoFechas": "92%",
//   "promedioTiempoEjecucion": "2.5 días",
//   "distribucionPorTipo": {...}
// }

// ============================================================================
// RUTA: GET /api/seguimientos/validar-completitud/:epId
// DESCRIPCIÓN: Validar completitud seguimientos para certificación
// CONTROLLER: seguimientoController.validateAllSeguimientosCompleted
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// RESPONSE: { allCompleted: boolean, pending: [], details: {} }
// USO: Validación previa certificación