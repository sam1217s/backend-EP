// ============================================================================
// RUTA: GET /api/reportes/general
// DESCRIPCIÓN: Reporte general estado etapas productivas
// CONTROLLER: reportesController.getReporteGeneral
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateReportFilters
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - programa (opcional, filtrar programa)
//   - modalidad (opcional, filtrar modalidad)
//   - estado (opcional, filtrar estado)
//   - formato (pdf/excel/json, default: json)
// VALIDACIONES QUERY:
//   - query('fechaInicio').isISO8601().toDate()
//   - query('fechaFin').isISO8601().toDate().custom(validateFechaFinPosterior)
//   - query('formato').optional().isIn(['pdf', 'excel', 'json'])
// INCLUYE:
//   - Total aprendices por estado formación
//   - Distribución por modalidades EP
//   - Estadísticas certificación
//   - Indicadores cumplimiento procedimientos
//   - Comparativo períodos anteriores
//   - Tendencias y proyecciones

// ============================================================================
// RUTA: GET /api/reportes/ficha/:fichaId
// DESCRIPCIÓN: Reporte detallado ficha específica
// CONTROLLER: reportesController.getReporteFicha
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
//   - validation.validateMongoId('fichaId')
// QUERY PARAMETERS:
//   - includeDetails (boolean, incluir detalles aprendices)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Información ficha y programa
//   - Lista aprendices con estados actuales
//   - EP activas por modalidad
//   - Instructores asignados
//   - Proyección certificaciones
//   - Alertas vencimiento ficha
//   - Estadísticas cumplimiento

// ============================================================================
// RUTA: GET /api/reportes/instructor/:instructorId
// DESCRIPCIÓN: Reporte individual instructor
// CONTROLLER: reportesController.getReporteInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (requeridos para período)
//   - includeProjection (boolean, incluir proyección)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Datos personales instructor
//   - Asignaciones actuales con progreso
//   - Horas ejecutadas vs programadas
//   - Distribución por modalidad y tipo
//   - Evaluación desempeño período
//   - Proyección próximos meses
//   - Comparativo períodos anteriores

// ============================================================================
// RUTA: GET /api/reportes/modalidades
// DESCRIPCIÓN: Reporte estadístico modalidades
// CONTROLLER: reportesController.getReporteModalidades
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - includeComparativo (boolean)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Total EP por modalidad
//   - Tasa éxito certificación modalidad
//   - Tiempo promedio EP por modalidad
//   - Horas instructor utilizadas
//   - Empresas colaboradoras activas
//   - Tendencias y proyecciones
//   - Análisis eficiencia modalidades

// ============================================================================
// RUTA: GET /api/reportes/auditoria
// DESCRIPCIÓN: Reporte para auditoría interna/externa
// CONTROLLER: reportesController.getReporteAuditoria
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateAuditoriaParams
// QUERY PARAMETERS:
//   - fichaId (opcional, auditoría ficha específica)
//   - tipoAuditoria (Interna/Externa/Control)
//   - fechaCorte (requerida)
//   - formato (pdf obligatorio para auditorías)
// INCLUYE:
//   - Trazabilidad completa por ficha
//   - Documentos y evidencias
//   - Cumplimiento procedimientos SENA
//   - Observaciones y seguimientos
//   - Estado certificaciones
//   - Indicadores calidad
//   - No conformidades identificadas
// FORMATO: PDF profesional para impresión

// ============================================================================
// RUTA: GET /api/reportes/bitacoras
// DESCRIPCIÓN: Reporte estado bitácoras
// CONTROLLER: reportesController.getReporteBitacoras
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - instructor (opcional)
//   - estado (opcional)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Total bitácoras por estado
//   - Bitácoras vencidas/próximas vencer
//   - Tiempo promedio validación
//   - Distribución por instructor
//   - Alertas y observaciones críticas
//   - Tendencias entrega y validación

// ============================================================================
// RUTA: GET /api/reportes/seguimientos
// DESCRIPCIÓN: Reporte seguimientos realizados
// CONTROLLER: reportesController.getReporteSeguimientos
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - instructor (opcional)
//   - tipo (Inicial/Intermedio/Final/Extraordinario)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Seguimientos programados vs ejecutados
//   - Distribución por tipo seguimiento
//   - Tiempo promedio ejecución
//   - Planes mejoramiento generados
//   - Seguimientos extraordinarios motivos
//   - Métricas cumplimiento y puntualidad

// ============================================================================
// RUTA: GET /api/reportes/certificaciones
// DESCRIPCIÓN: Reporte proceso certificaciones
// CONTROLLER: reportesController.getReporteCertificaciones
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - programa (opcional)
//   - estado (opcional)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Total certificaciones por estado
//   - Tiempo promedio proceso certificación
//   - Tasa certificación por programa
//   - Motivos rechazo frecuentes
//   - Fichas próximas vencer
//   - Alertas certificaciones urgentes

// ============================================================================
// RUTA: GET /api/reportes/horas-instructores
// DESCRIPCIÓN: Reporte horas instructores detallado
// CONTROLLER: reportesController.getReporteHorasInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - mes, año (requeridos)
//   - tipoInstructor (Seguimiento/Técnico/Proyecto)
//   - programa (opcional)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Distribución horas por instructor
//   - Horas por tipo actividad
//   - Comparativo presupuestado vs ejecutado
//   - Instructores con sobrecarga
//   - Proyección necesidades próximo período
//   - Análisis eficiencia utilización

// ============================================================================
// RUTA: GET /api/reportes/empresas
// DESCRIPCIÓN: Reporte empresas colaboradoras
// CONTROLLER: reportesController.getReporteEmpresas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - fechaInicio, fechaFin (requeridos)
//   - sector (opcional)
//   - tamaño (opcional)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Empresas activas por modalidad
//   - Aprendices recibidos por empresa
//   - Tasa retención aprendices
//   - Evaluación colaboración empresas
//   - Nuevas empresas incorporadas
//   - Métricas satisfacción y capacidad

// ============================================================================
// RUTA: GET /api/reportes/indicadores
// DESCRIPCIÓN: Reporte indicadores gestión (KPIs)
// CONTROLLER: reportesController.getReporteIndicadores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año)
//   - nivel (Centro/Nacional)
//   - formato (pdf/excel/json)
// INDICADORES PRINCIPALES:
//   - Tasa certificación oportuna
//   - Tiempo promedio EP
//   - Satisfacción empresas colaboradoras
//   - Utilización efectiva instructores
//   - Cumplimiento procedimientos SENA
//   - Calidad documentación
//   - Eficiencia procesos
// FORMATO: Cuadro mando integral con semáforos

// ============================================================================
// RUTA: GET /api/reportes/comparativo
// DESCRIPCIÓN: Reporte comparativo períodos
// CONTROLLER: reportesController.getReporteComparativo
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodoActual (YYYY-MM)
//   - periodoAnterior (YYYY-MM)
//   - nivelComparacion (Centro/Programa/Modalidad)
//   - formato (pdf/excel/json)
// INCLUYE:
//   - Variaciones porcentuales principales métricas
//   - Tendencias período a período
//   - Análisis causas variaciones significativas
//   - Proyecciones períodos futuros
//   - Recomendaciones mejora
//   - Acciones correctivas sugeridas

// ============================================================================
// RUTA: POST /api/reportes/personalizado
// DESCRIPCIÓN: Generar reporte personalizado
// CONTROLLER: reportesController.generateCustomReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateCustomReportConfig
// VALIDACIONES BODY:
//   - body('nombre').notEmpty().isLength({max: 100})
//   - body('campos').isArray({min: 1})
//   - body('filtros').isObject()
//   - body('agrupaciones').optional().isArray()
//   - body('ordenamiento').optional().isObject()
//   - body('formato').isIn(['pdf', 'excel', 'csv', 'json'])
// CONFIGURACIÓN FLEXIBLE:
//   - Selección campos específicos
//   - Filtros múltiples combinados
//   - Agrupaciones personalizadas
//   - Ordenamiento configurable
//   - Formato salida seleccionable

// ============================================================================
// RUTA: GET /api/reportes/:reportId/export
// DESCRIPCIÓN: Exportar reporte a formato específico
// CONTROLLER: reportesController.exportReportToFormat
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeReportAccess
// QUERY PARAMETERS:
//   - formato (pdf/excel/csv)
//   - templateId (opcional, plantilla específica)
// FORMATOS SOPORTADOS:
//   - PDF: Con plantillas profesionales SENA
//   - Excel: Con formato y fórmulas
//   - CSV: Para análisis externos
//   - JSON: Para integraciones API

// ============================================================================
// RUTA: POST /api/reportes/programar
// DESCRIPCIÓN: Programar reporte automático
// CONTROLLER: reportesController.scheduleAutomaticReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('tipoReporte').notEmpty()
//   - body('frecuencia').isIn(['Diaria', 'Semanal', 'Mensual'])
//   - body('horarioEnvio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
//   - body('destinatarios').isArray({min: 1})
//   - body('formatoSalida').isIn(['pdf', 'excel'])
// PROGRAMACIÓN:
//   - Frecuencia configurable
//   - Horario específico envío
//   - Lista destinatarios email
//   - Formato y configuración fija
//   - Parámetros dinámicos (período actual)

// ============================================================================
// RUTA: GET /api/reportes/historial
// DESCRIPCIÓN: Historial reportes generados
// CONTROLLER: reportesController.getReportHistory
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// QUERY PARAMETERS:
//   - usuarioId (opcional, admin ve todos)
//   - tipoReporte (opcional)
//   - fechaInicio, fechaFin (opcional)
//   - page, limit (paginación)
// INCLUYE:
//   - Reportes generados por usuario
//   - Fecha y hora generación
//   - Parámetros utilizados
//   - Enlaces descarga (si disponibles)
//   - Estado generación (Exitoso/Error)

// ============================================================================
// RUTA: GET /api/reportes/templates
// DESCRIPCIÓN: Plantillas reportes disponibles
// CONTROLLER: reportesController.getReportTemplates
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// RESPONSE: Lista plantillas con configuración por defecto
// USO: UI selección plantillas personalizadas

// ============================================================================
// RUTA: PUT /api/reportes/validate-access
// DESCRIPCIÓN: Validar acceso usuario a reporte específico
// CONTROLLER: reportesController.validateReportAccess
// MIDDLEWARES:
//   - auth.authenticateToken
// BODY REQUEST:
//   - tipoReporte, parametros (configuración reporte)
// REGLAS ACCESO:
//   - Administrador: Todos los reportes
//   - Coordinador: Reportes área responsabilidad
//   - Instructor: Solo reportes propios/asignados
//   - Aprendiz: Solo datos personales
// RESPONSE: { hasAccess: boolean, restrictions: [] }