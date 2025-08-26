// ============================================================================
// RUTA: GET /api/horas
// DESCRIPCIÓN: Listar registros horas con filtros
// CONTROLLER: horasController.getAllRegistroHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por instructor nombre/documento)
//   - instructor (filtrar por instructor específico)
//   - mes, año (filtrar por período)
//   - tipoActividad (Seguimiento/Revisión Bitácora/Asesoría Técnica/Asesoría Proyecto)
//   - aprobado (true/false/pendiente)
//   - fechaDesde, fechaHasta (rango fechas actividad)
// VALIDACIONES QUERY:
//   - query('mes').optional().isInt({min: 1, max: 12})
//   - query('año').optional().isInt({min: 2020, max: 2030})
//   - query('tipoActividad').optional().isIn(['Seguimiento', 'Revisión Bitácora', 'Asesoría Técnica', 'Asesoría Proyecto'])
//   - query('aprobado').optional().isBoolean()
// PERMISOS POR ROL:
//   - Instructor: Solo sus propias horas
//   - Coordinador: Instructores de su área
//   - Administrador: Todos los registros

// ============================================================================
// RUTA: GET /api/horas/:id
// DESCRIPCIÓN: Obtener registro horas específico
// CONTROLLER: horasController.getRegistroHorasById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeHorasAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos registro, instructor, EP, actividad, estado aprobación

// ============================================================================
// RUTA: POST /api/horas
// DESCRIPCIÓN: Crear nuevo registro horas
// CONTROLLER: horasController.createRegistroHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Instructor', 'Administrador', 'Coordinador'])
//   - validation.validateRegistroHorasCreation
// VALIDACIONES BODY CRÍTICAS:
//   - body('instructorId').isMongoId()
//   - body('etapaProductivaId').isMongoId()
//   - body('aprendizId').isMongoId()
//   - body('fecha').isISO8601().toDate().custom(validateNotFutureDate)
//   - body('tipoActividad').isIn(['Seguimiento', 'Revisión Bitácora', 'Asesoría Técnica', 'Asesoría Proyecto'])
//   - body('horasRegistradas').isFloat({min: 0.5, max: 8})
//   - body('descripcion').notEmpty().isLength({min: 5, max: 500})
// REGLAS HORAS POR ACTIVIDAD:
//   - "Seguimiento": 2 horas fijas
//   - "Revisión Bitácora": 0.25 horas (1 hora cada 4 bitácoras)
//   - "Asesoría Técnica": Variable según modalidad
//   - "Asesoría Proyecto": Variable según tipo proyecto
// VALIDACIONES NEGOCIO:
//   - Instructor existe y activo
//   - EP existe y activa
//   - Instructor asignado a EP
//   - Tipo actividad válido para modalidad
//   - Horas dentro límites diarios (0.5-8h)
//   - Fecha no futura
//   - No duplicar mismo día/actividad/EP
//   - Descripción obligatoria y específica
// BODY REQUEST:
// {
//   "instructorId": "ObjectId",
//   "etapaProductivaId": "ObjectId",
//   "aprendizId": "ObjectId",
//   "fecha": "2024-03-15T10:00:00.000Z",
//   "tipoActividad": "Seguimiento",
//   "horasRegistradas": 2.0,
//   "descripcion": "Seguimiento inicial en empresa XYZ"
// }

// ============================================================================
// RUTA: PUT /api/horas/:id
// DESCRIPCIÓN: Actualizar registro horas (solo si no aprobado)
// CONTROLLER: horasController.updateRegistroHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeHorasUpdate
//   - validation.validateRegistroHorasUpdate
// CAMPOS ACTUALIZABLES:
//   - horasRegistradas
//   - descripcion
//   - observaciones
// VALIDACIONES:
//   - Registro no aprobado aún
//   - Instructor propietario o admin/coordinador
//   - Horas válidas para actividad
// RESTRICTIONS: Solo modificar en estado pendiente

// ============================================================================
// RUTA: PUT /api/horas/:id/aprobar
// DESCRIPCIÓN: Aprobar registro horas
// CONTROLLER: horasController.approveRegistroHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateHorasApproval
// VALIDACIONES BODY:
//   - body('observaciones').optional().isLength({max: 1000})
// VALIDACIONES NEGOCIO:
//   - Registro no aprobado previamente
//   - Coordinador autorizado para instructor
//   - Dentro límite mensual instructor
//   - Actividad corresponde a asignación
// PROCESO APROBACIÓN:
//   1. Marcar como aprobado
//   2. Actualizar total horas instructor
//   3. Crear entrada pre-nómina
//   4. Actualizar proyección horas
//   5. Notificar instructor aprobación
//   6. Verificar límites mensuales

// ============================================================================
// RUTA: PUT /api/horas/:id/rechazar
// DESCRIPCIÓN: Rechazar registro horas
// CONTROLLER: horasController.rejectRegistroHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})
// PROCESO:
//   1. Marcar como rechazado
//   2. Agregar motivo rechazo
//   3. Notificar instructor con motivo
//   4. Permitir corrección y re-envío

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId
// DESCRIPCIÓN: Horas instructor por período
// CONTROLLER: horasController.getHorasByInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - includeDetails (boolean, incluir detalles actividades)
// RESPONSE:
// {
//   "totalHoras": 145.5,
//   "porTipoActividad": {
//     "Seguimiento": 48.0,
//     "Revisión Bitácora": 12.0,
//     "Asesoría Técnica": 85.5
//   },
//   "horasAprobadas": 130.0,
//   "horasPendientes": 15.5,
//   "distribucionPorEP": [...],
//   "comparativoMesAnterior": "+12.5"
// }

// ============================================================================
// RUTA: GET /api/horas/etapa-productiva/:epId
// DESCRIPCIÓN: Horas registradas en EP específica
// CONTROLLER: horasController.getHorasByEtapaProductiva
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeEtapaProductivaAccess
// QUERY PARAMETERS:
//   - mes, año (opcional, filtrar período)
// RESPONSE: Desglose horas por instructor y actividad

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId/timesheet
// DESCRIPCIÓN: Generar hoja tiempo instructor
// CONTROLLER: horasController.generateInstructorTimesheet
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - formato (pdf/excel)
// INCLUYE:
//   - Detalle diario actividades
//   - Total horas por tipo
//   - Estado aprobación cada registro
//   - Observaciones coordinador
//   - Resumen mensual

// ============================================================================
// RUTA: PUT /api/horas/bulk-approve
// DESCRIPCIÓN: Aprobar múltiples registros horas
// CONTROLLER: horasController.bulkApproveHoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateBulkApproval
// VALIDACIONES BODY:
//   - body('registroHorasIds').isArray({min: 1, max: 100})
//   - body('observaciones').optional().isLength({max: 1000})
// VALIDACIONES MASIVAS:
//   - Todos registros existen
//   - Ninguno aprobado previamente
//   - Coordinador autorizado para todos instructores
//   - No exceder límites mensuales
// USO: Aprobación masiva fin de mes

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId/payroll
// DESCRIPCIÓN: Calcular nómina instructor
// CONTROLLER: horasController.calculateInstructorPayroll
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - mes, año (requeridos)
// RESPONSE:
// {
//   "horasAprobadas": {
//     "Seguimiento": { horas: 48, tarifa: 25000, subtotal: 1200000 },
//     "Asesoría Técnica": { horas: 85.5, tarifa: 30000, subtotal: 2565000 }
//   },
//   "totalHoras": 133.5,
//   "totalPagar": 3765000,
//   "deducciones": 0,
//   "netoPagar": 3765000
// }

// ============================================================================
// RUTA: GET /api/horas/resumen-mensual
// DESCRIPCIÓN: Resumen mensual horas centro
// CONTROLLER: horasController.getMonthlyHoursSummary
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - programa (opcional, filtrar por programa)
// RESPONSE:
// {
//   "totalHoras": 2850,
//   "porModalidad": {...},
//   "distribucionPorInstructor": [...],
//   "presupuestadoVsEjecutado": {
//     "presupuestado": 3000,
//     "ejecutado": 2850,
//     "variacion": "-5%"
//   },
//   "tendencias": {...},
//   "proyeccionProximoMes": 2950
// }

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId/validate-monthly-limit
// DESCRIPCIÓN: Validar límite mensual instructor
// CONTROLLER: horasController.validateInstructorMonthlyLimit
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - horasAdicionales (opcional, validar horas adicionales)
// REGLAS:
//   - Máximo 160 horas mensuales base
//   - Horas extra requieren aprobación especial
//   - Distribución balanceada modalidades
// RESPONSE:
// {
//   "horasActuales": 155,
//   "limiteBase": 160,
//   "horasDisponibles": 5,
//   "puedeAgregar": true,
//   "requiereAprobacionEspecial": false
// }

// ============================================================================
// RUTA: POST /api/horas/create-from-activities
// DESCRIPCIÓN: Crear registros automáticamente desde actividades
// CONTROLLER: horasController.createHorasFromActivities
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Sistema', 'Administrador'])
// VALIDACIONES BODY:
//   - body('instructorId').isMongoId()
//   - body('mes').isInt({min: 1, max: 12})
//   - body('año').isInt({min: 2020, max: 2030})
// FUENTES AUTOMÁTICAS:
//   - Seguimientos ejecutados → 2h c/u
//   - Bitácoras validadas → 0.25h c/u
//   - Asesorías programadas → según configuración
// PROCESO:
//   1. Obtener actividades mes instructor
//   2. Calcular horas según reglas
//   3. Crear registros automáticos
//   4. Marcar como pendientes aprobación
// USO: Generación automática mensual

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId/overtime
// DESCRIPCIÓN: Calcular horas extra instructor
// CONTROLLER: horasController.getInstructorOvertime
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (requeridos)
// RESPONSE: Horas que exceden límite mensual con detalle

// ============================================================================
// RUTA: GET /api/horas/report
// DESCRIPCIÓN: Generar reporte horas detallado
// CONTROLLER: horasController.generateHorasReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - instructorId (opcional)
//   - programa (opcional)
//   - formato (pdf/excel)
// INCLUYE:
//   - Resumen ejecutivo período
//   - Desglose por actividad e instructor
//   - Análisis tendencias
//   - Recomendaciones optimización

// ============================================================================
// RUTA: GET /api/horas/instructor/:instructorId/proyeccion
// DESCRIPCIÓN: Proyectar horas próximo mes
// CONTROLLER: horasController.proyectarHorasProximoMes
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mesProyeccion, añoProyeccion (requeridos)
// BASADO EN:
//   - EP activas asignadas
//   - Seguimientos programados
//   - Bitácoras estimadas próximo mes
//   - Asesorías planificadas
// RESPONSE: Proyección detallada con distribución por actividad

// ============================================================================
// RUTA: GET /api/horas/estadisticas
// DESCRIPCIÓN: Estadísticas horas sistema
// CONTROLLER: horasController.getHoursStatistics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año)
//   - modalidad (opcional)
//   - tipoInstructor (opcional)
// RESPONSE:
// {
//   "promedioHorasPorModalidad": {...},
//   "distribucionPorTipoInstructor": {...},
//   "eficienciaPorActividad": {...},
//   "tendenciasMensuales": [...],
//   "indicadoresRendimiento": {...}
// }

// ============================================================================
// RUTA: GET /api/horas/export-nomina
// DESCRIPCIÓN: Exportar horas para nómina
// CONTROLLER: horasController.exportHorasToExcel
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - instructorIds (array, opcional)
// VALIDACIONES:
//   - Solo horas aprobadas
//   - Formato compatible sistema nómina SENA
// RESPONSE: Archivo Excel con formato estándar nómina