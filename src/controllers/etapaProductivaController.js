// ============================================================================
// FUNCIÓN: getAllEtapasProductivas
// DESCRIPCIÓN: Listar etapas productivas con filtros avanzados
// PARÁMETROS: page, limit, search, modalidad, estado, empresa, instructor, ficha
// FILTROS DISPONIBLES:
// - Por aprendiz (nombre o documento)
// - Por modalidad específica
// - Por estado (Activo/Inactivo/Completado/Cancelado)
// - Por empresa
// - Por instructor asignado
// - Por ficha
// - Por fechas inicio/fin
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilters() - Rangos fecha válidos

// ============================================================================
// FUNCIÓN: getEtapaProductivaById
// DESCRIPCIÓN: Obtener EP específica con detalles completos
// PARÁMETROS: etapaProductivaId
// INCLUYE:
// - Datos completos EP y aprendiz
// - Información empresa y contactos
// - Instructores asignados con tipos
// - Bitácoras con estados
// - Seguimientos programados y ejecutados
// - Estado certificación
// - Documentos adjuntos
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateUserCanView() - Usuario puede ver EP

// ============================================================================
// FUNCIÓN: createEtapaProductiva
// DESCRIPCIÓN: Crear nueva etapa productiva
// PARÁMETROS: etapaProductivaData
// CAMPOS OBLIGATORIOS:
// - aprendizId, fichaId, programaId, modalidadId
// - fechaInicio, fechaFin, horasRequeridas
// - nombreEmpresa, direccionEmpresa, jefeFirmante
// VALIDACIONES CRÍTICAS:
// - validateAprendizExists() - Aprendiz existe y activo
// - validateAprendizElegible() - Elegible para EP (completó lectiva)
// - validateMaxEtapasPerAprendiz() - Máximo 3 EP por aprendiz
// - validateNoOverlapFechas() - No solapamiento fechas con otras EP
// - validateModalidadCompatible() - Modalidad compatible con programa
// - validateFichaNoVencida() - Ficha no vencida para registro
// - validateEmpresaData() - Datos empresa completos
// - validateHorasRequeridas() - Horas según modalidad (864 estándar)
// - validateFechaRegistroDentroLimite() - Registro dentro tiempo permitido
// REGLAS TEMPORALES ESPECÍFICAS:
// - Fichas anteriores Nov 2024: 24 meses total para certificar
// - Fichas desde Nov 2024: 6 meses registrar + 6 meses ejecutar = 12 meses
// FUNCIONES INTERNAS:
// - createRelatedRecords() - Crear seguimientos programados
// - assignDefaultInstructors() - Asignar instructor seguimiento
// - scheduleAlerts() - Programar alertas vencimiento
// - generateDocuments() - Generar documentos base

// ============================================================================
// FUNCIÓN: updateEtapaProductiva
// DESCRIPCIÓN: Actualizar datos etapa productiva
// PARÁMETROS: etapaProductivaId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos empresa y contactos
// - Fechas (con restricciones)
// - Observaciones
// - Estado
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanUpdate() - Puede ser actualizada (no certificada)
// - validateFechaCambio() - Cambio fechas permitido
// - validateEmpresaData() - Nuevos datos empresa válidos

// ============================================================================
// FUNCIÓN: deleteEtapaProductiva
// DESCRIPCIÓN: Cancelar etapa productiva
// PARÁMETROS: etapaProductivaId, motivo, usuarioId
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanCancel() - Puede ser cancelada
// - validateMotivoRequired() - Motivo cancelación requerido
// - validateNoCertified() - No certificada aún
// FUNCIONES INTERNAS:
// - updateRelatedRecords() - Actualizar registros relacionados
// - cancelScheduledAlerts() - Cancelar alertas programadas
// - notifyInstructors() - Notificar instructores asignados
// - updateAprendizStatus() - Actualizar estado aprendiz

// ============================================================================
// FUNCIÓN: changeEtapaProductivaModalidad
// DESCRIPCIÓN: Cambiar modalidad EP existente
// PARÁMETROS: etapaProductivaId, nuevaModalidadId, motivo
// CASOS USO: Aprendiz cambia de Pasantía a Vínculo Laboral
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanChangeModalidad() - Cambio permitido
// - validateNewModalidadCompatible() - Nueva modalidad compatible
// - validateNoActiveInstructors() - Sin instructores técnicos activos
// FUNCIONES INTERNAS:
// - createNewEtapaWithNewModalidad() - Crear nueva EP
// - transferBitacorasSeguimientos() - Transferir registros
// - reassignInstructors() - Reasignar instructores
// - updateHorasRequeridas() - Actualizar horas según modalidad

// ============================================================================
// FUNCIÓN: getEtapaProductivaBitacoras
// DESCRIPCIÓN: Bitácoras específicas de una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Lista bitácoras ordenadas por número

// ============================================================================
// FUNCIÓN: getEtapaProductivaSeguimientos
// DESCRIPCIÓN: Seguimientos específicos de una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Seguimientos con fechas y estados

// ============================================================================
// FUNCIÓN: getEtapaProductivaInstructores
// DESCRIPCIÓN: Instructores asignados a EP con detalle
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Instructores con tipo, horas programadas/ejecutadas

// ============================================================================
// FUNCIÓN: checkEtapaProductivaAlerts
// DESCRIPCIÓN: Verificar alertas EP específica
// PARÁMETROS: etapaProductivaId
// ALERTAS:
// - Vencimiento próximo
// - Bitácoras atrasadas
// - Seguimientos pendientes
// - Documentos faltantes para certificación

// ============================================================================
// FUNCIÓN: validateEtapaProductivaForCertification
// DESCRIPCIÓN: Validar si EP puede certificarse
// PARÁMETROS: etapaProductivaId
// VALIDACIONES:
// - Todas bitácoras entregadas y validadas
// - Todos seguimientos completados
// - Horas requeridas completadas
// - Documentos empresa completos
// - Ficha no vencida
// RESPUESTA: { canCertify: boolean, missingRequirements: [] }

// ============================================================================
// FUNCIÓN: extendEtapaProductivaDeadline
// DESCRIPCIÓN: Extender fecha límite EP
// PARÁMETROS: etapaProductivaId, nuevaFechaFin, motivo
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanExtend() - Puede extenderse
// - validateNewDateValid() - Nueva fecha válida
// - validateMotiveRequired() - Motivo extensión
// - validateFichaNotExpired() - Ficha permite extensión

// ============================================================================
// FUNCIÓN: calculateEtapaProductivaProgress
// DESCRIPCIÓN: Calcular progreso EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA:
// - Porcentaje horas completadas
// - Bitácoras entregadas/total
// - Seguimientos completados/total
// - Días restantes
// - Estado general progreso

// ============================================================================
// FUNCIÓN: getEtapaProductivasByVencimiento
// DESCRIPCIÓN: EP próximas a vencer
// PARÁMETROS: diasAnticipacion
// FILTROS: Por fechas vencimiento próximas
// USO: Generación alertas automáticas

// ============================================================================
// FUNCIÓN: bulkUpdateEtapasProductivasStatus
// DESCRIPCIÓN: Actualizar estado múltiples EP
// PARÁMETROS: etapaProductivaIds[], nuevoEstado, motivo
// USO: Operaciones masivas administrativas

// ============================================================================
// FUNCIÓN: generateEtapaProductivaReport
// DESCRIPCIÓN: Generar reporte detallado EP
// PARÁMETROS: etapaProductivaId, includeDocuments
// RESPUESTA: Reporte completo para auditorías