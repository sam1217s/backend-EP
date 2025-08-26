// ============================================================================
// RUTA: GET /api/certificaciones
// DESCRIPCIÓN: Listar certificaciones con filtros
// CONTROLLER: certificacionController.getAllCertificaciones
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - search (por aprendiz documento/nombre)
//   - estado (Por Certificar/Certificado/Rechazado)
//   - ficha (filtrar por ficha específica)
//   - programa (filtrar por programa)
//   - fechaSolicitudDesde, fechaSolicitudHasta (rango fechas solicitud)
//   - fechaCertificacionDesde, fechaCertificacionHasta (rango fechas certificación)
// VALIDACIONES QUERY:
//   - query('estado').optional().isIn(['Por Certificar', 'Certificado', 'Rechazado'])
//   - query('fechaSolicitudDesde').optional().isISO8601().toDate()
// PERMISOS: Solo Administrador y Coordinador pueden ver certificaciones

// ============================================================================
// RUTA: GET /api/certificaciones/:id
// DESCRIPCIÓN: Obtener certificación específica con detalles
// CONTROLLER: certificacionController.getCertificacionById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeCertificacionAccess
//   - validation.validateMongoId('id')
// RESPONSE: Datos certificación, aprendiz, ficha, EP, documentos adjuntos, evaluación Sofía

// ============================================================================
// RUTA: POST /api/certificaciones
// DESCRIPCIÓN: Crear solicitud certificación
// CONTROLLER: certificacionController.createCertificacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateCertificacionCreation
// VALIDACIONES BODY:
//   - body('etapaProductivaId').isMongoId()
//   - body('aprendizId').isMongoId()
//   - body('fichaId').isMongoId()
// PREREQUISITOS AUTOMÁTICOS VALIDADOS:
//   - Todas bitácoras entregadas y verificadas (12/12)
//   - Todos seguimientos completados (3/3)  
//   - Horas EP completadas (864 mínimo)
//   - Evaluación Sofía Plus realizada
//   - Documentos empresa completos
//   - Ficha no vencida
// VALIDACIONES CRÍTICAS:
//   - validateEtapaProductivaCompleted() - EP completada
//   - validateAllBitacorasCompleted() - 12/12 bitácoras verificadas
//   - validateAllSeguimientosCompleted() - 3/3 seguimientos OK
//   - validateHorasCompleted() - Horas requeridas completadas
//   - validateFichaNotExpired() - Ficha no vencida
//   - validateEvaluacionSofiaCompleted() - Evaluación Sofía realizada
//   - validateNoPreviousCertification() - No certificado previamente
// PROCESO AUTOMÁTICO:
//   1. Validar prerequisitos completos
//   2. Generar código certificación único
//   3. Crear registro certificación
//   4. Notificar coordinador y aprendiz
//   5. Actualizar estado aprendiz

// ============================================================================
// RUTA: PUT /api/certificaciones/:id
// DESCRIPCIÓN: Actualizar certificación existente
// CONTROLLER: certificacionController.updateCertificacion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateCertificacionUpdate
// CAMPOS ACTUALIZABLES:
//   - observaciones
//   - evaluacionSofia (marcar como completada)
// RESTRICTIONS: No actualizar si ya certificada

// ============================================================================
// RUTA: POST /api/certificaciones/:id/upload-document
// DESCRIPCIÓN: Subir documentos certificación
// CONTROLLER: certificacionController.uploadCertificationDocument
// MIDDLEWARES:
//   - auth.authenticateToken
//   - upload.single('certificationFile')
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateCertificationFileUpload
// QUERY PARAMETERS:
//   - tipoDocumento (requerido): certificacion/juicio/pantallazo
// VALIDACIONES FILE POR TIPO:
//   - "certificacion": PDF obligatorio, máx 10MB
//   - "juicio": PDF obligatorio, máx 10MB  
//   - "pantallazo": JPG/PNG, máx 5MB
// VALIDACIONES NEGOCIO:
//   - Certificación existe
//   - Tipo documento válido
//   - No existe documento del tipo
//   - Usuario autorizado subir
// PROCESO:
//   1. Validar archivo y tipo
//   2. Subir a OneDrive organizado por tipo
//   3. Vincular a certificación
//   4. Verificar completitud documentos
//   5. Notificar si todos completos

// ============================================================================
// RUTA: PUT /api/certificaciones/:id/aprobar
// DESCRIPCIÓN: Aprobar certificación final
// CONTROLLER: certificacionController.approveCertification
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validateCertificationApproval
// VALIDACIONES BODY:
//   - body('observaciones').optional().isLength({max: 1000})
// VALIDACIONES FINALES CRÍTICAS:
//   - validateAllDocumentsUploaded() - Todos documentos subidos
//   - validateCoordinadorAuthorized() - Coordinador autorizado
//   - validateEvaluacionSofiaCompleted() - Evaluación Sofía OK
//   - validateFichaStillValid() - Ficha aún válida
//   - validateNotAlreadyApproved() - No aprobada previamente
// PROCESO APROBACIÓN:
//   1. Validaciones finales completas
//   2. Cambiar estado a "Certificado"
//   3. Generar certificado final PDF
//   4. Actualizar estado aprendiz a "Certificado"
//   5. Notificar éxito a todos involucrados
//   6. Actualizar estadísticas centro
//   7. Archivar documentación completa

// ============================================================================
// RUTA: PUT /api/certificaciones/:id/rechazar
// DESCRIPCIÓN: Rechazar certificación
// CONTROLLER: certificacionController.rejectCertification
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES BODY:
//   - body('motivoRechazo').notEmpty().isLength({min: 10, max: 500})
// VALIDACIONES NEGOCIO:
//   - No certificada aún
//   - Coordinador autorizado
//   - Motivo obligatorio
// PROCESO:
//   1. Cambiar estado a "Rechazado"
//   2. Registrar motivo rechazo
//   3. Notificar instructor y aprendiz
//   4. Crear tareas seguimiento correctivo

// ============================================================================
// RUTA: GET /api/certificaciones/aprendiz/:aprendizId
// DESCRIPCIÓN: Certificaciones de aprendiz específico
// CONTROLLER: certificacionController.getCertificacionesByAprendiz
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeAprendizAccess
// RESPONSE: Historial certificaciones con estados

// ============================================================================
// RUTA: GET /api/certificaciones/ficha/:fichaId
// DESCRIPCIÓN: Certificaciones por ficha
// CONTROLLER: certificacionController.getCertificacionesByFicha
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - estado (opcional: filtrar por estado)
// USO: Reportes auditoría por ficha

// ============================================================================
// RUTA: PUT /api/certificaciones/:id/evaluacion-sofia
// DESCRIPCIÓN: Marcar evaluación Sofía como completada
// CONTROLLER: certificacionController.markEvaluacionSofiaCompleted
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - upload.single('pantallazoFile') // Pantallazo obligatorio
// VALIDACIONES FILE:
//   - Formato: JPG, PNG
//   - Tamaño máximo: 5MB
//   - Pantallazo legible evaluación Sofía
// PROCESO:
//   1. Subir pantallazo a OneDrive
//   2. Marcar evaluación completada
//   3. Verificar prerequisitos certificación
//   4. Notificar progreso

// ============================================================================
// RUTA: GET /api/certificaciones/:etapaProductivaId/validar-prerequisitos
// DESCRIPCIÓN: Validar prerequisitos certificación EP
// CONTROLLER: certificacionController.validateCertificationPrerequisites
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador', 'Instructor'])
// RESPONSE:
// {
//   "canCertify": false,
//   "missingItems": [
//     "Faltan 2 bitácoras por validar",
//     "Evaluación Sofía Plus pendiente"
//   ],
//   "details": {
//     "bitacoras": { "completadas": 10, "total": 12 },
//     "seguimientos": { "completados": 3, "total": 3 },
//     "horas": { "ejecutadas": 864, "requeridas": 864 },
//     "evaluacionSofia": false,
//     "fichaVencimiento": "2024-12-31"
//   }
// }

// ============================================================================
// RUTA: GET /api/certificaciones/:id/reporte
// DESCRIPCIÓN: Generar reporte certificación
// CONTROLLER: certificacionController.generateCertificationReport
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - formato (pdf/excel)
// INCLUYE:
//   - Resumen ejecutivo certificación
//   - Detalles etapa productiva completos
//   - Enlaces documentos adjuntos
//   - Timeline proceso certificación
//   - Validaciones y verificaciones

// ============================================================================
// RUTA: POST /api/certificaciones/bulk-create
// DESCRIPCIÓN: Crear certificaciones masivas
// CONTROLLER: certificacionController.bulkCreateCertifications
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('etapaProductivaIds').isArray({min: 1, max: 50})
// VALIDACIONES MASIVAS:
//   - Todas EP completadas
//   - No duplicar certificaciones
//   - Prerequisitos cumplidos cada EP
// USO: Proceso mensual certificaciones lote

// ============================================================================
// RUTA: GET /api/certificaciones/estadisticas
// DESCRIPCIÓN: Estadísticas certificaciones
// CONTROLLER: certificacionController.getCertificationStatistics
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - periodo (mes/trimestre/año)
//   - programa (opcional)
//   - ficha (opcional)
// RESPONSE:
// {
//   "totalCertificaciones": 45,
//   "porEstado": { "Por Certificar": 15, "Certificado": 25, "Rechazado": 5 },
//   "tasaCertificacionPorPrograma": {...},
//   "tiempoPromedioproceso": "12.5 días",
//   "motivosRechazoFrecuentes": [...]
// }

// ============================================================================
// RUTA: GET /api/certificaciones/fichas-vencimiento
// DESCRIPCIÓN: Fichas próximas vencer para certificación urgente
// CONTROLLER: certificacionController.checkExpiredFichas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// QUERY PARAMETERS:
//   - diasAnticipacion (default: 30)
// USO: Alertas fichas próximas vencer

// ============================================================================
// RUTA: PUT /api/certificaciones/ficha/:fichaId/extender-vencimiento
// DESCRIPCIÓN: Extender vencimiento ficha para certificación
// CONTROLLER: certificacionController.extendFichaForCertification
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES BODY:
//   - body('nuevaFechaVencimiento').isISO8601().toDate()
//   - body('motivo').notEmpty().isLength({min: 20, max: 500})
// RESTRICTIONS: Solo administrador, justificación obligatoria

// ============================================================================
// RUTA: GET /api/certificaciones/:id/generar-certificado
// DESCRIPCIÓN: Generar certificado final PDF
// CONTROLLER: certificacionController.generateFinalCertificate
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// VALIDACIONES:
//   - Certificación aprobada
//   - Todos documentos completos
// PROCESO:
//   1. Cargar plantilla certificación SENA
//   2. Llenar datos aprendiz y programa
//   3. Generar códigos verificación únicos
//   4. Agregar firmas digitales
//   5. Generar PDF final
//   6. Almacenar y enviar enlace descarga
// RESPONSE: URL descarga certificado PDF

// ============================================================================
// RUTA: GET /api/certificaciones/:id/download-certificate
// DESCRIPCIÓN: Descargar certificado final generado
// CONTROLLER: certificacionController.downloadFinalCertificate
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeCertificateDownload
// VALIDATIONS:
//   - Certificado existe y generado
//   - Usuario autorizado descargar
// PERMISOS:
//   - Aprendiz: Solo su propio certificado
//   - Instructor: Certificados aprendices asignados
//   - Admin/Coordinador: Todos los certificados
// RESPONSE: Stream PDF certificado