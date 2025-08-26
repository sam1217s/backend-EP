// CAMPOS PRINCIPALES:
// - numeroDocumento: String, required, unique
// - tipoDocumento: String, enum: ['CC', 'CE', 'TI'], required
// - nombres: String, required, maxlength: 100
// - apellidos: String, required, maxlength: 100
// - email: String, required, unique, format: email
// - telefono: String, pattern: /^[0-9]{7,10}$/
// - especialidad: String, maxlength: 200
// - tipoContrato: String, enum: ['Planta', 'Contratista'], required
// - fechaInicioContrato: Date
// - fechaFinContrato: Date // Solo contratistas
// - areasTematicas: [String] // Áreas que puede manejar
// - horasMensualesDisponibles: Number, default: 160 // 8 horas x 20 días
// - estado: String, enum: ['Activo', 'Inactivo', 'Vacaciones', 'Licencia']
// - fechaCreacion: Date, default: Date.now

// TIPOS INSTRUCTOR DETECTADOS EN MOCKUPS:
// - Instructor de Seguimiento: Hace seguimientos y bitácoras
// - Instructor Técnico: Apoyo técnico especializado  
// - Instructor de Proyecto: Líder de proyectos productivos

// CAMPOS DETECTADOS DE MOCKUPS (páginas 15, 27, 42):
// - nombreCompleto: String // Virtual field: nombres + apellidos
// - etapaProductiva: String // Display field en asignaciones
// - rolInstructor: String // Rol específico en EP
// - horasEjecutadas: Number // Horas ejecutadas en período
// - horasPendientes: Number // Horas pendientes por ejecutar
// - horasProgramadas: Number // Horas programadas en período
// - mes: String // Para reportes mensuales
// - año: Number // Para reportes anuales

// MÉTODOS REQUERIDOS:
// - getAsignacionesActivas() // EP actualmente asignadas
// - calculateHorasEjecutadas(mes, año) // Horas ejecutadas en período
// - calculateHorasPendientes() // Horas pendientes todas las EP
// - isDisponibleParaAsignacion(horasRequeridas) // Disponibilidad
// - getProyeccionHoras(mes, año) // Proyección horas período
// - updateHorasEjecutadas(horasNuevas) // Actualizar horas ejecutadas
// - assignToEtapaProductiva(epId, tipoRol) // Asignar a EP
// - removeFromEtapaProductiva(epId) // Quitar de EP
// - calculateCargaTrabajo() // Porcentaje carga actual
// - getEtapasProductivasByTipo(tipo) // EP por tipo instructor
// - isContractExpiring(diasAnticipacion) // Contrato próximo vencer
// - canHandleArea(area) // Puede manejar área temática

// VALIDACIONES ESPECÍFICAS:
// - validateEmailInstitucional() // Email formato @sena.edu.co
// - validateNumeroDocumentoUnique() // Documento único
// - validateTipoContrato() // Tipo contrato válido
// - validateFechaContratoPlanta() // Planta sin fecha fin
// - validateFechaContratoContratista() // Contratista con fecha fin
// - validateAreasTematicasArray() // Áreas temáticas válidas
// - validateHorasDisponibles() // Horas disponibles positivas
// - validateAsignacionPosible() // Puede ser asignad