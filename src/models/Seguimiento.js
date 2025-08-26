// CAMPOS PRINCIPALES:
// - etapaProductivaId: ObjectId, ref: 'EtapaProductiva', required
// - numeroSeguimiento: Number, required, min: 1, max: 3 // Máximo 3 seguimientos
// - fechaProgramada: Date, required // Fecha programada por sistema
// - fechaEjecucion: Date // Fecha real de ejecución
// - fechaLimite: Date // Fecha límite para ejecutar
// - estado: String, enum: ['Programada', 'Ejecutada', 'Pendiente', 'Verificada'], default: 'Programada'
// - observaciones: String, maxlength: 1000
// - observacionInstructor: String, maxlength: 1000
// - instructorId: ObjectId, ref: 'Instructor'
// - tipo: String, enum: ['Inicial', 'Intermedio', 'Final'], required
// - resultados: String, maxlength: 2000 // Resultados del seguimiento
// - planMejoramiento: String, maxlength: 1000 // Plan de mejoramiento si aplica
// - documentoAdjunto: String // URL documento seguimiento
// - fechaObservacion: Date
// - usuarioObservacion: ObjectId, ref: 'User'

// CAMPOS DETECTADOS DE MOCKUPS:
// - etapaProductivaAsignada: String // Display name del aprendiz
// - fecha: Date // Fecha del seguimiento (mockup página 3, 23)

// MÉTODOS REQUERIDOS:
// - markAsExecuted(instructorId, resultados) // Marcar como ejecutado
// - addObservacion(observacion, usuarioId) // Agregar observación
// - scheduleNextSeguimiento() // Programar siguiente seguimiento
// - generateAlertaVencimiento() // Alerta próximo vencimiento
// - calculateDiasRestantes() // Días restantes para ejecutar
// - isVencido() // Si ya pasó fecha límite
// - canBeExecuted() // Si puede ser ejecutado
// - uploadDocumento(fileUrl) // Subir documento adjunto
// - validateResultados() // Validar resultados ingresados
// - generateReporteSeguimiento() // Generar reporte del seguimiento
// - notifyStakeholders() // Notificar a partes interesadas

// VALIDACIONES ESPECÍFICAS:
// - validateNumeroSeguimiento() // Número secuencial correcto
// - validateFechaProgramada() // Fecha programada válida
// - validateInstructorAsignado() // Instructor asignado a la EP
// - validateEstadoTransition() // Transiciones de estado válidas
// - validateResultadosRequired() // Resultados requeridos al ejecutar
// - validateFechaEjecucion() // Fecha ejecución no anterior a programada
// - validateDocumentoRequerido() // Documento requerido según tipo
// - validateSecuenciaCorrecta() // Seguimientos en orden secuencial
// - validateTipoSeguimiento() // Tipo correcto según número
// - validatePlanMejoramientoSiAplica() // Plan mejoramiento si es necesario