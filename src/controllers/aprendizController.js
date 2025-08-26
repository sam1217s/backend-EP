// ============================================================================
// FUNCIÓN: getAllAprendices
// DESCRIPCIÓN: Listar aprendices con filtros y paginación
// PARÁMETROS: page, limit, search, ficha, programa, estado, estadoFormacion
// FILTROS DISPONIBLES:
// - Por número documento o nombres/apellidos
// - Por ficha específica
// - Por programa formación
// - Por estado (Activo/Inactivo)
// - Por estado formación (En Formación/Etapa Productiva/Certificado/Retirado)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación válidos
// - validateSearchFilters() - Filtros búsqueda válidos
// RESPUESTA: { aprendices, totalPages, currentPage, totalRecords }

// ============================================================================
// FUNCIÓN: getAprendizById
// DESCRIPCIÓN: Obtener aprendiz específico con detalles completos
// PARÁMETROS: aprendizId
// INCLUYE:
// - Datos personales aprendiz
// - Información ficha y programa
// - Etapas productivas históricas
// - Bitácoras y seguimientos actuales
// - Estado certificación
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateUserCanViewAprendiz() - Usuario puede ver aprendiz

// ============================================================================
// FUNCIÓN: createAprendiz
// DESCRIPCIÓN: Crear nuevo aprendiz en sistema (carga masiva o individual)
// PARÁMETROS: aprendizData o array de aprendices
// CAMPOS OBLIGATORIOS:
// - numeroDocumento, tipoDocumento, nombres, apellidos
// - emailPersonal, telefono, fichaId, programaId
// VALIDACIONES ESPECÍFICAS:
// - validateDocumentUnique() - Documento único
// - validateEmailPersonalUnique() - Email personal único
// - validateEmailInstitucional() - Formato @sena.edu.co si existe
// - validateTelefonoFormat() - 10 dígitos
// - validateFichaExists() - Ficha existe y activa
// - validateProgramaExists() - Programa existe y activo
// FUNCIONES INTERNAS:
// - createUserAccount() - Crear cuenta usuario para login
// - sendWelcomeNotification() - Notificar creación cuenta

// ============================================================================
// FUNCIÓN: updateAprendiz
// DESCRIPCIÓN: Actualizar datos aprendiz
// PARÁMETROS: aprendizId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos personales (nombres, apellidos, teléfono, email)
// - Estado formación
// - Observaciones
// - Documentos entregados
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateUpdateData() - Datos actualización válidos
// - validateEstadoTransition() - Transición estado válida
// - validateUserCanUpdate() - Usuario puede actualizar

// ============================================================================
// FUNCIÓN: deleteAprendiz
// DESCRIPCIÓN: Inactivar aprendiz (soft delete)
// PARÁMETROS: aprendizId, motivo
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateCanInactivate() - Puede ser inactivado
// - validateMotiveRequired() - Motivo requerido
// - validateNoActiveEtapaProductiva() - No tiene EP activa
// FUNCIONES INTERNAS:
// - inactivateRelatedRecords() - Inactivar registros relacionados

// ============================================================================
// FUNCIÓN: getAprendizEtapasProductivas
// DESCRIPCIÓN: Historial completo etapas productivas aprendiz
// PARÁMETROS: aprendizId
// INCLUYE:
// - Todas las EP del aprendiz (activas e inactivas)
// - Modalidades utilizadas
// - Fechas inicio/fin
// - Estado actual de cada EP
// - Instructores asignados
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe

// ============================================================================
// FUNCIÓN: getAprendizBitacoras
// DESCRIPCIÓN: Bitácoras aprendiz por etapa productiva
// PARÁMETROS: aprendizId, etapaProductivaId (opcional)
// RESPUESTA: Bitácoras con estado validación y observaciones

// ============================================================================
// FUNCIÓN: getAprendizSeguimientos
// DESCRIPCIÓN: Seguimientos aprendiz por etapa productiva  
// PARÁMETROS: aprendizId, etapaProductivaId (opcional)
// RESPUESTA: Seguimientos con fechas y resultados

// ============================================================================
// FUNCIÓN: getAprendizCertificaciones
// DESCRIPCIÓN: Estado certificación aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA: Certificaciones completadas y en proceso

// ============================================================================
// FUNCIÓN: checkAprendizVencimientos
// DESCRIPCIÓN: Verificar fechas vencimiento próximas
// PARÁMETROS: aprendizId
// ALERTAS:
// - Vencimiento ficha
// - Bitácoras pendientes
// - Seguimientos próximos
// - Certificación próxima

// ============================================================================
// FUNCIÓN: updateAprendizEstado
// DESCRIPCIÓN: Cambiar estado formación aprendiz
// PARÁMETROS: aprendizId, nuevoEstado, observaciones
// ESTADOS VÁLIDOS:
// - En Formación -> Etapa Productiva
// - Etapa Productiva -> Certificado
// - Cualquier estado -> Retirado
// VALIDACIONES:
// - validateEstadoTransition() - Transición permitida
// - validatePrerequisites() - Cumple prerequisitos
// - validateObservacionesRequired() - Observaciones si aplica

// ============================================================================
// FUNCIÓN: transferAprendizFicha
// DESCRIPCIÓN: Transferir aprendiz entre fichas
// PARÁMETROS: aprendizId, nuevaFichaId, motivo
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateNewFichaExists() - Nueva ficha existe y activa
// - validateSamePrograma() - Mismo programa formación
// - validateMotivoRequired() - Motivo transferencia
// FUNCIONES INTERNAS:
// - registerTraslado() - Registrar historial traslado
// - updateRelatedRecords() - Actualizar registros relacionados

// ============================================================================
// FUNCIÓN: bulkUploadAprendices
// DESCRIPCIÓN: Carga masiva aprendices desde Excel/CSV
// PARÁMETROS: file
// VALIDACIONES MASIVAS:
// - validateFileFormat() - Formato archivo correcto
// - validateHeaders() - Headers requeridos
// - validateBatchData() - Validar datos en lote
// - validateDuplicatesInFile() - No duplicados en archivo
// FUNCIONES INTERNAS:
// - processUploadFile() - Procesar archivo
// - validateAprendicesData() - Validar datos masivamente
// - createAprendicesBatch() - Crear en lote con transacciones