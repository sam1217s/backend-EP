// CAMPOS PRINCIPALES (del mockup página 1, 7, 40, 55):
// - numeroDocumento: String, required, unique
// - tipoDocumento: String, enum: ['CC', 'TI', 'CE'], required
// - nombres: String, required, trim: true, maxlength: 100
// - apellidos: String, required, trim: true, maxlength: 100  
// - emailPersonal: String, required, format: email
// - emailInstitucional: String, format: email (patrón @sena.edu.co)
// - telefono: String, required, pattern: /^[0-9]{10}$/
// - fichaId: ObjectId, ref: 'Ficha', required
// - programaId: ObjectId, ref: 'Programa'
// - codigoFicha: String, required (del mockup)
// - estadoFormacion: String, enum: ['En Formación', 'Etapa Productiva', 'Certificado', 'Retirado']
// - fechaInicioFormacion: Date
// - fechaFinFormacion: Date
// - fechaRegistroEtapaProductiva: Date
// - observaciones: String, maxlength: 500
// - esFIC: Boolean, default: false // Chicos FIC reciben apoyo sostenimiento
// - requiereAposoSostenimiento: Boolean, default: false
// - estado: String, enum: ['Activo', 'Inactivo'], default: 'Activo'

// CAMPOS ADICIONALES DETECTADOS:
// - modalidadEtapaProductiva: String (del mockup selección modalidad)
// - fechaVencimientoFicha: Date // Para alertas de vencimiento
// - documentosEntregados: [String] // Lista de documentos entregados
// - traslados: [{ fichaAnterior, fichaActual, fecha, motivo }]

// MÉTODOS REQUERIDOS:
// - getHistorialEtapasProductivas() // Todas las EP del aprendiz
// - isElegibleParaEtapaProductiva() // Validar si puede registrar EP
// - getFichaVencimiento() // Calcular fecha vencimiento ficha
// - updateEstadoFormacion(nuevoEstado) // Cambiar estado con validaciones
// - hasCompletedFormacionLectiva() // Verificar formación lectiva completa
// - getEtapaProductivaActiva() // EP actual activa
// - canRegisterNewEtapaProductiva() // Validar si puede registrar nueva EP
// - calculateTiempoRestanteFormacion() // Tiempo restante para certificar
// - hasDocumentosCompletos() // Verificar documentos completos
// - addTraslado(fichaAnterior, fichaActual, motivo) // Registrar traslado
// - getAlertasVencimiento() // Alertas por fechas próximas

// VALIDACIONES ESPECÍFICAS:
// - validateEmailPersonalUnique() // Email personal único
// - validateEmailInstitucional() // Formato correcto @sena.edu.co
// - validateTelefonoFormat() // 10 dígitos
// - validateFichaAsignacion() // Ficha existe y activa
// - validateEstadoTransition(oldState, newState) // Transiciones válidas
// - validateDocumentoCompleteForEP() // Documentos necesarios para EP
// - validateFechaRegistroEP() // Dentro del tiempo permitido
// - validateNoActiveEtapaProductiva() // No tener EP activa al crear nueva