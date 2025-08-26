// CAMPOS PRINCIPALES:
// - nombreEmpresa: String, required, maxlength: 200
// - nit: String, required, unique, pattern: /^[0-9]{9,11}$/
// - telefono: String, required, pattern: /^[0-9]{7,10}$/
// - email: String, required, format: email
// - direccion: String, required, maxlength: 300
// - contactoPrincipal: String, required, maxlength: 150
// - telefonoContacto: String, pattern: /^[0-9]{7,10}$/
// - emailContacto: String, format: email
// - tipoEmpresa: String, enum: ['Privada', 'Pública', 'Mixta'], default: 'Privada'
// - sector: String, maxlength: 100
// - tamaño: String, enum: ['Micro', 'Pequeña', 'Mediana', 'Grande']
// - estado: String, enum: ['Activa', 'Inactiva'], default: 'Activa'
// - fechaRegistro: Date, default: Date.now

// CAMPOS ADICIONALES SUGERIDOS:
// - convenioMarco: Boolean, default: false // Si tiene convenio marco
// - calificacionColaboracion: Number, min: 1, max: 5 // Calificación histórica
// - historialColaboracion: [{ año: Number, aprendicesRecibidos: Number }]
// - documentosLegales: [String] // URLs documentos legales

// MÉTODOS REQUERIDOS:
// - getEtapasProductivasActivas() // EP actualmente activas
// - updateContacto(nuevoContacto) // Actualizar datos contacto
// - addHistorialColaboracion(año, cantidad) // Agregar historial
// - calculatePromedioAprendices() // Promedio aprendices/año
// - isElegibleParaConvenio() // Elegible convenio marco
// - getCalificacionPromedio() // Calificación promedio
// - addCalificacion(calificacion, epId) // Agregar calificación
// - getEstadisticasColaboracion() // Estadísticas colaboración
// - validateCapacidadAprendices() // Capacidad para más aprendices
// - generatePerfilEmpresa() // Perfil completo empresa

// VALIDACIONES ESPECÍFICAS:
// - validateNitUnique() // NIT único en sistema
// - validateN