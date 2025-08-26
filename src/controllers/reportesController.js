// ============================================================================
// FUNCIÓN: getReporteGeneral
// DESCRIPCIÓN: Reporte general estado etapas productivas
// PARÁMETROS: fechaInicio, fechaFin, programa, modalidad, estado
// INCLUYE:
// - Total aprendices por estado
// - Distribución por modalidades
// - Estadísticas certificación
// - Indicadores cumplimiento
// - Comparativo períodos anteriores
// VALIDACIONES:
// - validateDateRange() - Rango fechas válido
// - validateFilterParameters() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getReporteFicha
// DESCRIPCIÓN: Reporte detallado por ficha específica
// PARÁMETROS: fichaId, includeDetails
// INCLUYE:
// - Información ficha y programa
// - Lista aprendices con estados
// - Etapas productivas activas
// - Instructores asignados
// - Proyección certificaciones
// - Alertas vencimiento
// VALIDACIONES:
// - validateFichaExists() - Ficha existe
// - validateUserCanViewFicha() - Usuario puede ver ficha

// ============================================================================
// FUNCIÓN: getReporteInstructor
// DESCRIPCIÓN: Reporte individual instructor
// PARÁMETROS: instructorId, mes, año, includeProjection
// INCLUYE:
// - Datos personales instructor
// - Asignaciones actuales
// - Horas ejecutadas vs programadas
// - Distribución por modalidad
// - Evaluación desempeño
// - Proyección próximos meses
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validatePeriodoValid() - Período válido

// ============================================================================
// FUNCIÓN: getReporteModalidades
// DESCRIPCIÓN: Reporte estadístico por modalidades
// PARÁMETROS: fechaInicio, fechaFin, includeComparativo
// INCLUYE:
// - Total EP por modalidad
// - Tasa éxito certificación
// - Tiempo promedio EP
// - Horas instructor utilizadas
// - Empresas colaboradoras
// - Tendencias y proyecciones
// RESPUESTA: Datos para gráficos y tablas

// ============================================================================
// FUNCIÓN: getReporteAuditoria
// DESCRIPCIÓN: Reporte para auditoría interna/externa
// PARÁMETROS: fichaId, tipoAuditoria, fechaCorte
// INCLUYE:
// - Trazabilidad completa por ficha
// - Documentos y evidencias
// - Cumplimiento procedimientos
// - Observaciones y seguimientos
// - Estado certificaciones
// - Indicadores calidad
// FORMATOS: PDF para impresión, Excel para análisis

// ============================================================================
// FUNCIÓN: getReporteBitacoras
// DESCRIPCIÓN: Reporte estado bitácoras
// PARÁMETROS: fechaInicio, fechaFin, instructor, estado
// INCLUYE:
// - Total bitácoras por estado
// - Bitácoras vencidas/próximas vencer
// - Tiempo promedio validación
// - Distribución por instructor
// - Alertas y observaciones
// FILTROS: Por instructor, modalidad, programa

// ============================================================================
// FUNCIÓN: getReporteSeguimientos
// DESCRIPCIÓN: Reporte seguimientos realizados
// PARÁMETROS: fechaInicio, fechaFin, instructor, tipo
// INCLUYE:
// - Seguimientos programados vs ejecutados
// - Distribución por tipo (Inicial/Intermedio/Final)
// - Tiempo promedio ejecución
// - Planes mejoramiento generados
// - Seguimientos extraordinarios
// MÉTRICAS: Cumplimiento, puntualidad, efectividad

// ============================================================================
// FUNCIÓN: getReporteCertificaciones
// DESCRIPCIÓN: Reporte proceso certificaciones
// PARÁMETROS: fechaInicio, fechaFin, programa, estado
// INCLUYE:
// - Total certificaciones por estado
// - Tiempo promedio proceso
// - Tasa certificación por programa
// - Motivos rechazo frecuentes
// - Fichas próximas vencer
// ALERTAS: Certificaciones urgentes, documentos faltantes

// ============================================================================
// FUNCIÓN: getReporteHorasInstructores
// DESCRIPCIÓN: Reporte horas instructores detallado
// PARÁMETROS: mes, año, tipoInstructor, programa
// INCLUYE:
// - Distribución horas por instructor
// - Horas por tipo actividad
// - Comparativo presupuestado vs ejecutado
// - Instructores con sobrecarga
// - Proyección necesidades próximo período
// USO: Planeación recursos humanos

// ============================================================================
// FUNCIÓN: getReporteEmpresas
// DESCRIPCIÓN: Reporte empresas colaboradoras
// PARÁMETROS: fechaInicio, fechaFin, sector, tamaño
// INCLUYE:
// - Empresas activas por modalidad
// - Aprendices recibidos por empresa
// - Tasa retención aprendices
// - Evaluación colaboración
// - Nuevas empresas incorporadas
// MÉTRICAS: Satisfacción, capacidad, sectores

// ============================================================================
// FUNCIÓN: getReporteDashboard
// DESCRIPCIÓN: Datos para dashboard principal
// PARÁMETROS: rol, usuarioId, periodo
// INCLUYE SEGÚN ROL:
// ADMINISTRADOR:
//   - Totales generales sistema
//   - Indicadores clave rendimiento
//   - Alertas críticas
//   - Tendencias mensuales
// COORDINADOR:  
//   - Resumen área responsabilidad
//   - Tareas pendientes
//   - Alertas moderadas
//   - Comparativos período
// INSTRUCTOR:
//   - Asignaciones personales
//   - Actividades pendientes
//   - Horas ejecutadas/programadas
//   - Próximos vencimientos

// ============================================================================
// FUNCIÓN: getReporteIndicadores
// DESCRIPCIÓN: Reporte indicadores gestión
// PARÁMETROS: periodo, nivel (Centro/Nacional)
// INDICADORES:
// - Tasa certificación oportuna
// - Tiempo promedio EP
// - Satisfacción empresas
// - Utilización instructores
// - Cumplimiento procedimientos
// - Calidad documentación
// FORMATO: Cuadro mando integral

// ============================================================================
// FUNCIÓN: getReporteComparativo
// DESCRIPCIÓN: Reporte comparativo períodos
// PARÁMETROS: periodoActual, periodoAnterior, nivelComparacion
// INCLUYE:
// - Variaciones porcentuales
// - Tendencias principales
// - Análisis causas variaciones
// - Proyecciones futuras
// - Recomendaciones mejora

// ============================================================================
// FUNCIÓN: generateCustomReport
// DESCRIPCIÓN: Generar reporte personalizado
// PARÁMETROS: reportConfig
// CONFIGURACIÓN:
// - Campos seleccionados
// - Filtros aplicados
// - Agrupaciones
// - Ordenamiento
// - Formato salida
// VALIDACIONES:
// - validateReportConfig() - Configuración válida
// - validateUserPermissions() - Permisos usuario

// ============================================================================
// FUNCIÓN: exportReportToFormat
// DESCRIPCIÓN: Exportar reporte a formato específico
// PARÁMETROS: reportData, formato, configuracion
// FORMATOS: PDF, Excel, CSV, JSON
// CONFIGURACIÓN:
// - Plantilla diseño
// - Filtros aplicados
// - Metadatos reporte
// FUNCIONES INTERNAS:
// - generatePDFReport() - Generar PDF con plantillas
// - generateExcelReport() - Generar Excel con formato
// - generateCSVReport() - Generar CSV para análisis

// ============================================================================
// FUNCIÓN: scheduleAutomaticReport
// DESCRIPCIÓN: Programar reporte automático
// PARÁMETROS: reportConfig, schedule, recipients
// PROGRAMACIÓN:
// - Frecuencia (Diaria/Semanal/Mensual)
// - Horario envío
// - Lista destinatarios
// - Formato y configuración
// FUNCIONES INTERNAS:
// - createScheduledTask() - Crear tarea programada
// - validateScheduleConfig() - Validar configuración

// ============================================================================
// FUNCIÓN: getReportHistory
// DESCRIPCIÓN: Historial reportes generados
// PARÁMETROS: usuarioId, tipoReporte, fechaInicio, fechaFin
// INCLUYE:
// - Reportes generados por usuario
// - Fecha y hora generación
// - Parámetros utilizados
// - Enlaces descarga (si aplica)

// ============================================================================
// FUNCIÓN: validateReportAccess
// DESCRIPCIÓN: Validar acceso usuario a reporte
// PARÁMETROS: usuarioId, tipoReporte, parametros
// REGLAS ACCESO:
// - Administrador: Todos los reportes
// - Coordinador: Reportes área responsabilidad
// - Instructor: Solo reportes propios
// - Aprendiz: Solo datos personales

// ============================================================================
// FUNCIÓN: getReportTemplate
// DESCRIPCIÓN: Obtener plantilla reporte
// PARÁMETROS: tipoReporte, formato
// RESPUESTA: Configuración campos y formato por defecto