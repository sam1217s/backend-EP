// ============================================================================
// FUNCIÓN: getDashboardAdmin
// DESCRIPCIÓN: Dashboard completo administrador
// PARÁMETROS: periodo, refresh
// WIDGETS PRINCIPALES:
// - Resumen general sistema (total EP, aprendices, instructores)
// - Indicadores clave rendimiento (KPIs)
// - Distribución modalidades (gráfico circular)
// - Tendencias mensuales (gráfico líneas)
// - Alertas críticas sistema
// - Estado fichas próximas vencer
// - Top instructores por desempeño
// - Empresas más activas
// MÉTRICAS TIEMPO REAL:
// - Certificaciones pendientes
// - Bitácoras vencidas
// - Seguimientos atrasados
// - Instructores sobrecargados

// ============================================================================
// FUNCIÓN: getDashboardCoordinador
// DESCRIPCIÓN: Dashboard coordinador área específica
// PARÁMETROS: coordinadorId, periodo
// WIDGETS ÁREA RESPONSABILIDAD:
// - Resumen EP área (activas, completadas, problemas)
// - Instructores área (disponibilidad, carga trabajo)
// - Fichas área (vencimientos próximos, certificaciones)
// - Tareas pendientes (aprobaciones, validaciones)
// - Alertas moderadas (seguimientos, bitácoras)
// - Progreso mensual vs objetivos
// - Estadísticas comparativas
// PERMISOS: Solo datos área asignada

// ============================================================================  
// FUNCIÓN: getDashboardInstructor
// DESCRIPCIÓN: Dashboard personal instructor
// PARÁMETROS: instructorId, mes, año
// WIDGETS PERSONALES:
// - Mis asignaciones actuales
// - Horas ejecutadas vs programadas
// - Actividades pendientes (seguimientos, bitácoras)
// - Cronograma próximas actividades
// - Mis aprendices (progreso individual)
// - Notificaciones personales
// - Estadísticas personales
// - Evaluación desempeño
// ALERTAS PERSONALES:
// - Seguimientos próximos vencer
// - Bitácoras sin validar
// - Sobrecarga horas

// ============================================================================
// FUNCIÓN: getDashboardAprendiz
// DESCRIPCIÓN: Dashboard personal aprendiz
// PARÁMETROS: aprendizId
// WIDGETS PERSONALES:
// - Mi etapa productiva actual
// - Progreso EP (bitácoras, seguimientos, horas)
// - Mis instructores asignados
// - Documentos pendientes
// - Próximas actividades
// - Estado certificación
// - Mi empresa (contactos, horarios)
// - Calendario personal
// ALERTAS PERSONALES:
// - Bitácoras próximas vencer
// - Seguimientos programados
// - Documentos faltantes

// ============================================================================
// FUNCIÓN: getWidgetResumenGeneral
// DESCRIPCIÓN: Widget resumen números generales
// PARÁMETROS: periodo, filtros
// RESPUESTA:
// - Total aprendices activos
// - Total EP activas
// - Total instructores
// - Certificaciones mes
// - Comparativo período anterior

// ============================================================================
// FUNCIÓN: getWidgetIndicadoresClave
// DESCRIPCIÓN: Widget KPIs principales
// RESPUESTA:
// - Tasa certificación oportuna
// - Tiempo promedio EP
// - Satisfacción empresas
// - Utilización instructores
// - Cumplimiento procedimientos
// FORMATO: Medidores visuales con colores

// ============================================================================
// FUNCIÓN: getWidgetDistribucionModalidades
// DESCRIPCIÓN: Widget gráfico modalidades
// RESPUESTA: Datos para gráfico circular/barras
// - Cantidad EP por modalidad
// - Porcentajes distribución
// - Comparativo períodos

// ============================================================================
// FUNCIÓN: getWidgetTendenciasMensuales
// DESCRIPCIÓN: Widget tendencias temporales
// PARÁMETROS: mesesHistorico
// RESPUESTA: Datos gráfico líneas
// - EP iniciadas por mes
// - Certificaciones por mes
// - Tendencias principales

// ============================================================================
// FUNCIÓN: getWidgetAlertasCriticas
// DESCRIPCIÓN: Widget alertas sistema
// PARÁMETROS: nivelCriticidad, limite
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
//   - Nuevas asignaciones

// ============================================================================
// FUNCIÓN: getWidgetMisAsignaciones
// DESCRIPCIÓN: Widget asignaciones instructor
// PARÁMETROS: instructorId
// INCLUYE:
// - EP asignadas con progreso
// - Próximas actividades
// - Horas ejecutadas/programadas
// - Estado cada asignación

// ============================================================================
// FUNCIÓN: getWidgetCalendarioActividades
// DESCRIPCIÓN: Widget calendario próximas actividades
// PARÁMETROS: usuarioId, rol, diasAdelante
// EVENTOS:
// - Seguimientos programados
// - Vencimientos bitácoras
// - Reuniones coordinación
// - Fechas límite certificación

// ============================================================================
// FUNCIÓN: getWidgetTopInstructores
// DESCRIPCIÓN: Widget ranking instructores
// PARÁMETROS: criterio, periodo
// CRITERIOS RANKING:
// - Puntualidad actividades
// - Tasa certificación aprendices
// - Evaluación aprendices
// - Cumplimiento horas
// RESPUESTA: Top 10 instructores

// ============================================================================
// FUNCIÓN: getWidgetEmpresasActivas
// DESCRIPCIÓN: Widget empresas colaboradoras
// PARÁMETROS: periodo, limite
// INCLUYE:
// - Empresas con más aprendices
// - Nuevas empresas incorporadas
// - Evaluación colaboración
// - Sectores más activos

// ============================================================================
// FUNCIÓN: getWidgetProgresoCertificacion
// DESCRIPCIÓN: Widget progreso certificación aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA:
// - Porcentaje completado
// - Bitácoras entregadas
// - Seguimientos realizados
// - Documentos pendientes

// ============================================================================
// FUNCIÓN: getWidgetNotificaciones
// DESCRIPCIÓN: Widget notificaciones personales
// PARÁMETROS: usuarioId, limite
// TIPOS NOTIFICACIÓN:
// - Tareas asignadas
// - Vencimientos próximos
// - Cambios asignaciones
// - Mensajes sistema

// ============================================================================
// FUNCIÓN: refreshDashboardData
// DESCRIPCIÓN: Actualizar datos dashboard tiempo real
// PARÁMETROS: dashboardId, widgets[]
// FUNCIONES INTERNAS:
// - updateWidgetData() - Actualizar widget específico
// - validateDataChanges() - Verificar cambios significativos
// - broadcastUpdates() - Enviar actualizaciones WebSocket

// ============================================================================
// FUNCIÓN: exportDashboard
// DESCRIPCIÓN: Exportar dashboard a formato
// PARÁMETROS: dashboardConfig, formato
// FORMATOS: PDF (informe ejecutivo), Excel (datos), PNG (imágenes)

// ============================================================================
// FUNCIÓN: configureDashboard
// DESCRIPCIÓN: Configurar widgets dashboard usuario
// PARÁMETROS: usuarioId, widgetConfig
// CONFIGURACIÓN:
// - Widgets visibles
// - Orden widgets
// - Parámetros por widget
// - Frecuencia actualización

// ============================================================================
// FUNCIÓN: getDashboardMetrics
// DESCRIPCIÓN: Métricas agregadas para dashboard
// PARÁMETROS: nivel, periodo, filtros
// NIVELES: Personal, Área, Centro, Nacional
// RESPUESTA: Métricas agregadas con comparativos

// ============================================================================
// FUNCIÓN: getAlertasUsuario
// DESCRIPCIÓN: Alertas específicas usuario
// PARÁMETROS: usuarioId, rol, criticidad
// PERSONALIZACIÓN: Según rol y responsabilidades
// PRIORIZACIÓN: Por impacto y urgencia