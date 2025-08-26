// CAMPOS PRINCIPALES:
// - categoria: String, required, maxlength: 50 // Categoría principal del parámetro
// - subcategoria: String, maxlength: 50 // Subcategoría opcional
// - clave: String, required, maxlength: 100 // Clave única del parámetro
// - valor: Mixed // Valor del parámetro (String, Number, Boolean, Object, Array)
// - descripcion: String, maxlength: 500 // Descripción del parámetro
// - tipo: String, enum: ['String', 'Number', 'Boolean', 'Object', 'Array'], required
// - esEditable: Boolean, default: true // Si puede ser editado desde UI
// - requiereReinicio: Boolean, default: false // Si requiere reinicio sistema
// - activo: Boolean, default: true // Si está activo
// - ordenVisualizacion: Number, default: 0 // Orden para mostrar en UI
// - fechaCreacion: Date, default: Date.now
// - fechaActualizacion: Date
// - usuarioCreacion: ObjectId, ref: 'User'
// - usuarioActualizacion: ObjectId, ref: 'User'
// - validacion: Object // Reglas de validación específicas
// - grupoPermisos: String, enum: ['ADMIN_ONLY', 'COORDINADOR', 'PUBLICO'], default: 'ADMIN_ONLY'

// CATEGORÍAS PRINCIPALES DETECTADAS:
// 1. MODALIDADES - Configuración modalidades EP
// 2. HORAS_INSTRUCTOR - Horas por tipo instructor y modalidad
// 3. TIPOS_DOCUMENTO - CC, TI, CE, PEP
// 4. ESTADOS_SISTEMA - Estados de EP, bitácoras, seguimientos, etc.
// 5. ROLES_SISTEMA - Aprendiz, Instructor, Administrador, Coordinador
// 6. ALERTAS_TIEMPO - Configuración alertas y vencimientos
// 7. CONFIGURACION_GENERAL - Configuraciones generales sistema
// 8. REGLAS_NEGOCIO - Reglas específicas de negocio
// 9. FORMATOS_ARCHIVO - Formatos permitidos subida archivos
// 10. NOTIFICACIONES - Configuración notificaciones email
// 11. INTEGRACIONES - Configuración integraciones externas (SGBA, Sofía)
// 12. REPORTES - Configuración reportes y dashboards

// PARÁMETROS ESPECÍFICOS DETECTADOS EN MOCKUPS Y ENTREVISTA:

// MODALIDADES (páginas 14, 21, 50):
// - MODALIDAD_PASANTIA: { nombre: 'PASANTÍA', horasSegui: 8, horasTecn: 0, horasProy: 0, requiereEmpresa: true }
// - MODALIDAD_VINCULO_LABORAL: { nombre: 'VÍNCULO LABORAL', horasSegui: 8, subdivis: ['Formativo', 'Regular', 'PYME'] }
// - MODALIDAD_CONTRATO: { nombre: 'CONTRATO DE APRENDIZAJE', horasSegui: 8, subdivisiones: ['Empresa', 'Campesena'] }
// - MODALIDAD_PROYECTO_EMPRESARIAL: { horasSegui: 8, horasTecn: 24, horasProy: 48 }
// - MODALIDAD_PROYECTO_PRODUCTIVO: { horasSegui: 8, horasTecn: 32, horasProy: 0 }
// - MODALIDAD_PROYECTO_ID: { horasSegui: 8, horasTecn: 32, horasProy: 48 }
// - MODALIDAD_MONITORIAS: { horasSegui: 0, horasTecn: 0, horasProy: 0 }

// HORAS_INSTRUCTOR:
// - HORAS_SEGUIMIENTO_BASE: 2 // Por seguimiento
// - HORAS_BITACORA: 0.25 // Por bitácora (1 hora cada 4)
// - HORAS_SEGUIMIENTO_ADICIONAL: 2 // Seguimiento extraordinario
// - HORAS_MENSUALES_INSTRUCTOR: 160 // Horas mensuales disponibles
// - HORAS_PROYECTO_MENSUAL: 8 // Horas mensuales proyecto productivo
// - HORAS_BRIGADA_VARIABLE: true // Brigadas según duración

// ESTADOS_SISTEMA:
// - ESTADOS_ETAPA_PRODUCTIVA: ['Activo', 'Inactivo', 'Completado', 'Cancelado']
// - ESTADOS_BITACORA: ['Pendiente', 'Ejecutada', 'Verificada']
// - ESTADOS_SEGUIMIENTO: ['Programada', 'Ejecutada', 'Pendiente', 'Verificada']
// - ESTADOS_CERTIFICACION: ['Por Certificar', 'Certificado', 'Rechazado']
// - ESTADOS_APRENDIZ: ['Activo', 'Inactivo', 'Certificado', 'Retirado']
// - ESTADOS_INSTRUCTOR: ['Activo', 'Inactivo', 'Vacaciones', 'Licencia']

// ALERTAS_TIEMPO:
// - DIAS_ALERTA_VENCIMIENTO_FICHA: 30 // Días antes alertar vencimiento
// - DIAS_ALERTA_SEGUIMIENTO: 7 // Días antes alertar seguimiento
// - DIAS_VENCIMIENTO_BITACORA: 15 // Días para entregar bitácora
// - MESES_VENCIMIENTO_FICHA_ANTERIOR_NOV2024: 24 // 2 años
// - MESES_VENCIMIENTO_FICHA_POSTERIOR_NOV2024: 12 // 1 año
// - MESES_REGISTRO_EP_NUEVAS_FICHAS: 6 // 6 meses para registrar
// - MESES_EJECUCION_EP_NUEVAS_FICHAS: 6 // 6 meses para ejecutar

// REGLAS_NEGOCIO:
// - MAX_ETAPAS_PRODUCTIVAS_APRENDIZ: 3 // Máximo 3 EP por aprendiz
// - MAX_BITACORAS_EP: 12 // Máximo 12 bitácoras
// - MAX_SEGUIMIENTOS_EP: 3 // Máximo 3 seguimientos
// - MIN_HORAS_EP_PASANTIA: 864 // Horas mínimas pasantía
// - MAX_INSTRUCTORES_POR_AREA: 25 // Máximo instructores por área
// - DIAS_CERTIFICACION_PROCESO: 30 // Días proceso certificación
// - MAX_INTENTOS_LOGIN: 5 // Máximo intentos fallidos login

// CONFIGURACION_GENERAL:
// - NOMBRE_INSTITUCION: 'SENA - Centro de Formación Turística'
// - EMAIL_COORDINACION: 'coordinacion@sena.edu.co'
// - TELEFONO_CENTRO: '1234567890'
// - DIRECCION_CENTRO: 'Dirección del centro'
// - PAGINACION_DEFAULT: 10 // Registros por página
// - MAX_UPLOAD_SIZE: 10485760 // 10MB máximo archivos
// - FORMATO_FECHA_SISTEMA: 'DD/MM/YYYY'
// - ZONA_HORARIA: 'America/Bogota'

// NOTIFICACIONES:
// - EMAIL_ASIGNACION_INSTRUCTOR: true
// - EMAIL_BITACORA_VENCIMIENTO: true  
// - EMAIL_SEGUIMIENTO_ALERTA: true
// - EMAIL_CERTIFICACION_LISTA: true
// - TEMPLATE_EMAIL_ASIGNACION: 'template_asignacion'
// - TEMPLATE_EMAIL_VENCIMIENTO: 'template_vencimiento'

// INTEGRACIONES:
// - SGBA_API_URL: 'https://api.sgba.sena.edu.co'
// - SGBA_API_KEY: 'encrypted_api_key'
// - SOFIA_API_URL: 'https://api.sofia.sena.edu.co'
// - ONEDRIVE_BASE_URL: 'https://onedrive.live.com'
// - SYNC_FRECUENCIA_HORAS: 24 // Cada 24 horas sync con SGBA

// MÉTODOS REQUERIDOS:
// - getParametroByKey(categoria, clave) // Obtener parámetro específico
// - updateParametro(categoria, clave, nuevoValor) // Actualizar parámetro
// - createParametro(parametroData) // Crear nuevo parámetro
// - deleteParametro(categoria, clave) // Eliminar parámetro (solo si esEditable)
// - getParametrosByCategoria(categoria) // Todos parámetros categoría
// - validateParametroValue(tipo, valor, validacion) // Validar valor parámetro
// - getParametrosEditables() // Solo parámetros editables UI
// - getParametrosByGrupoPermisos(grupo) // Por grupo permisos
// - exportarConfiguracion() // Exportar toda configuración
// - importarConfiguracion(configData) // Importar configuración
// - resetearConfiguracionDefecto() // Resetear valores por defecto
// - getHistorialCambios(categoria, clave) // Historial cambios parámetro

// MÉTODOS ESPECÍFICOS SISTEMA:
// - getModalidadesActivas() // Modalidades activas con configuración
// - getHorasInstructorPorModalidad(modalidad, tipoInstructor) // Horas específicas
// - getEstadosPermitidosPorEntidad(entidad) // Estados según entidad
// - getAlertasConfiguration() // Configuración completa alertas
// - getIntegracionConfiguration(sistema) // Config integración específica
// - updateModalidadConfiguration(modalidad, config) // Actualizar modalidad
// - addNuevaModalidad(modalidadData) // Agregar nueva modalidad
// - getReglasNegocioActivas() // Reglas negocio activas
// - validateReglaNegeocio(regla, valor) // Validar regla negocio

// VALIDACIONES ESPECÍFICAS:
// - validateCategoriaExists() // Categoría existe en sistema
// - validateClaveUnique(categoria, clave) // Clave única en categoría
// - validateTipoValorConsistente() // Tipo y valor consistentes
// - validateValidacionRules() // Reglas validación bien formadas
// - validateGrupoPermisosExiste() // Grupo permisos existe
// - validateParametroEditable() // Parámetro puede ser editado
// - validateValorDentroLimites() // Valor dentro límites definidos
// - validateDependenciasParametros() // Dependencias entre parámetros
// - validateFormatoValor() // Formato valor según tipo
// - validateUsuarioPermisoEdicion() // Usuario tiene permisos edición

// ÍNDICES REQUERIDOS:
// - { categoria: 1, clave: 1 } // Único
// - { categoria: 1, activo: 1 }
// - { grupoPermisos: 1, activo: 1 }
// - { esEditable: 1, activo: 1 }
// - { fechaActualizacion: -1 } // Para auditoría

// MIDDLEWARE HOOKS:
// - pre('save') // Validar antes guardar, actualizar fechaActualizacion
// - post('save') // Log cambios, invalidar cache, notificar cambios
// - pre('findOneAndUpdate') // Validar permisos usuario
// - post('findOneAndUpdate') // Actualizar cache sistema

// CACHE STRATEGY:
// - Cache en memoria parámetros frecuentemente accedidos
// - Invalidación automática cache al actualizar parámetros
// - Cache distribuido para múltiples instancias aplicación
// - TTL configurabe por categoría parámetros