// ============================================================================
// CAMPOS PRINCIPALES (heredados de User):
// - _id: ObjectId (referencia al documento User base)
// - numeroDocumento: String, required, unique (heredado)
// - tipoDocumento: String, enum: ['CC', 'CE', 'TI'], required (heredado)
// - nombres: String, required, trim: true, maxlength: 100 (heredado)
// - apellidos: String, required, trim: true, maxlength: 100 (heredado)
// - email: String, required, unique, format: email (heredado)
// - rol: String, default: 'Coordinador' (heredado)
// - estado: String, enum: ['Activo', 'Inactivo'], default: 'Activo' (heredado)

// ============================================================================
// CAMPOS ESPECÍFICOS COORDINADOR:
// - areasAsignadas: [String], required, min: 1 // Áreas que coordina
// - programasAsignados: [ObjectId], ref: 'Programa' // Programas que supervisa
// - centroFormacion: String, required, maxlength: 150 // Centro SENA asignado
// - tipoCoordinacion: String, enum: ['Académica', 'Administrativa', 'Etapas Productivas'], required
// - fechaAsignacion: Date, required, default: Date.now // Fecha asignación cargo
// - estadoCoordinacion: String, enum: ['Activo', 'Inactivo', 'Licencia', 'Vacaciones'], default: 'Activo'
// - permisosEspeciales: [String], default: [] // Permisos adicionales específicos
// - instructoresAsignados: [ObjectId], ref: 'Instructor' // Instructores bajo supervisión
// - fichasAsignadas: [ObjectId], ref: 'Ficha' // Fichas que supervisa directamente
// - jefeInmediato: ObjectId, ref: 'Administrador' // Administrador superior
// - horasSemanalesAsignadas: Number, default: 40, min: 20, max: 48 // Horas semanales coordinación
// - especialidadArea: String, maxlength: 200 // Especialidad área que coordina
// - fechaUltimaEvaluacion: Date // Última evaluación desempeño
// - metasAsignadas: Object // Metas específicas coordinación

// ============================================================================
// ÁREAS SENA DISPONIBLES:
// - "Sistemas y Desarrollo de Software"
// - "Electricidad y Electrónica" 
// - "Contabilidad y Finanzas"
// - "Turismo y Hotelería"
// - "Construcción y Arquitectura"
// - "Peluquería y Estética"
// - "Mecánica Industrial"
// - "Salud y Bienestar"

// ============================================================================
// MÉTODOS ESPECÍFICOS COORDINADOR:
// - getInstructoresBajoSupervision() // Obtener instructores que coordina
// - getFichasArea() // Obtener fichas del área asignada
// - getEstadisticasArea() // Métricas y estadísticas área coordinada
// - canApproveHoras(instructorId) // Verificar si puede aprobar horas instructor
// - canManageInstructor(instructorId) // Verificar si puede gestionar instructor
// - getAprendicesArea() // Obtener aprendices en programas asignados
// - getAlertasArea() // Obtener alertas específicas del área
// - getEtapasProductivasArea() // EP del área coordinada
// - calculateAreaPerformance() // Calcular rendimiento área
// - getInstructorWorkload() // Carga trabajo instructores área
// - canAssignInstructor(instructorId, etapaProductivaId) // Puede asignar instructor
// - getAreaBudget() // Presupuesto horas área
// - validateAreaAccess(resourceType, resourceId) // Validar acceso recursos área

// ============================================================================
// VALIDACIONES ESPECÍFICAS:
// - validateAreasAsignadas() // Áreas válidas y coherentes
// - validateProgramasCompatibles() // Programas compatibles con áreas
// - validateInstructoresArea() // Instructores pertenecen al área
// - validateFichasArea() // Fichas corresponden a programas área
// - validatePermisosEspeciales() // Permisos especiales válidos
// - validateJerarquiaOrganizacional() // Jerarquía organizacional correcta
// - validateHorasAsignadas() // Horas semanales dentro rangos
// - validateEspecialidadArea() // Especialidad corresponde área asignada
// - validateMetasCoherentes() // Metas asignadas son alcanzables

// ============================================================================
// MIDDLEWARE HOOKS:
// - pre('save') // Validar coherencia datos antes guardar
// - post('save') // Actualizar cache áreas después guardar
// - pre('remove') // Validar puede ser removido (sin asignaciones críticas)
// - post('remove') // Reasignar responsabilidades después remover

// ============================================================================
// ÍNDICES REQUERIDOS:
// - { email: 1 } // Único, búsquedas rápidas
// - { areasAsignadas: 1, estadoCoordinacion: 1 } // Búsquedas por área activa
// - { centroFormacion: 1, tipoCoordinacion: 1 } // Búsquedas por centro y tipo
// - { instructoresAsignados: 1 } // Búsquedas por instructor asignado
// - { programasAsignados: 1 } // Búsquedas por programa asignado

// ============================================================================
// VIRTUALS:
// - nombreCompleto: nombres + ' ' + apellidos
// - totalInstructores: instructoresAsignados.length
// - totalFichas: fichasAsignadas.length
// - areasPrincipales: areasAsignadas.slice(0, 2) // Primeras 2 áreas principales