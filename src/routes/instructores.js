// ============================================================================
// RUTA: GET /api/instructores
// DESCRIPCIÓN: Listar instructores con filtros
// CONTROLLER: instructorController.getAllInstructores
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por nombre/documento)
//   - especialidad (filtrar por especialidad)
//   - tipoContrato (Planta/Contratista)
//   - estado (Activo/Inactivo/Vacaciones/Licencia)
//   - areasTematicas (filtrar por áreas)
// VALIDACIONES QUERY:
//   - query('tipoContrato').optional().isIn(['Planta', 'Contratista'])
//   - query('estado').optional().isIn(['Activo', 'Inactivo', 'Vacaciones', 'Licencia'])

// ============================================================================
// RUTA: GET /api/instructores/:id
// DESCRIPCIÓN: Obtener instructor específico con detalles
// CONTROLLER: instructorController.getInstructorById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess // Instructor puede ver sus datos
//   - validation.validateMongoId('id')
// PERMISOS: Instructor solo sus datos, Admin/Coordinador todos

// ============================================================================
// RUTA: POST /api/instructores
// DESCRIPCIÓN: Crear nuevo instructor
// CONTROLLER: instructorController.createInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateInstructorCreation
// VALIDACIONES BODY:
//   - body('numeroDocumento').isLength({min: 6, max: 15}).matches(/^[0-9]+$/)
//   - body('tipoDocumento').isIn(['CC', 'CE', 'TI'])
//   - body('nombres').notEmpty().isLength({max: 100}).trim()
//   - body('apellidos').notEmpty().isLength({max: 100}).trim()
//   - body('email').isEmail().custom(validateSenaEmail) // Obligatorio @sena.edu.co
//   - body('telefono').optional().matches(/^[0-9]{7,10}$/)
//   - body('especialidad').notEmpty().isLength({max: 200})
//   - body('tipoContrato').isIn(['Planta', 'Contratista'])
//   - body('areasTematicas').isArray({min: 1})
//   - body('horasMensualesDisponibles').isInt({min: 1, max: 200}).default(160)
// BODY REQUEST:
// {
//   "numeroDocumento": "12345678",
//   "tipoDocumento": "CC",
//   "nombres": "María Elena",
//   "apellidos": "Gómez Silva",
//   "email": "maria.gomez@sena.edu.co",
//   "telefono": "3209876543",
//   "especialidad": "Desarrollo de Software",
//   "tipoContrato": "Planta",
//   "areasTematicas": ["Programación", "Base de Datos"],
//   "horasMensualesDisponibles": 160
// }

// ============================================================================
// RUTA: PUT /api/instructores/:id
// DESCRIPCIÓN: Actualizar datos instructor
// CONTROLLER: instructorController.updateInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateInstructorUpdate
// RESTRICTION: Coordinador solo instructores de su área

// ============================================================================
// RUTA: DELETE /api/instructores/:id
// DESCRIPCIÓN: Inactivar instructor
// CONTROLLER: instructorController.deleteInstructor
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})

// ============================================================================
// RUTA: GET /api/instructores/:id/asignaciones
// DESCRIPCIÓN: Asignaciones actuales del instructor
// CONTROLLER: instructorController.getInstructorAsignaciones
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeInstructorAccess
// QUERY PARAMETERS:
//   - estado (opcional: Activo/Inactivo/Completado)

// ============================================================================
// RUTA: GET /api/instructores/:id/carga-trabajo
// DESCRIPCIÓN: Carga de trabajo actual instructor
// CONTROLLER: instructorController.getInstructorCargaTrabajo
// MIDDLEWARES: Similares al anterior
// QUERY PARAMETERS:
//   - mes (opcional, default: mes actual)
//   - año (opcional, default: año actual)

// ============================================================================
// RUTA: GET /api/instructores/:id/proyeccion-horas
// DESCRIPCIÓN: Proyección horas próximos meses
// CONTROLLER: instructorController.getInstructorProyeccionHoras
// QUERY PARAMETERS:
//   - mesesAdelante (default: 3)

// ============================================================================
// RUTA: PUT /api/instructores/:id/disponibilidad
// DESCRIPCIÓN: Actualizar disponibilidad mensual
// CONTROLLER: instructorController.updateInstructorDisponibilidad
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('mes').isInt({min: 1, max: 12})
//   - body('año').isInt({min: 2020, max: 2030})
//   - body('horasDisponibles').isInt({min: 0, max: 250})

// ============================================================================
// RUTA: GET /api/instructores/disponibles
// DESCRIPCIÓN: Instructores disponibles por área temática
// CONTROLLER: instructorController.getInstructorsByArea
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// QUERY PARAMETERS:
//   - areaTematica (requerido)
//   - modalidad (opcional)
//   - horasRequeridas (opcional)
// VALIDACIONES QUERY:
//   - query('areaTematica').notEmpty()
//   - query('horasRequeridas').optional().isInt({min: 1})

// ============================================================================
// RUTA: POST /api/instructores/:id/asignar-ep
// DESCRIPCIÓN: Asignar instructor a etapa productiva
// CONTROLLER: instructorController.assignInstructorToEtapa
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('etapaProductivaId').isMongoId()
//   - body('tipoInstructor').isIn(['Seguimiento', 'Técnico', 'Proyecto'])
//   - body('horasProgramadas').isInt({min: 1, max: 200})

// ============================================================================
// RUTA: DELETE /api/instructores/:instructorId/ep/:etapaId
// DESCRIPCIÓN: Quitar instructor de etapa productiva
// CONTROLLER: instructorController.removeInstructorFromEtapa
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivo').notEmpty().isLength({min: 10, max: 500})

// ============================================================================
// RUTA: GET /api/instructores/:id/historial-asignaciones
// DESCRIPCIÓN: Historial completo asignaciones
// CONTROLLER: instructorController.getInstructorHistorialAsignaciones
// QUERY PARAMETERS:
//   - año (opcional, filtrar por año específico)

// ============================================================================
// RUTA: GET /api/instructores/:id/performance
// DESCRIPCIÓN: Métricas rendimiento instructor
// CONTROLLER: instructorController.calculateInstructorPerformance
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodoInicio (formato: YYYY-MM-DD)
//   - periodoFin (formato: YYYY-MM-DD)
// VALIDACIONES QUERY:
//   - query('periodoInicio').isISO8601().toDate()
//   - query('periodoFin').isISO8601().toDate()