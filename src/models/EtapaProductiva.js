// CAMPOS PRINCIPALES:
// - aprendizId: ObjectId, ref: 'Aprendiz', required
// - fichaId: ObjectId, ref: 'Ficha', required
// - programaId: ObjectId, ref: 'Programa', required
// - modalidadId: ObjectId, ref: 'Modalidad', required
// - empresaId: ObjectId, ref: 'Empresa'
// - fechaInicio: Date, required
// - fechaFin: Date, required
// - horasRequeridas: Number, required, min: 1 // 864 horas estándar
// - horasCompletadas: Number, default: 0
// - nombreEmpresa: String, required, maxlength: 200
// - telefonoEmpresa: String, pattern: /^[0-9]{7,10}$/
// - emailEmpresa: String, format: email
// - direccionEmpresa: String, maxlength: 300
// - jefeFirmante: String, required, maxlength: 150
// - telefonoJefe: String, pattern: /^[0-9]{7,10}$/
// - emailJefe: String, format: email
// - documentosAlternativos: String // URL OneDrive
// - observaciones: String, maxlength: 1000
// - estado: String, enum: ['Activo', 'Inactivo', 'Completado', 'Cancelado']
// - registroCompleto: Boolean, default: false
// - certificado: Boolean, default: false

// CAMPOS DETECTADOS DEL MOCKUP "Detalle Etapa Productiva":
// - numeroHorasEtapaProductiva: Number // 864 estándar
// - certificacion: { documentoUrl: String, juicioUrl: String }
// - asignaciones: [ObjectId] // Referencia a instructores asignados

// MÉTODOS REQUERIDOS:
// - calculateDuracion() // Duración en días/meses
// - isVencida() // Si ya pasó fecha fin
// - canBeCertified() // Validar si puede certificarse
// - getProgress() // Porcentaje completado
// - validateDocumentosCompletos() // Todos los documentos necesarios
// - addObservacion(observacion, usuario) // Agregar observación
// - updateEstado(nuevoEstado, usuario) // Cambiar estado
// - assignInstructor(instructorId, tipoInstructor) // Asignar instructor
// - removeInstructor(instructorId) // Quitar asignación instructor
// - calculateHorasRestantes() // Horas faltantes
// - canChangeModalidad() // Si se puede cambiar modalidad
// - getDiasRestantes() // Días para vencimiento
// - generateAlertaVencimiento() // Generar alerta próximo vencimiento

// VALIDACIONES ESPECÍFICAS:
// - validateFechaInicioFin() // Fecha inicio menor a fecha fin
// - validateHorasRequeridas() // Según modalidad seleccionada
// - validateEmpresaData() // Datos empresa completos y válidos
// - validateJefeInmediato() // Datos jefe inmediato
// - validateModalidadCompatible() // Modalidad compatible con programa
// - validateNoOverlapFechas() // No solapamiento con otras EP
// - validateAprendizElegible() // Aprendiz puede tener EP
// - validateDocumentosRequeridos() // Documentos según modalidad
// - validateCambioModalidad() // Si puede cambiar modalidad
// - validateFechaRegistro() // Registro dentro tiempo permitido