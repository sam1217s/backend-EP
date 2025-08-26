// ============================================================================
// RUTA: GET /api/parametros
// DESCRIPCIÓN: Listar parámetros sistema con filtros
// CONTROLLER: parametrosController.getAllParametros
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
//   - validation.validatePagination
// QUERY PARAMETERS:
//   - page, limit (paginación estándar)
//   - categoria (MODALIDADES/HORAS_INSTRUCTOR/ESTADOS_SISTEMA/etc.)
//   - subcategoria (opcional, filtro adicional)
//   - grupoPermisos (ADMIN_ONLY/COORDINADOR/PUBLICO)
//   - esEditable (boolean, solo parámetros editables)
//   - activo (boolean, solo parámetros activos)
// VALIDACIONES QUERY:
//   - query('grupoPermisos').optional().isIn(['ADMIN_ONLY', 'COORDINADOR', 'PUBLICO'])
//   - query('esEditable').optional().isBoolean()
// PERMISOS: Filtrados por grupo permisos usuario

// ============================================================================
// RUTA: GET /api/parametros/:id
// DESCRIPCIÓN: Obtener parámetro específico
// CONTROLLER: parametrosController.getParametroById
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeParametroAccess
//   - validation.validateMongoId('id')
// RESPONSE: Configuración completa con historial cambios recientes

// ============================================================================
// RUTA: GET /api/parametros/key/:categoria/:clave
// DESCRIPCIÓN: Obtener parámetro por clave específica
// CONTROLLER: parametrosController.getParametroByKey
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeParametroAccess
// PARAMS:
//   - categoria: Categoría parámetro
//   - clave: Clave específica parámetro
// USO: Acceso directo configuración sistema
// CACHE: Valores frecuentemente accedidos en memoria
// VALIDACIONES PARAMS:
//   - param('categoria').notEmpty().isLength({max: 50})
//   - param('clave').notEmpty().isLength({max: 100})

// ============================================================================
// RUTA: POST /api/parametros
// DESCRIPCIÓN: Crear nuevo parámetro sistema
// CONTROLLER: parametrosController.createParametro
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateParametroCreation
// VALIDACIONES BODY CRÍTICAS:
//   - body('categoria').notEmpty().isLength({max: 50})
//   - body('clave').notEmpty().isLength({max: 100})
//   - body('valor').notEmpty() // Validación depende del tipo
//   - body('tipo').isIn(['String', 'Number', 'Boolean', 'Object', 'Array'])
//   - body('descripcion').notEmpty().isLength({max: 500})
//   - body('grupoPermisos').isIn(['ADMIN_ONLY', 'COORDINADOR', 'PUBLICO'])
//   - body('esEditable').isBoolean()
// VALIDACIONES ESPECÍFICAS:
//   - validateClaveUnique() - Clave única en categoría
//   - validateTipoValorConsistente() - Tipo y valor consistentes
//   - validateValidacionRules() - Reglas validación bien formadas
//   - validateUserCanCreate() - Usuario puede crear parámetros
// BODY REQUEST:
// {
//   "categoria": "MODALIDADES",
//   "subcategoria": "HORAS_INSTRUCTOR",
//   "clave": "HORAS_SEGUIMIENTO_PASANTIA",
//   "valor": 8,
//   "tipo": "Number",
//   "descripcion": "Horas instructor seguimiento para modalidad pasantía",
//   "validacion": { "min": 1, "max": 50 },
//   "esEditable": true,
//   "grupoPermisos": "ADMIN_ONLY"
// }

// ============================================================================
// RUTA: PUT /api/parametros/:id
// DESCRIPCIÓN: Actualizar parámetro existente
// CONTROLLER: parametrosController.updateParametro
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeParametroEdit
//   - validation.validateParametroUpdate
// CAMPOS ACTUALIZABLES:
//   - valor (principal, con validaciones tipo)
//   - descripcion
//   - validacion (reglas)
//   - activo (activar/desactivar)
// VALIDACIONES CRÍTICAS:
//   - validateParametroEditable() - Parámetro es editable
//   - validateNewValue() - Nuevo valor válido según tipo
//   - validateDependenciasParametros() - No romper dependencias
//   - validateSystemImpact() - Evaluar impacto sistema
// REGLAS ESPECIALES MODALIDADES:
//   - Actualizar horas instructor → validar áreas afectadas
//   - Cambios estados sistema → migración datos si necesario
//   - Modificar alertas → reprogramación tareas automáticas
// PROCESO:
//   1. Backup valor anterior
//   2. Validar impacto sistema
//   3. Actualizar parámetros relacionados
//   4. Propagar cambios dependientes
//   5. Invalidar cache relacionado
//   6. Log auditoría cambio

// ============================================================================
// RUTA: DELETE /api/parametros/:id
// DESCRIPCIÓN: Eliminar parámetro (solo si esEditable y sin dependencias)
// CONTROLLER: parametrosController.deleteParametro
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// VALIDACIONES CRÍTICAS:
//   - validateParametroEditable() - Es editable
//   - validateNoDependencies() - Sin dependencias activas
//   - validateUserCanDelete() - Usuario puede eliminar
// PROCESO:
//   1. Verificar dependencias sistema
//   2. Crear backup antes eliminar
//   3. Eliminar parámetro
//   4. Invalidar cache
//   5. Log auditoría eliminación

// ============================================================================
// RUTA: GET /api/parametros/categoria/:categoria
// DESCRIPCIÓN: Todos parámetros de categoría específica
// CONTROLLER: parametrosController.getParametrosByCategoria
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorizeParametroCategory
// PARAMS:
//   - categoria: Categoría específica
// QUERY PARAMETERS:
//   - includeInactive (boolean, incluir inactivos)
// CATEGORÍAS PRINCIPALES:
//   - MODALIDADES: Configuración modalidades EP
//   - HORAS_INSTRUCTOR: Distribución horas por tipo
//   - ESTADOS_SISTEMA: Estados válidos entidades
//   - ALERTAS_TIEMPO: Configuración alertas y vencimientos
//   - REGLAS_NEGOCIO: Reglas específicas sistema
//   - NOTIFICACIONES: Configuración emails
//   - INTEGRACIONES: APIs externas (SGBA, Sofía)
// USO: Configuración masiva categorías

// ============================================================================
// RUTA: PUT /api/parametros/modalidad/:modalidad
// DESCRIPCIÓN: Actualizar configuración modalidad específica
// CONTROLLER: parametrosController.updateModalidadConfiguration
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateModalidadConfig
// PARAMS:
//   - modalidad: Nombre modalidad
// BODY REQUEST:
// {
//   "horasInstructorSeguimiento": 8,
//   "horasInstructorTecnico": 24,
//   "horasInstructorProyecto": 48,
//   "subdivisiones": ["Vínculo Formativo", "Pasantía Regular"],
//   "documentosRequeridos": ["Carta intención", "Hoja vida"],
//   "requiereEmpresa": true
// }
// VALIDACIONES ESPECÍFICAS:
//   - validateModalidadExists() - Modalidad existe
//   - validateHorasConfiguration() - Configuración horas coherente
//   - validateSubdivisionesValid() - Subdivisiones válidas
//   - validateNoActiveEPs() - Sin EP activas (para cambios críticos)
// PROCESO:
//   1. Actualizar parámetros modalidad
//   2. Recalcular proyecciones instructores
//   3. Notificar instructores afectados
//   4. Actualizar cache sistema

// ============================================================================
// RUTA: POST /api/parametros/modalidad
// DESCRIPCIÓN: Agregar nueva modalidad completa
// CONTROLLER: parametrosController.addNuevaModalidad
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateNuevaModalidad
// PROCESO COMPLETO:
//   1. Crear parámetros modalidad base
//   2. Configurar horas por tipo instructor
//   3. Definir documentos requeridos específicos
//   4. Establecer subdivisiones permitidas
//   5. Activar en sistema
//   6. Crear reglas negocio asociadas
// VALIDACIONES:
//   - validateModalidadDataComplete() - Datos completos
//   - validateNombreModalidadUnique() - Nombre único sistema
//   - validateHorasConfigurationValid() - Configuración coherente

// ============================================================================
// RUTA: GET /api/parametros/horas-modalidad/:modalidad/:tipoInstructor
// DESCRIPCIÓN: Horas configuradas modalidad-tipo instructor
// CONTROLLER: parametrosController.getHorasInstructorPorModalidad
// MIDDLEWARES:
//   - auth.authenticateToken
// PARAMS:
//   - modalidad: Nombre modalidad
//   - tipoInstructor: Seguimiento/Técnico/Proyecto
// RESPONSE: Horas configuradas para combinación específica
// CACHE: Valores en memoria para acceso rápido

// ============================================================================
// RUTA: PUT /api/parametros/alertas
// DESCRIPCIÓN: Actualizar configuración alertas sistema
// CONTROLLER: parametrosController.updateAlertasConfiguration
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateAlertasConfig
// BODY REQUEST:
// {
//   "DIAS_ALERTA_VENCIMIENTO_FICHA": 30,
//   "DIAS_ALERTA_SEGUIMIENTO": 7,
//   "DIAS_VENCIMIENTO_BITACORA": 15,
//   "FRECUENCIA_EMAILS_ALERTAS": "Diaria",
//   "HORARIO_ENVIO_ALERTAS": "08:00"
// }
// VALIDACIONES:
//   - validateDiasPositivos() - Días positivos
//   - validateFrecuenciaValida() - Frecuencia válida
//   - validateHorarioValido() - Formato horario correcto
// PROCESO:
//   1. Actualizar parámetros alertas
//   2. Reprogramar alertas activas
//   3. Actualizar trabajos cron
//   4. Notificar cambios configuración

// ============================================================================
// RUTA: GET /api/parametros/integracion/:sistema
// DESCRIPCIÓN: Configuración integración externa específica
// CONTROLLER: parametrosController.getIntegracionConfiguration
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// PARAMS:
//   - sistema: SGBA/SOFIA/ONEDRIVE
// RESPONSE: URLs, configuración conexión (keys encriptadas)
// SEGURIDAD: Keys API encriptadas, acceso solo administrador

// ============================================================================
// RUTA: PUT /api/parametros/integracion/:sistema
// DESCRIPCIÓN: Actualizar configuración integración
// CONTROLLER: parametrosController.updateIntegracionConfiguration
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
//   - validation.validateIntegracionConfig
// VALIDACIONES:
//   - validateConfigurationFormat() - Formato válido
//   - validateConnectivity() - Probar conectividad
// PROCESO:
//   1. Encriptar claves API nuevas
//   2. Probar conexión con nueva config
//   3. Actualizar parámetros sistema
//   4. Invalidar cache conexiones

// ============================================================================
// RUTA: GET /api/parametros/reglas-negocio
// DESCRIPCIÓN: Reglas negocio activas sistema
// CONTROLLER: parametrosController.getReglasNegocioActivas
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador', 'Coordinador'])
// RESPONSE: Reglas aplicables con valores actuales
// REGLAS PRINCIPALES:
//   - MAX_ETAPAS_PRODUCTIVAS_APRENDIZ: 3
//   - MAX_BITACORAS_EP: 12
//   - MAX_SEGUIMIENTOS_EP: 3
//   - MIN_HORAS_EP_PASANTIA: 864
//   - DIAS_CERTIFICACION_PROCESO: 30

// ============================================================================
// RUTA: POST /api/parametros/validar-regla
// DESCRIPCIÓN: Validar regla negocio específica
// CONTROLLER: parametrosController.validateReglaNegeocio
// MIDDLEWARES:
//   - auth.authenticateToken
// BODY REQUEST:
// {
//   "regla": "MAX_ETAPAS_PRODUCTIVAS_APRENDIZ",
//   "valor": 3,
//   "contexto": { "aprendizId": "ObjectId", "fichaId": "ObjectId" }
// }
// USO: Validaciones dinámicas sistema
// RESPONSE: { isValid: boolean, message: string, details: {} }

// ============================================================================
// RUTA: GET /api/parametros/export
// DESCRIPCIÓN: Exportar configuración completa sistema
// CONTROLLER: parametrosController.exportarConfiguracion
// MIDDLEWARES:
//   - auth.authenticateToken
//   - roleValidator.authorize(['Administrador'])
// QUERY PARAMETERS:
//   - categorias (array, categorías específicas)
//   - formato (json/excel)
//   - includeValues (boolean, incluir valores actuales)
// INCLUYE:
//   - Todos parámetros por categoría
//   - Valores actuales configurados
//   - Descripciones y reglas validación
//   - Metadata configuración sistema
// USO: Backup configuración, migración sistemas

// ============================================================================
// RUTA: POST /api/parametros/import
// DESCRIPCIÓN: Importar configuración sistema
// CONTROLLER: parametrosController.importarConfiguracion# COMENTARIOS DETALLADOS PARA RUTAS - SISTEMA ETAPAS PRODUCTIVAS SENA

