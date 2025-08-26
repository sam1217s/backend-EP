
// ============================================================================
// IMPORTS REQUERIDOS:
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');
// const { body, param } = require('express-validator');
// const auth = require('../middleware/auth');
// const validation = require('../middleware/validation');
// const rateLimiter = require('../middleware/rateLimiter');

// ============================================================================
// RUTA: POST /api/auth/login
// DESCRIPCIÓN: Autenticar usuario en sistema
// CONTROLLER: authController.loginUser
// MIDDLEWARES:
//   - rateLimiter.loginAttempts (máximo 5 intentos por IP en 15 minutos)
//   - validation.validateLogin
// VALIDACIONES:
//   - body('numeroDocumento').isLength({min: 6, max: 15}).matches(/^[0-9]+$/)
//   - body('tipoDocumento').isIn(['CC', 'TI', 'CE', 'PEP'])
//   - body('password').optional().isLength({min: 8}) // Opcional para aprendices
// BODY REQUEST:
// {
//   "numeroDocumento": "1234567890",
//   "tipoDocumento": "CC", 
//   "password": "password123" // Opcional para aprendices
// }
// RESPONSE SUCCESS:
// {
//   "success": true,
//   "user": { id, numeroDocumento, nombres, apellidos, rol, estado },
//   "token": "jwt_token_here",
//   "refreshToken": "refresh_token_here",
//   "permissions": ["read_aprendiz", "create_bitacora"],
//   "menu": [{ name, path, icon, children }]
// }
// ERRORS: 401 (credenciales inválidas), 423 (cuenta bloqueada), 429 (rate limit)

// ============================================================================
// RUTA: POST /api/auth/refresh
// DESCRIPCIÓN: Renovar token de autenticación
// CONTROLLER: authController.refreshToken
// MIDDLEWARES:
//   - validation.validateRefreshToken
// VALIDACIONES:
//   - body('refreshToken').notEmpty().isJWT()
// BODY REQUEST:
// {
//   "refreshToken": "refresh_token_here"
// }
// RESPONSE: Nuevo token y refreshToken

// ============================================================================
// RUTA: POST /api/auth/logout
// DESCRIPCIÓN: Cerrar sesión usuario
// CONTROLLER: authController.logoutUser
// MIDDLEWARES:
//   - auth.authenticateToken
// HEADERS: Authorization: Bearer {token}
// RESPONSE: Confirmación logout

// ============================================================================
// RUTA: POST /api/auth/reset-password
// DESCRIPCIÓN: Solicitar reset contraseña (solo instructores/admin)
// CONTROLLER: authController.resetPassword
// MIDDLEWARES:
//   - rateLimiter.resetPasswordAttempts
//   - validation.validateResetPasswordRequest
// VALIDACIONES:
//   - body('email').isEmail().normalizeEmail()
// BODY REQUEST:
// {
//   "email": "instructor@sena.edu.co"
// }
// RESTRICTION: Solo instructores y administradores

// ============================================================================
// RUTA: POST /api/auth/reset-password/confirm
// DESCRIPCIÓN: Confirmar reset con nueva contraseña
// CONTROLLER: authController.confirmResetPassword
// MIDDLEWARES:
//   - validation.validatePasswordReset
// VALIDACIONES:
//   - body('token').notEmpty().isLength({min: 32, max: 128})
//   - body('newPassword').isLength({min: 8}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//   - body('confirmPassword').custom((value, { req }) => value === req.body.newPassword)
// BODY REQUEST:
// {
//   "token": "reset_token_here",
//   "newPassword": "NewPassword123",
//   "confirmPassword": "NewPassword123"
// }

// ============================================================================
// RUTA: PUT /api/auth/change-password
// DESCRIPCIÓN: Cambiar contraseña usuario autenticado
// CONTROLLER: authController.changePassword
// MIDDLEWARES:
//   - auth.authenticateToken
//   - validation.validatePasswordChange
// VALIDACIONES:
//   - body('currentPassword').notEmpty()
//   - body('newPassword').isLength({min: 8}).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
//   - body('confirmPassword').custom((value, { req }) => value === req.body.newPassword)
// BODY REQUEST:
// {
//   "currentPassword": "oldpassword",
//   "newPassword": "NewPassword123",
//   "confirmPassword": "NewPassword123"
// }

// ============================================================================
// RUTA: GET /api/auth/profile
// DESCRIPCIÓN: Obtener perfil usuario autenticado
// CONTROLLER: authController.getUserProfile
// MIDDLEWARES:
//   - auth.authenticateToken
// RESPONSE: Datos perfil según rol (aprendiz/instructor/admin)

// ============================================================================
// RUTA: PUT /api/auth/profile
// DESCRIPCIÓN: Actualizar perfil usuario autenticado
// CONTROLLER: authController.updateUserProfile
// MIDDLEWARES:
//   - auth.authenticateToken
//   - validation.validateProfileUpdate
// VALIDACIONES: Según rol (diferentes campos editables)
// BODY: Datos perfil a actualizar 