
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
// DESCRIPCIÓN: Carga de trabajo actual instructor (EP asignadas vs. horas disponibles)
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
// RUTA: GET /api/instructores/:id/historial-asignaciones
// DESCRIPCIÓN: Historial completo asignaciones
// CONTROLLER: instructorController.getInstructorHistorialAsignaciones
// QUERY PARAMETERS:
//   - año (opcional, filtrar por año específico)

