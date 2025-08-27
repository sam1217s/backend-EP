// ============================================================================
// CAMPOS PRINCIPALES (heredados de User):
// - _id: ObjectId (referencia al documento User base)
// - numeroDocumento: String, required, unique (heredado)
// - tipoDocumento: String, enum: ['CC', 'CE', 'TI'], required (heredado)
// - nombres: String, required, trim: true, maxlength: 100 (heredado)
// - apellidos: String, required, trim: true, maxlength: 100 (heredado)
// - email: String, required, unique, format: email (heredado)
// - rol: String, default: 'Administrador' (heredado)
// - estado: String, enum: ['Activo', 'Inactivo'], default: 'Activo' (heredado)

// ============================================================================
// CAMPOS ESPECÍFICOS ADMINISTRADOR:
// - nivelAcceso: String, enum: ['SuperAdmin', 'Admin', 'AdminArea'], required, default: 'Admin'
// - centrosAsignados: [String], required, min: 1 // Centros SENA que administra
// - modulosAcceso: [String], required // Módulos sistema con acceso completo
// - fechaAsignacion: Date, required, default: Date.now // Fecha asignación cargo admin
// - creadoPor: ObjectId, ref: 'Administrador' // Qué administrador lo creó
// - ultimoAcceso: Date // Último acceso al sistema
// - sesionesActivas: Number, default: 0, min: 0, max: 10 // Sesiones concurrentes permitidas
// - permisosCriticos: [String], default: [] // Permisos nivel sistema críticos
// - coordinadoresAsignados: [ObjectId], ref: 'Coordinador' // Coordinadores bajo supervisión
// - restriccionesAcceso: Object, default: {} // Restricciones específicas acceso
// - configuracionPersonalizada: Object, default: {} // Configuración personal dashboard
// - alertasConfiguradas: Object, default: {} // Configuración alertas personalizadas
// - horariosAcceso: Object // Horarios permitidos acceso sistema
// - ipRestringidas: [String] // IPs desde donde puede acceder
// - requiere2FA: Boolean, default: true // Requiere autenticación dos factores
// - fechaUltimoCambioPassword: Date // Control cambio contraseña obligatorio
// - intentosAccesoFallidos: Number, default: 0, max: 5 // Control accesos fallidos

// ============================================================================
// NIVELES DE ACCESO:
// SuperAdmin: Acceso completo sin restricciones, puede crear otros SuperAdmin
// Admin: Acceso completo con algunas restricciones, puede crear Admin y niveles inferiores  
// AdminArea: Administrador área específica, acceso limitado a su área

// ============================================================================
// MÓDULOS SISTEMA DISPONIBLES:
// - "USUARIOS" // Gestión completa usuarios
// - "CONFIGURACION" // Parámetros y configuración sistema
// - "AUDITORIA" // Logs y auditoría completa
// - "REPORTES" // Reportes ejecutivos y estadísticos
// - "SISTEMA" // Operaciones críticas sistema
// - "EMERGENCIAS" // Acciones emergencia
// - "INTEGRACIONES" // Configuración integraciones externas
// - "BACKUPS" // Gestión backups y recuperación
// - "MANTENIMIENTO" // Operaciones mantenimiento sistema

// ============================================================================
// PERMISOS CRÍTICOS DISPONIBLES:
// - "DELETE_USERS" // Eliminar usuarios del sistema
// - "MODIFY_SYSTEM_CONFIG" // Modificar configuración crítica
// - "ACCESS_PRODUCTION_DB" // Acceso directo base datos producción
// - "EMERGENCY_ACTIONS" // Ejecutar acciones emergencia
// - "CREATE_ADMIN" // Crear otros administradores
// - "SYSTEM_MAINTENANCE" // Modo mantenimiento sistema
// - "BULK_OPERATIONS" // Operaciones masivas críticas
// - "AUDIT_OVERRIDE" // Saltar algunas auditorías (uso excepcional)

// ============================================================================
// MÉTODOS ESPECÍFICOS ADMINISTRADOR:
// - canAccessModule(moduleName) // Verificar acceso módulo específico
// - canManageUser(userId, userRole) // Verificar puede gestionar usuario
// - canModifySystemConfig(configType) // Puede modificar configuración
// - getAllSystemStats() // Estadísticas completas sistema
// - canPerformEmergencyActions() // Puede ejecutar acciones emergencia
// - getAuditTrail(days) // Historial acciones administrador
// - canCreateAdmin(adminLevel) // Puede crear administrador nivel específico
// - validateCriticalOperation(operationType) // Validar operación crítica
// - getAssignedCoordinadores() // Coordinadores bajo supervisión
// - canAccessFromIP(ipAddress) // Validar acceso desde IP
// - isWithinAccessHours() // Validar horario acceso permitido
// - requiresTwoFactorAuth() // Requiere autenticación dos factores
// - canOverrideRestriction(restrictionType) // Puede saltar restricción específica

// ============================================================================
// VALIDACIONES ESPECÍFICAS:
// - validateNivelAcceso() // Nivel acceso válido y coherente
// - validateModulosAcceso() // Módulos acceso válidos para nivel
// - validatePermisosCriticos() // Permisos críticos válidos para nivel
// - validateCentrosAsignados() // Centros válidos y existentes
// - validateCreadorAutorizado() // Creador autorizado crear este nivel admin
// - validateRestriccionesCoherentes() // Restricciones coherentes con nivel
// - validateHorariosAcceso() // Horarios acceso válidos
// - validateIPsPermitidas() // IPs restringidas formato válido
// - validateConfiguracionPersonalizada() // Configuración personal válida
// - validateJerarquiaAdmin() // Jerarquía administrativa correcta

// ============================================================================
// MIDDLEWARE HOOKS:
// - pre('save') // Validar permisos y restricciones antes guardar
// - post('save') // Log creación/modificación administrador
// - pre('remove') // Validar puede ser removido (transferir responsabilidades)
// - post('remove') // Auditoría eliminación administrador
// - pre('findOneAndUpdate') // Validar cambios críticos
// - post('findOneAndUpdate') // Log cambios realizados

// ============================================================================
// ÍNDICES REQUERIDOS:
// - { email: 1 } // Único, autenticación
// - { nivelAcceso: 1, estado: 1 } // Búsquedas por nivel activo
// - { centrosAsignados: 1 } // Búsquedas por centro
// - { creadoPor: 1 } // Trazabilidad creación
// - { ultimoAcceso: -1 } // Ordenar por último acceso
// - { coordinadoresAsignados: 1 } // Búsquedas por coordinador

// ============================================================================
// VIRTUALS:
// - nombreCompleto: nombres + ' ' + apellidos  
// - totalCoordinadores: coordinadoresAsignados.length
// - totalCentros: centrosAsignados.length
// - diasSinAcceso: Días desde último acceso
// - sesionesDisponibles: Máximo sesiones - sesiones activas