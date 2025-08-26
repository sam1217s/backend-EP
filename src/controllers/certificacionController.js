// ============================================================================
// FUNCIÓN: getAllCertificaciones
// DESCRIPCIÓN: Listar certificaciones con filtros
// PARÁMETROS: page, limit, search, estado, ficha, programa, fechaInicio, fechaFin
// FILTROS:
// - Por estado certificación (Por Certificar/Certificado/Rechazado)
// - Por ficha específica
// - Por programa formación
// - Por rango fechas solicitud
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilter() - Rango fechas válido

// ============================================================================
// FUNCIÓN: getCertificacionById
// DESCRIPCIÓN: Obtener certificación específica con detalles
// PARÁMETROS: certificacionId
// INCLUYE:
// - Datos certificación completos
// - Información aprendiz y ficha
// - Detalles etapa productiva
// - Documentos adjuntos (certificación, juicio, pantallazos)
// - Historial observaciones
// - Estado evaluación Sofía Plus
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe

// ============================================================================
// FUNCIÓN: createCertificacion
// DESCRIPCIÓN: Crear solicitud certificación
// PARÁMETROS: certificacionData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, aprendizId, fichaId
// PREREQUISITOS AUTOMÁTICOS:
// - Todas bitácoras entregadas y verificadas (12/12)
// - Todos seguimientos completados (3/3)
// - Horas EP completadas (864 mínimo)
// - Evaluación Sofía Plus realizada
// - Documentos empresa completos
// VALIDACIONES CRÍTICAS:
// - validateEtapaProductivaExists() - EP existe
// - validateEtapaProductivaCompleted() - EP completada
// - validateAllBitacorasCompleted() - Todas bitácoras OK
// - validateAllSeguimientosCompleted() - Todos seguimientos OK
// - validateHorasCompleted() - Horas requeridas completadas
// - validateFichaNotExpired() - Ficha no vencida
// - validateEvaluacionSofiaCompleted() - Evaluación Sofía realizada
// - validateNoPreviousCertification() - No certificado previamente
// FUNCIONES INTERNAS:
// - generateCertificationCode() - Generar código certificación
// - createNotifications() - Notificar coordinador y aprendiz
// - updateAprendizStatus() - Actualizar estado aprendiz

// ============================================================================
// FUNCIÓN: updateCertificacion
// DESCRIPCIÓN: Actualizar certificación existente
// PARÁMETROS: certificacionId, updateData
// CAMPOS ACTUALIZABLES:
// - observaciones
// - evaluacionSofia (marcar como completada)
// - documentos adjuntos
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateNotCertified() - No certificada aún
// - validateUserCanUpdate() - Usuario puede actualizar

// ============================================================================
// FUNCIÓN: uploadCertificationDocument
// DESCRIPCIÓN: Subir documento certificación
// PARÁMETROS: certificacionId, tipoDocumento, file, uploaderUserId
// TIPOS DOCUMENTO:
// - "certificacion": Documento certificación final
// - "juicio": Documento juicio evaluativo
// - "pantallazo": Pantallazo evaluación Sofía
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateTipoDocumentoValid() - Tipo documento válido
// - validateFileFormat() - Formato PDF obligatorio
// - validateFileSize() - Tamaño máximo 10MB
// - validateUserCanUpload() - Usuario autorizado subir
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar en OneDrive
// - linkDocumentToCertification() - Vincular documento
// - checkAllDocumentsUploaded() - Verificar completitud documentos

// ============================================================================
// FUNCIÓN: approveCertification
// DESCRIPCIÓN: Aprobar certificación final
// PARÁMETROS: certificacionId, coordinadorId, observaciones
// VALIDACIONES FINALES:
// - validateCertificacionExists() - Certificación existe
// - validateAllDocumentsUploaded() - Todos documentos subidos
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateEvaluacionSofiaCompleted() - Evaluación Sofía OK
// - validateFichaStillValid() - Ficha aún válida
// FUNCIONES INTERNAS:
// - updateCertificationStatus() - Cambiar a "Certificado"
// - generateFinalCertificate() - Generar certificado final
// - updateAprendizStatus() - Cambiar aprendiz a "Certificado"
// - createSuccessNotifications() - Notificar éxito
// - updateStatistics() - Actualizar estadísticas centro

// ============================================================================
// FUNCIÓN: rejectCertification
// DESCRIPCIÓN: Rechazar certificación
// PARÁMETROS: certificacionId, coordinadorId, motivoRechazo
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateNotCertified() - No certificada aún
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - updateCertificationStatus() - Cambiar a "Rechazado"
// - addRejectionObservation() - Agregar observación rechazo
// - notifyStakeholders() - Notificar instructor y aprendiz
// - createFollowUpTasks() - Crear tareas seguimiento

// ============================================================================
// FUNCIÓN: getCertificacionesByAprendiz
// DESCRIPCIÓN: Certificaciones específicas de aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA: Historial certificaciones con estados

// ============================================================================
// FUNCIÓN: getCertificacionesByFicha
// DESCRIPCIÓN: Certificaciones por ficha específica
// PARÁMETROS: fichaId, estado
// USO: Reportes auditoria por ficha

// ============================================================================
// FUNCIÓN: markEvaluacionSofiaCompleted
// DESCRIPCIÓN: Marcar evaluación Sofía como completada
// PARÁMETROS: certificacionId, pantallazoUrl
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validatePantallazoRequired() - Pantallazo obligatorio
// - validateImageFormat() - Formato imagen válido
// FUNCIONES INTERNAS:
// - savePantallazoToOneDrive() - Guardar pantallazo
// - updateEvaluacionStatus() - Marcar evaluación completada

// ============================================================================
// FUNCIÓN: validateCertificationPrerequisites
// DESCRIPCIÓN: Validar prerequisitos certificación
// PARÁMETROS: etapaProductivaId
// RESPUESTA: { canCertify: boolean, missingItems: [], details: {} }
// VERIFICA:
// - Bitácoras completadas (12/12)
// - Seguimientos completados (3/3)  
// - Horas EP completadas
// - Documentos empresa
// - Evaluación Sofía
// - Ficha no vencida

// ============================================================================
// FUNCIÓN: generateCertificationReport
// DESCRIPCIÓN: Generar reporte certificación
// PARÁMETROS: certificacionId
// INCLUYE:
// - Resumen ejecutivo certificación
// - Detalles etapa productiva
// - Documentos adjuntos
// - Timeline proceso certificación

// ============================================================================
// FUNCIÓN: bulkCreateCertifications
// DESCRIPCIÓN: Crear certificaciones masivas
// PARÁMETROS: etapaProductivaIds[]
// USO: Proceso mensual certificaciones
// VALIDACIONES:
// - validateAllEPsCompleted() - Todas EP completadas
// - validateNoDuplicates() - No duplicar certificaciones

// ============================================================================
// FUNCIÓN: getCertificationStatistics
// DESCRIPCIÓN: Estadísticas certificaciones
// PARÁMETROS: periodo, programa, ficha
// RESPUESTA:
// - Total certificaciones por estado
// - Tasa certificación por programa
// - Tiempo promedio proceso
// - Motivos rechazo frecuentes

// ============================================================================
// FUNCIÓN: checkExpiredFichas
// DESCRIPCIÓN: Verificar fichas próximas vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas fichas próximas vencer para certificación urgente

// ============================================================================
// FUNCIÓN: extendFichaForCertification
// DESCRIPCIÓN: Extender ficha para permitir certificación
// PARÁMETROS: fichaId, nuevaFechaVencimiento, motivo
// VALIDACIONES:
// - validateFichaExists() - Ficha existe
// - validateCanExtend() - Puede extenderse
// - validateJustification() - Justificación válida
// - validateAdminAuthorized() - Solo admin puede extender

// ============================================================================
// FUNCIÓN: generateFinalCertificate
// DESCRIPCIÓN: Generar certificado final PDF
// PARÁMETROS: certificacionId
// INCLUYE:
// - Template certificación SENA
// - Datos aprendiz y programa
// - Códigos verificación
// - Firmas digitales
// FUNCIONES INTERNAS:
// - loadCertificateTemplate() - Cargar plantilla
// - populateAprendizData() - Llenar datos aprendiz
// - generateVerificationCode() - Generar código verificación
// - addDigitalSignatures() - Agregar firmas digitales