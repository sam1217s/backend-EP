// CAMPOS PRINCIPALES:
// - etapaProductivaId: ObjectId, ref: 'EtapaProductiva', required
// - aprendizId: ObjectId, ref: 'Aprendiz', required // Para tracking
// - instructorId: ObjectId, ref: 'Instructor', required
// - tipoInstructor: String, enum: ['Seguimiento', 'Técnico', 'Proyecto'], required
// - fechaAsignacion: Date, required, default: Date.now
// - fechaReasignacion: Date // Si fue reasignado
// - horasProgramadas: Number, required, min: 0
// - horasEjecutadas: Number, default: 0, min: 0
// - estado: String, enum: ['Activo', 'Inactivo', 'Reasignado'], default: 'Activo'
// - observaciones: String, maxlength: 1000
// - motivoReasignacion: String, maxlength: 500
// - usuarioAsignacion: ObjectId, ref: 'User' // Quien asignó

// CAMPOS DETECTADOS MOCKUPS:
// - nombreAprendiz: String // Display field
// - programa: String // Display field
// - modalidad: String // Display field
// - bitacoras: String // Display field - acceso rápido
// - seguimientos: String // Display field - acceso rápido

// MÉTODOS REQUERIDOS:
// - calculateHorasPendientes() // Horas programadas - ejecutadas
// - updateHorasEjecutadas(nuevasHoras) // Actualizar horas
// - isCompleta() // Si completó todas las horas
// - canBeReassigned() // Si puede ser reasignada
// - reassignToInstructor(nuevoInstructorId, motivo) // Reasignar
// - addObservacion(observacion, usuarioId) // Agregar observación
// - calculateProgress() // Progreso porcentual
// - generateNotificationData() // Data para notificaciones
// - markAsCompleted() // Marcar como completada
// - extendHorasProgramadas(horasAdicionales) // Extender horas
// - validateInstructorAvailable() // Instructor disponible

// VALIDACIONES ESPECÍFICAS:
// - validateEtapaProductivaExists() // EP existe y activa
// - validateInstructorExists() // Instructor existe y activo
// - validateTipoInstructorCompatible() // Tipo compatible con modalidad
// - validateHorasProgramadasPositivas() // Horas programadas > 0
// - validateNoAsignacionDuplicada() // No asignación duplicada mismo tipo
// - validateInstructorDisponible() // Instructor tiene horas disponibles
// - validateFechaAsignacionValida() // Fecha asignación válida
// - validateEstadoTransition() // Transiciones estado válidas
// - validateObservacionRequerida() // Observación requerida si aplica
// - validateMotivoReasignacion() // Motivo requerido si reasigna