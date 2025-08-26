// CAMPOS PRINCIPALES:
// - codigoFicha: String, required, unique, maxlength: 20
// - nombreFicha: String, required, maxlength: 200
// - nombreCompleto: String, required, maxlength: 300 // Nombre completo ficha
// - programaId: ObjectId, ref: 'Programa', required
// - fechaInicio: Date, required
// - fechaFin: Date, required
// - fechaVencimiento: Date, required // Para certificación
// - version: String, maxlength: 10
// - estado: String, enum: ['Activa', 'Inactiva', 'Cerrada'], default: 'Activa'
// - aprendicesCount: Number, default: 0
// - aprendicesActivos: Number, default: 0
// - instructorLider: ObjectId, ref: 'Instructor'
// - sede: String, maxlength: 100
// - jornada: String, enum: ['Diurna', 'Nocturna', 'Mixta']

// REGLAS DE VENCIMIENTO DETECTADAS:
// - Fichas anteriores noviembre 2024: 2 años para finalizar
// - Fichas desde noviembre 2024: 6 meses registrar + 6 meses ejecutar = 1 año total

// MÉTODOS REQUERIDOS:
// - getAprendicesActivos() // Aprendices activos en ficha
// - isVencida() // Si ya pasó fecha vencimiento
// - extendVencimiento(nuevaFecha, motivo) // Extender vencimiento
// - getAprendicesEtapaProductiva() // Aprendices en EP
// - calculateTiempoRestante() // Tiempo restante para vencer
// - updateAprendicesCount() // Actualizar contador aprendices
// - canAddAprendiz() // Si puede agregar más aprendices
// - removeAprendiz(aprendizId) // Quitar aprendiz de ficha
// - addAprendiz(aprendizId) // Agregar aprendiz a ficha
// - getEstadisticas() // Estadísticas completas ficha
// - generateAlertaVencimiento() // Alerta próximo vencimiento
// - closeIfExpired() // Cerrar si ya venció

// VALIDACIONES ESPECÍFICAS:
// - validateCodigoFichaUnique() // Código único
// - validateCodigoFichaFormat() // Formato código correcto
// - validateFechaInicioFin() // Fecha inicio < fecha fin
// - validateFechaVencimiento() // Vencimiento posterior a fin
// - validateProgramaAsignado() // Programa existe y activo
// - validateInstructorLider() /