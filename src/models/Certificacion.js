// CAMPOS PRINCIPALES:
// - etapaProductivaId: ObjectId, ref: 'EtapaProductiva', required
// - aprendizId: ObjectId, ref: 'Aprendiz', required
// - fichaId: ObjectId, ref: 'Ficha', required
// - fechaCertificacion: Date
// - fechaSolicitud: Date, default: Date.now
// - documentoCertificacion: String // URL OneDrive
// - documentoJuicio: String // URL OneDrive  
// - estado: String, enum: ['Por Certificar', 'Certificado', 'Rechazado'], default: 'Por Certificar'
// - observaciones: String, maxlength: 1000
// - evaluacionSofia: Boolean, default: false // Si evaluó en Sofía Plus
// - pantallazoEvaluacion: String // URL pantallazo evaluación
// - usuarioCertificacion: ObjectId, ref: 'User'
// - motivoRechazo: String, maxlength: 500

// CAMPOS DETECTADOS MOCKUPS:
// - nombreAprendiz: String // Display field
// - nombreFicha: String // Display field
// - codigoFicha: String // Display field

// MÉTODOS REQUERIDOS:
// - validateDocuments() // Validar documentos completos
// - markAsCertified(usuarioId) // Marcar como certificado
// - generateCertificate() // Generar certificado final
// - rejectCertification(motivo, usuarioId) // Rechazar certificación
// - uploadDocumentoCertificacion(fileUrl) // Subir documento
// - uploadDocumentoJuicio(fileUrl) // Subir documento juicio
// - uploadPantallazoEvaluacion(fileUrl) // Subir pantallazo
// - validateEvaluacionSofia() // Validar evaluación Sofía
// - checkPrerequisites() // Verificar prerequisitos
// - generateNotificationData() // Data notificaciones
// - calculateTiempoCertificacion() // Tiempo total certificación

// VALIDACIONES ESPECÍFICAS:
// - validateEtapaProductivaCompleta() // EP completada
// - validateAprendizElegible() // Aprendiz elegible certificación
// - validateFichaNoVencida() // Ficha no vencida
// - validateDocumentosCompletos() // Todos documentos requeridos
// - validateEvaluacionSofiaRequired() // Evaluación Sofía requerida
// - validatePantallazoBitacoras() // Pantallazo bitácoras completas
// - validatePantallazoSeguimientos() // Pantallazo seguimientos completos
// - validateFechaCertificacionValida() // Fecha certificación válida
// - validateEstadoTransition() // Transiciones estado válidas
// - validateUsuarioAutorizado() // Usuario autorizado certificar