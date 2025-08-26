// ============================================================================
// FUNCIÓN: loginUser
// DESCRIPCIÓN: Autenticar usuario con documento y contraseña
// PARÁMETROS: numeroDocumento, tipoDocumento, password (opcional para aprendices)
// VALIDACIONES:
// - validateDocumentFormat() - Formato documento según tipo
// - validateDocumentExists() - Documento existe en sistema 
// - validatePasswordRequired() - Contraseña requerida para instructor/admin
// - validateUserIsActive() - Usuario activo en sistema
// - validateMaxFailedAttempts() - No exceder 5 intentos fallidos
// - validateAccountNotBlocked() - Cuenta no bloqueada
// RESPUESTA: { user, token, refreshToken, permissions, menu }

// ============================================================================
// FUNCIÓN: refreshToken
// DESCRIPCIÓN: Renovar token de autenticación
// PARÁMETROS: refreshToken
// VALIDACIONES:
// - validateRefreshTokenExists() - Token existe y válido
// - validateRefreshTokenNotExpired() - Token no expirado
// - validateUserStillActive() - Usuario sigue activo
// RESPUESTA: { token, refreshToken, expiresIn }

// ============================================================================  
// FUNCIÓN: logoutUser
// DESCRIPCIÓN: Cerrar sesión de usuario
// PARÁMETROS: token
// VALIDACIONES:
// - validateTokenExists() - Token válido
// FUNCIONES INTERNAS:
// - updateLastAccess() - Actualizar último acceso
// - invalidateTokens() - Invalidar tokens activos

// ============================================================================
// FUNCIÓN: resetPassword
// DESCRIPCIÓN: Solicitar reset de contraseña (solo instructores/admin)
// PARÁMETROS: email
// VALIDACIONES:
// - validateEmailExists() - Email existe en sistema
// - validateUserIsInstructorOrAdmin() - Solo instructor/admin pueden resetear
// FUNCIONES INTERNAS:
// - generatePasswordResetToken() - Generar token recuperación
// - sendPasswordResetEmail() - Enviar email con token

// ============================================================================
// FUNCIÓN: confirmResetPassword  
// DESCRIPCIÓN: Confirmar reset con nuevo password
// PARÁMETROS: token, newPassword, confirmPassword
// VALIDACIONES:
// - validateResetTokenExists() - Token existe y válido
// - validateResetTokenNotExpired() - Token no expirado (24 horas)
// - validatePasswordComplexity() - Mínimo 8 chars, mayúscula, número
// - validatePasswordsMatch() - Passwords coinciden
// FUNCIONES INTERNAS:
// - hashPassword() - Hashear nueva contraseña
// - invalidateResetToken() - Invalidar token usado

// ============================================================================
// FUNCIÓN: changePassword
// DESCRIPCIÓN: Cambiar contraseña usuario autenticado
// PARÁMETROS: currentPassword, newPassword, confirmPassword  
// VALIDACIONES:
// - validateCurrentPassword() - Contraseña actual correcta
// - validatePasswordComplexity() - Nueva contraseña cumple requisitos
// - validatePasswordsMatch() - Passwords coinciden
// - validatePasswordDifferent() - Nueva diferente a actual

// ============================================================================
// FUNCIÓN: getUserProfile
// DESCRIPCIÓN: Obtener perfil usuario autenticado
// VALIDACIONES:
// - validateTokenExists() - Token válido y activo
// RESPUESTA: Datos perfil según rol (aprendiz/instructor/admin)

// ============================================================================
// FUNCIÓN: updateUserProfile
// DESCRIPCIÓN: Actualizar datos perfil usuario
// PARÁMETROS: datos según entidad (Aprendiz/Instructor)
// VALIDACIONES:
// - validateUserCanUpdateProfile() - Usuario puede actualizar
// - validateProfileDataFormat() - Formato datos correcto
// - validateEmailUnique() - Email único si se cambia

// ============================================================================
// MIDDLEWARE FUNCTIONS:
// - authenticateToken() - Validar JWT token
// - authorizeRole() - Validar rol específico 
// - checkPermissions() - Validar permisos específicos
// - rateLimitLogin() - Limitar intentos login