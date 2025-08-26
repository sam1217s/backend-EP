// CAMPOS PRINCIPALES:
// - etapaProductivaId: ObjectId, ref: 'EtapaProductiva', required
// - numeroBitacora: Number, required, min: 1, max: 12 // Máximo 12 bitácoras
// - fechaPresentacion: Date, required
// - fechaAprobacion: Date
// - fechaVencimiento: Date // 15 días después presentación
// - estado: String, enum: ['Pendiente', 'Ejecutada', 'Verificada'], default: 'Pendiente'
// - observaciones: String, maxlength: 1000
// - observacionInstructor: String, maxlength: 1000
// - instructorId: ObjectId, ref: 'Instructor'
// - validada: Boolean, default: false
// - archivoAdjunto: String // URL del archivo
// - horasValidadas: Number, min: 0
// - fechaObservacion: Date
// - usuarioObservacion: ObjectId, ref: 'User'

// CAMPOS DETECTADOS DE LOS MOCKUPS:
// - etapaProductivaAsignada: String // Nombre del aprendiz (display)
// - validarHoras: Boolean // Checkbox para validar horas (mockup página 13, 24)

// MÉTODOS REQUERIDOS:
// - validateBitacora(instructorId) // Marcar como validada
// - addObservacion(observacion, usuarioId) // Agregar observación
// - markAsValidated(instructorId) // Marcar como validada
// - checkVencimiento() // Verificar si está vencida
// - calculateDiasRestantes() // Días restantes para vencimiento
// - isVencida() // Si ya pasó fecha vencimiento
// - canBeEdited() // Si puede ser editada
// - uploadArchivo(fileUrl) // Subir archivo adjunto
// - approveHoras(horas, instructorId) // Aprobar horas
// - generateAlertaVencimiento() // Alerta próximo vencimiento
// - getDetalleCompleto() // Detalle completo con instructor

// VALIDACIONES ESPECÍFICAS:
// - validateNumeroBitacora() // Número secuencial correcto
// - validateFechaPresentacion() // Fecha válida y no futura
// - validateInstructorAsignado() // Instructor asignado a la EP
// - validateEstadoTransition() // Transiciones de estado válidas
// - validateArchivoFormato() // Formato archivo permitido
// - validateHorasValidadas() // Horas dentro rango permitido
// - validateObservacionRequired() // Observación requerida según estado
// - validateFechaVencimiento() // 15 días después presentación
// - validateNoDuplicateBitacora() // No duplicar número bitácora
// - validateSecuenciaCorrecta() // Bitácoras en orden secuencial