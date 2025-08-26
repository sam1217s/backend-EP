// ============================================================================
// RUTA: GET /api/dashboard/admin
// DESCRIPCIÓN: Dashboard completo administrador
// CONTROLLER: dashboardController.getDashboardAdmin
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateDashboardParams
// QUERY PARAMETERS:
//   - periodo (opcional, default: mes actual)
//   - refresh (boolean, forzar actualización cache)
// WIDGETS PRINCIPALES:
//   - Resumen general sistema (totales EP, aprendices, instructores)
//   - KPIs principales con semáforos
//   - Distribución modalidades (gráfico circular)
//   - Tendencias mensuales (gráfico líneas)
//   - Alertas críticas sistema
//   - Estado fichas próximas vencer
//   - Top instructores por desempeño
//   - Empresas más activas colaboradoras
// MÉTRICAS TIEMPO REAL:
//   - Certificaciones pendientes urgentes
//   - Bitácoras vencidas sin revisar
//   - Seguimientos atrasados
//   - Instructores con sobrecarga horas

// ============================================================================
// RUTA: GET /api/dashboard/coordinador
// DESCRIPCIÓN: Dashboard coordinador área específica
// CONTROLLER: dashboardController.getDashboardCoordinador
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Coordinador'])
// QUERY PARAMETERS:
//   - periodo (opcional)
//   - area (opcional, si coordinador múltiples áreas)
// WIDGETS ÁREA RESPONSABILIDAD:
//   - Resumen EP área (activas, completadas, problemas)
//   - Instructores área (disponibilidad, carga trabajo)
//   - Fichas área (vencimientos próximos, certificaciones)
//   - Tareas pendientes (aprobaciones horas, validaciones)
//   - Alertas moderadas (seguimientos, bitácoras próximas)
//   - Progreso mensual vs objetivos área
//   - Estadísticas comparativas con otras áreas
// PERMISOS: Solo datos área asignada coordinador

// ============================================================================
// RUTA: GET /api/dashboard/instructor/:instructorId
// DESCRIPCIÓN: Dashboard personal instructor
// CONTROLLER: dashboardController.getDashboardInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - mes, año (opcional, default: actual)
// WIDGETS PERSONALES:
//   - Mis asignaciones actuales con progreso
//   - Horas ejecutadas vs programadas mensual
//   - Actividades pendientes próximas
//   - Cronograma próximas actividades (calendario)
//   - Mis aprendices (progreso individual)
//   - Notificaciones personales
//   - Estadísticas desempeño personal
//   - Evaluación cumplimiento mensual
// ALERTAS PERSONALES:
//   - Seguimientos próximos vencer
//   - Bitácoras sin validar
//   - Sobrecarga horas detectada

// ============================================================================
// RUTA: GET /api/dashboard/aprendiz/:aprendizId
// DESCRIPCIÓN: Dashboard personal aprendiz
// CONTROLLER: dashboardController.getDashboardAprendiz
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAprendizAccess
// WIDGETS PERSONALES:
//   - Mi etapa productiva actual (progreso visual)
//   - Progreso EP (bitácoras entregadas, seguimientos, horas)
//   - Mis instructores asignados (contactos)
//   - Documentos pendientes entrega
//   - Próximas actividades programadas
//   - Estado proceso certificación
//   - Mi empresa actual (contactos, horarios)
//   - Calendario personal actividades
// ALERTAS PERSONALES:
//   - Bitácoras próximas vencer
//   - Seguimientos programados próximos
//   - Documentos certificación faltantes

// ============================================================================
// RUTA: GET /api/dashboard/widgets/resumen-general
// DESCRIPCIÓN: Widget números generales sistema
// CONTROLLER: dashboardController.getWidgetResumenGeneral
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (opcional)
//   - filtros (objeto con filtros específicos)
// RESPONSE:
// {
//   "aprendicesActivos": 1250,
//   "etapasProductivasActivas": 890,
//   "instructoresActivos": 45,
//   "certificacionesMes": 78,
//   "comparativoPeriodoAnterior": {
//     "aprendices": "+5.2%",
//     "etapasProductivas": "+8.1%",
//     "certificaciones": "+12.3%"
//   }
// }

// ============================================================================
// RUTA: GET /api/dashboard/widgets/indicadores-clave
// DESCRIPCIÓN: Widget KPIs principales con semáforos
// CONTROLLER: dashboardController.getWidgetIndicadoresClave
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// RESPONSE:
// {
//   "tasaCertificacionOportuna": { valor: 85.5, estado: "verde", meta: 80 },
//   "tiempoPromedioEP": { valor: 6.2, estado: "amarillo", meta: 6.0 },
//   "satisfaccionEmpresas": { valor: 92.1, estado: "verde", meta: 85 },
//   "utilizacionInstructores": { valor: 78.3, estado: "verde", meta: 75 },
//   "cumplimientoProcedimientos": { valor: 94.7, estado: "verde", meta: 90 }
// }

// ============================================================================
// RUTA: GET /api/dashboard/widgets/distribucion-modalidades
// DESCRIPCIÓN: Widget gráfico distribución modalidades
// CONTROLLER: dashboardController.getWidgetDistribucionModalidades
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// RESPONSE: Datos para gráfico circular/barras
// {
//   "modalidades": [
//     { "nombre": "PASANTÍA", "cantidad": 450, "porcentaje": 50.6 },
//     { "nombre": "VÍNCULO LABORAL", "cantidad": 280, "porcentaje": 31.4 },
//     { "nombre": "CONTRATO APRENDIZAJE", "cantidad": 95, "porcentaje": 10.7 }
//   ],
//   "totalEP": 890
// }

// ============================================================================
// RUTA: GET /api/dashboard/widgets/tendencias-mensuales
// DESCRIPCIÓN: Widget tendencias temporales (gráfico líneas)
// CONTROLLER: dashboardController.getWidgetTendenciasMensuales
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - mesesHistorico (default: 12)
// RESPONSE: Datos gráfico líneas últimos meses
// {
//   "periodos": ["2023-03", "2023-04", "2023-05", ...],
//   "epIniciadas": [45, 52, 38, 67, ...],
//   "certificaciones": [23, 31, 28, 42, ...],
//   "tendenciaEP": "creciente",
//   "tendenciaCertificaciones": "estable"
// }

// ============================================================================
// RUTA: GET /api/dashboard/widgets/alertas-criticas
// DESCRIPCIÓN: Widget alertas sistema por criticidad
// CONTROLLER: dashboardController.getWidgetAlertasCriticas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - nivelCriticidad (Crítica/Moderada/Informativa)
//   - limite (max alertas mostrar, default: 10)
// ALERTAS POR CRITICIDAD:
// CRÍTICAS (Rojas):
//   - Fichas vencidas sin certificar
//   - Bitácoras vencidas >15 días
//   - Instructores >180 horas/mes
// MODERADAS (Amarillas):
//   - Fichas próximas vencer (30 días)
//   - Bitácoras próximas vencer (7 días)
//   - Seguimientos atrasados
// INFORMATIVAS (Azules):
//   - Certificaciones próximas completar
//   - Nuevas asignaciones pendientes

// ============================================================================
// RUTA: GET /api/dashboard/widgets/mis-asignaciones
// DESCRIPCIÓN: Widget asignaciones instructor específico
// CONTROLLER: dashboardController.getWidgetMisAsignaciones
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// PARAMS:
//   - instructorId (en ruta o extraído del token)
// INCLUYE:
//   - EP asignadas con porcentaje progreso
//   - Próximas actividades pendientes
//   - Horas ejecutadas/programadas período
//   - Estado cada asignación (al día/atrasada)

// ============================================================================
// RUTA: GET /api/dashboard/widgets/calendario-actividades
// DESCRIPCIÓN: Widget calendario próximas actividades
// CONTROLLER: dashboardController.getWidgetCalendarioActividades
// MIDDLEWARES:
//   - auth.authenticateToken
//   - validation.validateCalendarioParams
// QUERY PARAMETERS:
//   - usuarioId (opcional, si admin ve otros usuarios)
//   - diasAdelante (default: 30)
// EVENTOS CALENDARIO:
//   - Seguimientos programados
//   - Vencimientos bitácoras
//   - Reuniones coordinación
//   - Fechas límite certificación
//   - Evaluaciones programadas
// RESPONSE: Formato estándar calendario (FullCalendar.js)

// ============================================================================
// RUTA: GET /api/dashboard/widgets/top-instructores
// DESCRIPCIÓN: Widget ranking instructores por desempeño
// CONTROLLER: dashboardController.getWidgetTopInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - criterio (Puntualidad/TasaCertificacion/Evaluacion/Cumplimiento)
//   - periodo (mes/trimestre)
// CRITERIOS RANKING:
//   - Puntualidad actividades (% entregadas a tiempo)
//   - Tasa certificación aprendices asignados
//   - Evaluación promedio aprendices
//   - Cumplimiento horas programadas
// RESPONSE: Top 10 instructores con métricas

// ============================================================================
// RUTA: GET /api/dashboard/widgets/empresas-activas
// DESCRIPCIÓN: Widget empresas colaboradoras más activas
// CONTROLLER: dashboardController.getWidgetEmpresasActivas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre)
//   - limite (default: 10)
// INCLUYE:
//   - Empresas con más aprendices EP
//   - Nuevas empresas incorporadas período
//   - Evaluación colaboración promedio
//   - Sectores económicos más activos

// ============================================================================
// RUTA: GET /api/dashboard/widgets/progreso-certificacion/:aprendizId
// DESCRIPCIÓN: Widget progreso certificación aprendiz específico
// CONTROLLER: dashboardController.getWidgetProgresoCertificacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAprendizAccess
// RESPONSE:
// {
//   "porcentajeCompletado": 75,
//   "bitacorasEntregadas": 9,
//   "totalBitacoras": 12,
//   "seguimientosRealizados": 2,
//   "totalSeguimientos": 3,
//   "horasCompletadas": 648,
//   "horasRequeridas": 864,
//   "documentosPendientes": ["Evaluación Sofía", "Documento Juicio"]
// }

// ============================================================================
// RUTA: GET /api/dashboard/widgets/notificaciones
// DESCRIPCIÓN: Widget notificaciones personales usuario
// CONTROLLER: dashboardController.getWidgetNotificaciones
// MIDDLEWARES:
//   - auth.authenticateToken
// QUERY PARAMETERS:
//   - limite (default: 10)
//   - soloNoLeidas (boolean, default: true)
// TIPOS NOTIFICACIÓN:
//   - Tareas asignadas nuevas
//   - Vencimientos próximos
//   - Cambios asignaciones
//   - Mensajes coordinación
//   - Alertas sistema personalizadas

// ============================================================================
// RUTA: PUT /api/dashboard/refresh
// DESCRIPCIÓN: Actualizar datos dashboard tiempo real
// CONTROLLER: dashboardController.refreshDashboardData
// MIDDLEWARES:
//   - auth.authenticateToken
// BODY REQUEST:
//   - dashboardType (admin/coordinador/instructor/aprendiz)
//   - widgets (array widgets específicos actualizar)
// PROCESO:
//   1. Invalidar cache widgets específicos
//   2. Recalcular métricas tiempo real
//   3. Generar datos actualizados
//   4. Enviar actualizaciones WebSocket si habilitado

// ============================================================================
// RUTA: GET /api/dashboard/export
// DESCRIPCIÓN: Exportar dashboard a formato específico
// CONTROLLER: dashboardController.exportDashboard
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - formato (pdf/excel/png)
//   - dashboardType (admin/coordinador)
//   - includeCharts (boolean, incluir gráficos)
// FORMATOS:
//   - PDF: Informe ejecutivo dashboard
//   - Excel: Datos tabulares widgets
//   - PNG: Captura visual dashboard

// ============================================================================
// RUTA: PUT /api/dashboard/configure
// DESCRIPCIÓN: Configurar widgets dashboard usuario
// CONTROLLER: dashboardController.configureDashboard
// MIDDLEWARES:
//   - auth.authenticateToken
//   - validation.validateDashboardConfig
// BODY REQUEST:
// {
//   "widgetsVisibles": ["resumen-general", "alertas-criticas", ...],
//   "ordenWidgets": [1, 2, 3, ...],
//   "parametrosPorWidget": {
//     "alertas-criticas": { "limite": 5, "criticidad": "Alta" }
//   },
//   "frecuenciaActualizacion": 300000
// }

// ============================================================================
// RUTA: GET /api/dashboard/metricas/:nivel
// DESCRIPCIÓN: Métricas agregadas dashboard por nivel
// CONTROLLER: dashboardController.getDashboardMetrics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeDashboardLevel
// PARAMS:
//   - nivel (Personal/Area/Centro/Nacional)
// QUERY PARAMETERS:
//   - periodo (opcional)
//   - filtros (objeto filtros específicos)
// RESPUESTA: Métricas agregadas con comparativos período anterior

// ============================================================================
// RUTA: GET /api/dashboard/alertas-usuario
// DESCRIPCIÓN: Alertas específicas usuario logueado
// CONTROLLER: dashboardController.getAlertasUsuario
// MIDDLEWARES:
//   - auth.authenticateToken
// QUERY PARAMETERS:
//   - criticidad (opcional: Crítica/Moderada/Informativa)
//   - limite (default: 20)
// PERSONALIZACIÓN: Según rol y responsabilidades específicas
// PRIORIZACIÓN: Por impacto y urgencia para usuario específico