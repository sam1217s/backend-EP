// CAMPOS PRINCIPALES:
// - instructorId: ObjectId, ref: 'Instructor', required
// - etapaProductivaId: ObjectId, ref: 'EtapaProductiva', required
// - aprendizId: ObjectId, ref: 'Aprendiz', required
// - fecha: Date, required
// - tipoActividad: String, enum: ['Seguimiento', 'Revisión Bitácora', 'Asesoría Técnica', 'Asesoría Proyecto'], required
// - horasRegistradas: Number, required, min: 0.5, max: 8
// - descripcion: String, maxlength: 500
// - aprobado: Boolean, default: false
// - fechaAprobacion: Date
// - observaciones: String, maxlength: 1000
// - usuarioAprobacion: ObjectId, ref: 'User'
// - mes: Number, required, min: 1, max: 12
// - año: Number, required, min: 2020

// TIPOS ACTIVIDAD DETECTADOS:
// - Seguimiento: 2 horas por seguimiento
// - Revisión Bitácora: 1 hora por cada 4 bitácoras
// - Asesoría Técnica: Horas variables según modalidad
// - Asesoría Proyecto: Horas variables según tipo proyecto

// MÉTODOS REQUERIDOS:
// - approveHours(usuarioId) // Aprobar horas
// - calculateMonthlyTotal(instructorId, mes, año) // Total mensual
// - validateHours() // Validar horas registradas
// - addObservacion(observacion, usuarioId) // Agregar observación
// - isWithinLimit() // Dentro límite horas diarias/mensuales
// - getDuplicateEntries() // Entradas duplicadas mismo día
// - generateTimesheet(instructorId, período) // Hoja tiempo
// - calculateOvertime() // Calcular horas extra
// - markAsPaid() // Marcar como pagado
// - generatePayrollData() // Data para nómina

// VALIDACIONES ESPECÍFICAS:
// - validateInstructorExists() // Instructor existe
// - validateEtapaProductivaActive() // EP activa
// - validateFechaNoFutura() // Fecha no futura
// - validateHorasDentroLimite() // Horas dentro límite diario
// - validateTipoActividadPermitido() // Tipo actividad válido
// - validateDescripcionRequerida() // Descripción requerida
// - validateNoDuplicacion() // No duplicar mismo día/actividad
// - validateHorasContraAsigna