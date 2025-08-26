// ============================================================================
// FUNCIÓN: uploadBitacoraFile
// DESCRIPCIÓN: Subir archivo bitácora firmada
// PARÁMETROS: file, bitacoraId, uploaderUserId
// VALIDACIONES ARCHIVO:
// - validateFileExists() - Archivo presente en request
// - validateFileFormat() - Solo PDF, DOC, DOCX permitidos
// - validateFileSize() - Máximo 10MB por archivo
// - validateFileName() - Nombre archivo válido (sin caracteres especiales)
// - validateVirusCheck() - Escaneo antivirus si habilitado
// VALIDACIONES NEGOCIO:
// - validateBitacoraExists() - Bitácora existe y activa
// - validateUserCanUpload() - Usuario autorizado subir
// - validateBitacoraNotVerified() - Bitácora no verificada aún
// - validateMaxUploadsPerBitacora() - Máximo 1 archivo por bitácora
// PROCESO UPLOAD:
// 1. Validar archivo y permisos
// 2. Generar nombre único archivo
// 3. Subir a OneDrive/almacenamiento
// 4. Actualizar registro bitácora
// 5. Notificar instructor asignado
// FUNCIONES INTERNAS:
// - generateUniqueFileName() - Generar nombre único
// - uploadToOneDrive() - Subir a OneDrive
// - updateBitacoraRecord() - Actualizar registro
// - createUploadLog() - Log actividad upload

// ============================================================================
// FUNCIÓN: uploadSeguimientoFile
// DESCRIPCIÓN: Subir documento seguimiento
// PARÁMETROS: file, seguimientoId, uploaderUserId
// VALIDACIONES SIMILARES A BITÁCORA:
// - Formatos: PDF, DOC, DOCX
// - Tamaño máximo: 10MB
// - Usuario autorizado
// - Seguimiento existe y no verificado
// PROCESO ESPECÍFICO:
// - Vincular archivo a seguimiento
// - Actualizar estado seguimiento
// - Notificar coordinador para verificación

// ============================================================================
// FUNCIÓN: uploadCertificationDocument
// DESCRIPCIÓN: Subir documentos certificación
// PARÁMETROS: file, certificacionId, tipoDocumento, uploaderUserId
// TIPOS DOCUMENTO:
// - "certificacion": Documento certificación final
// - "juicio": Documento juicio evaluativo  
// - "pantallazo": Pantallazo evaluación Sofía Plus
// VALIDACIONES ESPECÍFICAS:
// - validateCertificacionExists() - Certificación existe
// - validateTipoDocumentoValid() - Tipo documento válido
// - validateDocumentNotExists() - No existe documento tipo
// - validateFormatByType() - Formato según tipo (PDF obligatorio certificación)
// FUNCIONES INTERNAS:
// - categorizeDocumentByType() - Categorizar por tipo
// - checkAllDocumentsUploaded() - Verificar completitud documentos

// ============================================================================
// FUNCIÓN: uploadEmpresaDocuments
// DESCRIPCIÓN: Subir documentos empresa (alternativos)
// PARÁMETROS: files[], etapaProductivaId, uploaderUserId
// DOCUMENTOS EMPRESA:
// - Documentos legales empresa
// - Convenios específicos
// - Certificaciones empresa
// - Documentos alternativos modalidad
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateMultipleFiles() - Múltiples archivos válidos
// - validateTotalSize() - Tamaño total no exceder límite
// PROCESO:
// - Subir múltiples archivos
// - Organizar en carpeta por EP
// - Vincular a etapa productiva

// ============================================================================
// FUNCIÓN: uploadProfileImage
// DESCRIPCIÓN: Subir imagen perfil usuario
// PARÁMETROS: file, usuarioId, tipoUsuario
// VALIDACIONES IMAGEN:
// - validateImageFormat() - Solo JPG, PNG, GIF
// - validateImageSize() - Máximo 2MB
// - validateImageDimensions() - Dimensiones apropiadas
// - validateUserOwnership() - Usuario puede cambiar imagen
// PROCESO:
// - Redimensionar imagen si necesario
// - Generar thumbnails
// - Actualizar perfil usuario
// - Eliminar imagen anterior si existe

// ============================================================================
// FUNCIÓN: bulkUploadAprendices
// DESCRIPCIÓN: Carga masiva aprendices desde Excel/CSV
// PARÁMETROS: file, fichaId, usuarioId
// VALIDACIONES ARCHIVO:
// - validateExcelOrCSVFormat() - Formato Excel o CSV
// - validateFileSize() - Tamaño máximo 50MB
// - validateHeaders() - Headers requeridos presentes
// - validateDataIntegrity() - Integridad datos
// PROCESO VALIDACIÓN MASIVA:
// 1. Parsear archivo (Excel/CSV)
// 2. Validar estructura y headers
// 3. Validar cada registro individualmente
// 4. Identificar duplicados y errores
// 5. Generar reporte pre-carga
// 6. Permitir correcciones antes inserción
// FUNCIONES INTERNAS:
// - parseExcelFile() - Parsear Excel con SheetJS
// - parseCSVFile() - Parsear CSV con PapaParse
// - validateAprendizRecord() - Validar registro individual
// - generateValidationReport() - Reporte errores encontrados
// - insertValidRecords() - Insertar solo registros válidos

// ============================================================================
// FUNCIÓN: downloadFile
// DESCRIPCIÓN: Descargar archivo específico
// PARÁMETROS: fileId, tipoArchivo, usuarioId
// VALIDACIONES ACCESO:
// - validateFileExists() - Archivo existe
// - validateUserCanDownload() - Usuario puede descargar
// - validateFileNotExpired() - Archivo no expirado
// TIPOS ARCHIVO:
// - bitacora, seguimiento, certificacion
// - empresa, perfil, masivo
// FUNCIONES INTERNAS:
// - getFileFromStorage() - Obtener archivo almacenamiento
// - logDownloadActivity() - Log actividad descarga
// - updateDownloadCount() - Actualizar contador descargas

// ============================================================================
// FUNCIÓN: deleteFile
// DESCRIPCIÓN: Eliminar archivo específico
// PARÁMETROS: fileId, tipoArchivo, usuarioId, motivo
// VALIDACIONES:
// - validateFileExists() - Archivo existe
// - validateUserCanDelete() - Usuario puede eliminar
// - validateFileNotInUse() - Archivo no en uso
// - validateMotivoRequired() - Motivo eliminación
// PROCESO:
// - Marcar archivo como eliminado (soft delete)
// - Mover a carpeta papelera
// - Actualizar registros relacionados
// - Log actividad eliminación

// ============================================================================
// FUNCIÓN: getFileInfo
// DESCRIPCIÓN: Obtener información archivo
// PARÁMETROS: fileId, tipoArchivo
// RESPUESTA:
// - Metadata archivo (nombre, tamaño, tipo)
// - Fecha upload y usuario
// - URL descarga si autorizado
// - Estado archivo (activo/eliminado)
// - Información vinculación (bitácora, seguimiento, etc.)

// ============================================================================
// FUNCIÓN: listFilesByEntity
// DESCRIPCIÓN: Listar archivos por entidad
// PARÁMETROS: entityType, entityId, usuarioId
// ENTIDADES:
// - bitacora: Archivos bitácora específica
// - seguimiento: Archivos seguimiento específico
// - certificacion: Documentos certificación
// - etapaProductiva: Todos archivos EP
// - aprendiz: Archivos personales aprendiz
// RESPUESTA: Lista archivos con metadata

// ============================================================================
// FUNCIÓN: validateFileUpload
// DESCRIPCIÓN: Validación centralizada uploads
// PARÁMETROS: file, tipoArchivo, configuracion
// VALIDACIONES GENERALES:
// - Archivo presente y válido
// - Formato permitido para tipo
// - Tamaño dentro límites
// - Nombre archivo válido
// - Usuario autorizado
// CONFIGURACIÓN POR TIPO:
// - Formatos permitidos
// - Tamaño máximo
// - Validaciones adicionales
// RESPUESTA: { isValid: boolean, errors: [], warnings: [] }

// ============================================================================
// FUNCIÓN: generateUploadUrl
// DESCRIPCIÓN: Generar URL pre-firmada para upload directo
// PARÁMETROS: tipoArchivo, configuracion, usuarioId
// USO: Upload directo a OneDrive desde frontend
// PROCESO:
// 1. Validar permisos usuario
// 2. Generar URL pre-firmada
// 3. Configurar restricciones upload
// 4. Establecer expiración URL
// 5. Log URL generada
// RESPUESTA: URL pre-firmada con restricciones

// ============================================================================
// FUNCIÓN: processUploadCallback
// DESCRIPCIÓN: Procesar callback post-upload
// PARÁMETROS: uploadId, fileInfo, status
// USO: Procesar respuesta OneDrive después upload
// PROCESO:
// - Validar upload exitoso
// - Actualizar registros sistema
// - Ejecutar post-procesamiento
// - Notificar usuarios relevantes
// - Activar workflows posteriores

// ============================================================================
// FUNCIÓN: cleanupExpiredFiles
// DESCRIPCIÓN: Limpiar archivos expirados o temporales
// PARÁMETROS: diasExpiracion, dryRun
// PROCESO:
// - Identificar archivos expirados
// - Validar archivos no en uso
// - Mover a papelera o eliminar permanentemente
// - Actualizar registros sistema
// - Generar reporte limpieza
// USO: Tarea programada mantenimiento

// ============================================================================
// FUNCIÓN: getStorageStatistics
// DESCRIPCIÓN: Estadísticas uso almacenamiento
// RESPUESTA:
// - Espacio total usado
// - Distribución por tipo archivo
// - Archivos por período
// - Tendencias crecimiento
// - Usuarios más activos
// - Recomendaciones limpieza

// ============================================================================
// FUNCIÓN: validateFileIntegrity
// DESCRIPCIÓN: Validar integridad archivos almacenados
// PARÁMETROS: fileIds[], checkContent
// PROCESO:
// - Verificar existencia física archivos
// - Validar checksums si disponible
// - Verificar accesibilidad
// - Identificar archivos corruptos
// - Generar reporte integridad

// ============================================================================
// FUNCIÓN: migrateFilesToNewStorage
// DESCRIPCIÓN: Migrar archivos a nuevo sistema almacenamiento
// PARÁMETROS: sourceStorage, targetStorage, options
// PROCESO:
// - Inventariar archivos origen
// - Validar espacio destino
// - Migrar por lotes
// - Validar integridad post-migración
// - Actualizar referencias sistema
// - Generar reporte migración

// ============================================================================
// FUNCIÓN: createFileBackup
// DESCRIPCIÓN: Crear backup archivos críticos
// PARÁMETROS: backupConfig, destinoBackup
// PROCESO:
// - Identificar archivos críticos
// - Crear backup incremental/completo
// - Validar backup creado
// - Actualizar registro backups
// - Notificar resultado operación