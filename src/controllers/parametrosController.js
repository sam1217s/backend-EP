// ============================================================================
// FUNCIÓN: getAllParametros
// DESCRIPCIÓN: Listar parámetros sistema con filtros
// PARÁMETROS: page, limit, categoria, subcategoria, grupoPermisos, esEditable
// FILTROS:
// - Por categoría (MODALIDADES, HORAS_INSTRUCTOR, ESTADOS_SISTEMA, etc.)
// - Por subcategoría específica
// - Por grupo permisos (ADMIN_ONLY, COORDINADOR, PUBLICO)
// - Solo parámetros editables
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateUserPermissions() - Permisos usuario por grupo

// ============================================================================
// FUNCIÓN: getParametroById
// DESCRIPCIÓN: Obtener parámetro específico
// PARÁMETROS: parametroId
// INCLUYE:
// - Configuración completa parámetro
// - Reglas validación
// - Historial cambios recientes
// - Usuario última modificación
// VALIDACIONES:
// - validateParametroExists() - Parámetro existe
// - validateUserCanView() - Usuario puede ver parámetro

// ============================================================================
// FUNCIÓN: getParametroByKey
// DESCRIPCIÓN: Obtener parámetro por clave específica
// PARÁMETROS: categoria, clave
// USO: Acceso directo configuración sistema
// CACHE: Valores frecuentemente accedidos en memoria
// VALIDACIONES:
// - validateCategoriaExists() - Categoría existe
// - validateClaveExists() - Clave existe en categoría

// ============================================================================
// FUNCIÓN: createParametro
// DESCRIPCIÓN: Crear nuevo parámetro sistema
// PARÁMETROS: parametroData
// CAMPOS OBLIGATORIOS:
// - categoria, clave, valor, tipo, descripcion
// - grupoPermisos, usuarioCreacion
// VALIDACIONES CRÍTICAS:
// - validateClaveUnique() - Clave única en categoría
// - validateTipoValorConsistente() - Tipo y valor consistentes
// - validateValidacionRules() - Reglas validación bien formadas
// - validateGrupoPermisosExists() - Grupo permisos válido
// - validateUserCanCreate() - Usuario puede crear parámetros
// FUNCIONES INTERNAS:
// - validateParametroValue() - Validar valor según tipo
// - createAuditLog() - Crear log auditoría
// - invalidateCache() - Invalidar cache parámetros

// ============================================================================
// FUNCIÓN: updateParametro
// DESCRIPCIÓN: Actualizar parámetro existente
// PARÁMETROS: parametroId, updateData, usuarioId
// CAMPOS ACTUALIZABLES:
// - valor (principal)
// - descripcion
// - validacion (reglas)
// - activo
// VALIDACIONES:
// - validateParametroExists() - Parámetro existe
// - validateParametroEditable() - Parámetro es editable
// - validateUserPermissions() - Usuario tiene permisos
// - validateNewValue() - Nuevo valor válido según tipo
// - validateDependenciasParametros() - No romper dependencias
// REGLAS ESPECIALES MODALIDADES:
// - Actualizar horas instructor requiere validación áreas
// - Cambios estados sistema requieren migración datos
// - Modificar alertas requiere reprogramación tareas
// FUNCIONES INTERNAS:
// - backupOldValue() - Respaldar valor anterior
// - validateSystemImpact() - Validar impacto sistema
// - updateRelatedParameters() - Actualizar parámetros relacionados
// - propagateChanges() - Propagar cambios dependientes
// - invalidateRelatedCache() - Invalidar cache relacionado

// ============================================================================
// FUNCIÓN: deleteParametro
// DESCRIPCIÓN: Eliminar parámetro (solo si esEditable y sin dependencias)
// PARÁMETROS: parametroId, usuarioId
// VALIDACIONES:
// - validateParametroExists() - Parámetro existe
// - validateParametroEditable() - Es editable
// - validateNoDependencies() - Sin dependencias activas
// - validateUserCanDelete() - Usuario puede eliminar
// FUNCIONES INTERNAS:
// - checkDependencies() - Verificar dependencias
// - createBackup() - Crear backup antes eliminar

// ============================================================================
// FUNCIÓN: getParametrosByCategoria
// DESCRIPCIÓN: Obtener todos parámetros de categoría
// PARÁMETROS: categoria, includeInactive
// CATEGORÍAS PRINCIPALES:
// - MODALIDADES: Configuración modalidades EP
// - HORAS_INSTRUCTOR: Distribución horas por tipo
// - ESTADOS_SISTEMA: Estados válidos entidades
// - ALERTAS_TIEMPO: Configuración alertas y vencimientos
// - REGLAS_NEGOCIO: Reglas específicas sistema
// - NOTIFICACIONES: Configuración emails
// - INTEGRACIONES: APIs externas (SGBA, Sofía)
// USO: Configuración masiva categorías

// ============================================================================
// FUNCIÓN: updateModalidadConfiguration
// DESCRIPCIÓN: Actualizar configuración modalidad específica
// PARÁMETROS: modalidad, configuracionNueva, usuarioId
// CONFIGURACIÓN MODALIDAD:
// - horasInstructorSeguimiento
// - horasInstructorTecnico
// - horasInstructorProyecto
// - subdivisiones permitidas
// - documentos requeridos
// VALIDACIONES:
// - validateModalidadExists() - Modalidad existe
// - validateHorasConfiguration() - Configuración horas coherente
// - validateSubdivisionesValid() - Subdivisiones válidas
// - validateNoActiveEPs() - Sin EP activas con modalidad (para cambios críticos)
// FUNCIONES INTERNAS:
// - updateModalidadParametros() - Actualizar parámetros relacionados
// - recalculateInstructorProjections() - Recalcular proyecciones
// - notifyAffectedInstructors() - Notificar instructores afectados

// ============================================================================
// FUNCIÓN: addNuevaModalidad
// DESCRIPCIÓN: Agregar nueva modalidad al sistema
// PARÁMETROS: modalidadData, usuarioId
// PROCESO COMPLETO:
// 1. Crear parámetros modalidad
// 2. Configurar horas instructor
// 3. Definir documentos requeridos
// 4. Establecer subdivisiones
// 5. Activar en sistema
// VALIDACIONES:
// - validateModalidadDataComplete() - Datos completos
// - validateNombreModalidadUnique() - Nombre único
// - validateHorasConfigurationValid() - Configuración horas válida

// ============================================================================
// FUNCIÓN: getHorasInstructorPorModalidad
// DESCRIPCIÓN: Obtener configuración horas por modalidad
// PARÁMETROS: modalidad, tipoInstructor
// RESPUESTA: Horas configuradas para tipo instructor en modalidad
// CACHE: Valores en memoria para acceso rápido

// ============================================================================
// FUNCIÓN: updateAlertasConfiguration
// DESCRIPCIÓN: Actualizar configuración alertas sistema
// PARÁMETROS: alertasConfig, usuarioId
// ALERTAS CONFIGURABLES:
// - DIAS_ALERTA_VENCIMIENTO_FICHA: 30 días
// - DIAS_ALERTA_SEGUIMIENTO: 7 días
// - DIAS_VENCIMIENTO_BITACORA: 15 días
// - FRECUENCIA_EMAILS: Diaria/Semanal
// VALIDACIONES:
// - validateAlertConfigValid() - Configuración válida
// - validateDiasPositivos() - Días positivos
// FUNCIONES INTERNAS:
// - rescheduleAlerts() - Reprogramar alertas activas
// - updateCronJobs() - Actualizar trabajos programados

// ============================================================================
// FUNCIÓN: getIntegracionConfiguration
// DESCRIPCIÓN: Obtener configuración integración externa
// PARÁMETROS: sistemaIntegracion
// SISTEMAS: ONEDRIVE
// RESPUESTA: URLs, keys, configuración conexión
// SEGURIDAD: Keys encriptadas, acceso solo admin

// ============================================================================
// FUNCIÓN: updateIntegracionConfiguration
// DESCRIPCIÓN: Actualizar configuración integración
// PARÁMETROS: sistemaIntegracion, nuevaConfig, usuarioId
// VALIDACIONES:
// - validateIntegracionExists() - Integración existe
// - validateConfigurationFormat() - Formato configuración válido
// - validateConnectivity() - Probar conectividad si aplica
// FUNCIONES INTERNAS:
// - encryptApiKeys() - Encriptar claves API
// - testConnection() - Probar conexión

// ============================================================================
// FUNCIÓN: getReglasNegocioActivas
// DESCRIPCIÓN: Obtener reglas negocio activas
// RESPUESTA: Reglas aplicables sistema
// REGLAS PRINCIPALES:
// - MAX_ETAPAS_PRODUCTIVAS_APRENDIZ: 3
// - MAX_BITACORAS_EP: 12
// - MAX_SEGUIMIENTOS_EP: 3
// - MIN_HORAS_EP_PASANTIA: 864
// - DIAS_CERTIFICACION_PROCESO: 30

// ============================================================================
// FUNCIÓN: validateReglaNegeocio
// DESCRIPCIÓN: Validar regla negocio específica
// PARÁMETROS: regla, valor, contexto
// USO: Validaciones dinámicas sistema
// RESPUESTA: { isValid: boolean, message: string }

// ============================================================================
// FUNCIÓN: exportarConfiguracion
// DESCRIPCIÓN: Exportar configuración completa sistema
// PARÁMETROS: categorias[], formato, usuarioId
// FORMATOS: JSON, Excel
// INCLUYE:
// - Todos parámetros por categoría
// - Valores actuales
// - Descripciones y validaciones
// - Metadata configuración
// VALIDACIONES:
// - validateUserCanExport() - Usuario puede exportar
// - validateCategoriasAccess() - Acceso a categorías

// ============================================================================
// FUNCIÓN: importarConfiguracion
// DESCRIPCIÓN: Importar configuración sistema
// PARÁMETROS: configFile, overwriteExisting, usuarioId
// PROCESO:
// 1. Validar formato archivo
// 2. Verificar integridad datos
// 3. Validar dependencias
// 4. Aplicar cambios con backup
// 5. Invalidar cache
// VALIDACIONES:
// - validateImportFile() - Archivo válido
// - validateDataIntegrity() - Integridad datos
// - validateNoDuplicateKeys() - Sin claves duplicadas
// FUNCIONES INTERNAS:
// - createFullBackup() - Backup completo antes importar
// - validateAllParameters() - Validar todos parámetros
// - rollbackOnError() - Rollback si error

// ============================================================================
// FUNCIÓN: resetearConfiguracionDefecto
// DESCRIPCIÓN: Resetear parámetros a valores por defecto
// PARÁMETROS: categoria, confirmacion, usuarioId
// PROCESO:
// 1. Backup configuración actual
// 2. Cargar valores por defecto
// 3. Aplicar cambios
// 4. Invalidar cache
// 5. Notificar usuarios afectados
// VALIDACIONES:
// - validateResetAuthorized() - Usuario autorizado resetear
// - validateConfirmationCode() - Código confirmación válido

// ============================================================================
// FUNCIÓN: getHistorialCambios
// DESCRIPCIÓN: Historial cambios parámetro específico
// PARÁMETROS: categoria, clave, fechaInicio, fechaFin
// INCLUYE:
// - Valores anteriores y nuevos
// - Usuario que realizó cambio
// - Fecha/hora cambio
// - Motivo cambio si aplica
// USO: Auditoría y troubleshooting

// ============================================================================
// FUNCIÓN: validateParametroValue
// DESCRIPCIÓN: Validar valor parámetro según tipo y reglas
// PARÁMETROS: tipo, valor, validacionRules
// TIPOS SOPORTADOS:
// - String: longitud, patrones
// - Number: rangos, decimales
// - Boolean: true/false
// - Object: estructura, propiedades requeridas
// - Array: elementos, tipos elementos

// ============================================================================
// FUNCIÓN: getParametrosEditables
// DESCRIPCIÓN: Obtener solo parámetros editables desde UI
// PARÁMETROS: usuarioId, grupoPermisos
// FILTROS: Por permisos usuario y grupo
// USO: Interfaces configuración usuario

// ============================================================================
// FUNCIÓN: bulkUpdateParametros
// DESCRIPCIÓN: Actualizar múltiples parámetros simultáneamente
// PARÁMETROS: parametrosUpdates[], usuarioId
// VALIDACIONES:
// - validateAllParametersExist() - Todos existen
// - validateAllParametersEditable() - Todos editables
// - validateNoDependencyConflicts() - Sin conflictos dependencias
// FUNCIONES INTERNAS:
// - createTransactionalUpdate() - Actualización transaccional
// - validateCrossParameterRules() - Validar reglas cruzadas