// CAMPOS PRINCIPALES:
// - _id: ObjectId (MongoDB)
// - numeroDocumento: String, required, unique, minlength: 6, maxlength: 15
// - tipoDocumento: String, enum: ['CC', 'TI', 'CE', 'PEP'], required
// - email: String, required (para instructor/admin), format: email
// - emailInstitucional: String, format: email (para aprendices)
// - password: String, required (solo instructor/admin), minlength: 8
// - rol: String, enum: ['Aprendiz', 'Instructor', 'Administrador', 'Coordinador']
// - estado: String, enum: ['Activo', 'Inactivo'], default: 'Activo'
// - fechaCreacion: Date, default: Date.now
// - ultimoAcceso: Date
// - intentosFallidos: Number, default: 0, max: 5
// - bloqueado: Boolean, default: false
// - tokenRecuperacion: String
// - fechaExpiracionToken: Date

// MÉTODOS REQUERIDOS:
// - comparePassword(candidatePassword) // Comparar contraseña hasheada
// - generateAuthToken() // JWT token con rol y permisos
// - generateRefreshToken() // Token de renovación
// - updateLastAccess() // Actualizar último acceso
// - incrementFailedAttempts() // Incrementar intentos fallidos
// - resetFailedAttempts() // Resetear intentos fallidos
// - blockUser() // Bloquear usuario por intentos fallidos
// - unblockUser() // Desbloquear usuario
// - generatePasswordResetToken() // Token para recuperar contraseña
// - validatePasswordResetToken(token) // Validar token de recuperación

// VALIDACIONES ESPECÍFICAS:
// - validateDocumentType() // Validar que tipo documento coincida con número
// - validateEmailFormat() // Validar formato email institucional SENA
// - validatePasswordComplexity() // Mínimo 8 caracteres, mayúscula, número
// - validateUniqueDocument() // Documento único en sistema
// - validateRolePermissions() // Validar permisos por rol