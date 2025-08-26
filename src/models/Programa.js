// CAMPOS PRINCIPALES:
// - codigoPrograma: String, required, unique, maxlength: 20
// - nombrePrograma: String, required, maxlength: 300
// - areaFormacion: String, required, maxlength: 100
// - nivel: String, enum: ['Técnico', 'Tecnólogo', 'Especialización'], required
// - version: String, maxlength: 10
// - duracion: Number, required // Duración en meses
// - horasFormacion: Number, required // Total horas formación
// - competencias: [String] // Lista competencias del programa
// - estado: String, enum: ['Activo', 'Inactivo'], default: 'Activo'
// - fechaCreacion: Date, default: Date.now
// - fechaActualizacion: Date

// ÁREAS DETECTADAS EN ENTREVISTA:
// - Sistemas/Desarrollo Software
// - Electricidad (3 programas diferentes)
// - Contabilidad y Finanzas
// - Turismo
// - Peluquería
// - Construcción

// MÉTODOS REQUERIDOS:
// - getFichasActivas() // Fichas activas del programa
// - getModalidadesPermitidas() // Modalidades compatibles
// - getAprendicesActivos() // Total aprendices activos
// - addCompetencia(competencia) // Agregar competencia
// - removeCompetencia(competencia) // Quitar competencia
// - updateVersion(nuevaVersion) // Actualizar versión
// - getEstadisticas() // Estadísticas programa
// - isCompatibleWithModalidad(modalidadId) // Compatible modalidad
// - calculateGraduationRate() // Tasa graduación
// - getInstructoresAsignados() // Instructores del área

// VALIDACIONES ESPECÍFICAS:
// - validateCodigoProgramaUnique() // Código único
// - validateCodigoProgramaFormat() // Formato código correcto
// - validateNombreProgramaRequired() // Nombre requerido
// - validateAreaFormacionExists() // Área formación existe
// - validateDuracionPositiva() // Duración positiva
// - validateHorasFo