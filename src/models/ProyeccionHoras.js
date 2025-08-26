// CAMPOS PRINCIPALES:
// - instructorId: ObjectId, ref: 'Instructor', required
// - mes: Number, required, min: 1, max: 12
// - año: Number, required, min: 2020
// - horasProgramadas: Number, default: 0, min: 0
// - horasEjecutadas: Number, default: 0, min: 0
// - horasPendientes: Number, default: 0, min: 0
// - horasFormacion: Number, default: 0, min: 0 // Horas formación regular
// - horasEtapasProductivas: Number, default: 0, min: 0
// - horasDisponibles: Number, default: 160, min: 0 // Horas mensuales disponibles
// - fechaActualizacion: Date, default: Date.now

// DETALLES POR APRENDIZ (Subdocumento):
// - detallePorAprendiz: [{
//   aprendizId: ObjectId,
//   nombreAprendiz: String,
//   tipoInstructor: String,
//   horasProgramadas: Number,
//   horasEjecutadas: Number,
//   horasPendientes: Number,
//   modalidad: String
// }]

// CAMPOS DETECTADOS MOCKUPS:
// - nombreInstructor: String // Display field
// - horasTotales: Number // horasEjecutadas + horasPendientes

// MÉTODOS REQUERIDOS:
// - calculateProjection() // Calcular proyección mensual
// - updateExecutedHours(aprendizId, horas) // Actualizar horas ejecutadas
// - generateReport() // Generar reporte período
// - addAprendizToProjection(aprendizId, horas, tipo) // Agregar aprendiz
// - removeAprendizFromProjection(aprendizId) // Quitar aprendiz
// - calculateUtilization() // Porcentaje utilización instructor
// - getAvailableHours() // Horas disponibles restantes
// - projectNextMonth() // Proyectar mes siguiente
// - compareWithPreviousMonth() // Comparar mes anterior
// - generateAlertSobrecarga() // Alerta sobrecarga horas
// - recalculateAll() // Recalcular toda la proyección

// VALIDACIONES ESPECÍFICAS:
// - validateMesAño() // Mes y año válidos
// - validateInstructorExists() // Instructor existe
// - validateHorasPositivas() // Todas las horas >= 0
// - validateHorasNoExcedenDisponibles() // No exceder horas disponibles
// - validateDetalleSumaConsistente() // Detalle suma correcta
// - validateFechaPeriodo() // Fecha dentro período válido
// - validateUnicidadMesAñoInstructor() // Único por mes/año/instructor
// - validateHorasFormacionSeparadas() // Separar horas formación/EP