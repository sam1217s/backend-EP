# COMENTARIOS DETALLADOS PARA CONTROLADORES - SISTEMA ETAPAS PRODUCTIVAS SENA

---

## 1. authController.js

### FUNCIONES DE AUTENTICACIÓN Y AUTORIZACIÓN

```javascript
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
```

---

## 2. aprendizController.js

### FUNCIONES DE GESTIÓN DE APRENDICES

```javascript
// ============================================================================
// FUNCIÓN: getAllAprendices
// DESCRIPCIÓN: Listar aprendices con filtros y paginación
// PARÁMETROS: page, limit, search, ficha, programa, estado, estadoFormacion
// FILTROS DISPONIBLES:
// - Por número documento o nombres/apellidos
// - Por ficha específica
// - Por programa formación
// - Por estado (Activo/Inactivo)
// - Por estado formación (En Formación/Etapa Productiva/Certificado/Retirado)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación válidos
// - validateSearchFilters() - Filtros búsqueda válidos
// RESPUESTA: { aprendices, totalPages, currentPage, totalRecords }

// ============================================================================
// FUNCIÓN: getAprendizById
// DESCRIPCIÓN: Obtener aprendiz específico con detalles completos
// PARÁMETROS: aprendizId
// INCLUYE:
// - Datos personales aprendiz
// - Información ficha y programa
// - Etapas productivas históricas
// - Bitácoras y seguimientos actuales
// - Estado certificación
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateUserCanViewAprendiz() - Usuario puede ver aprendiz

// ============================================================================
// FUNCIÓN: createAprendiz
// DESCRIPCIÓN: Crear nuevo aprendiz en sistema (carga masiva o individual)
// PARÁMETROS: aprendizData o array de aprendices
// CAMPOS OBLIGATORIOS:
// - numeroDocumento, tipoDocumento, nombres, apellidos
// - emailPersonal, telefono, fichaId, programaId
// VALIDACIONES ESPECÍFICAS:
// - validateDocumentUnique() - Documento único
// - validateEmailPersonalUnique() - Email personal único
// - validateEmailInstitucional() - Formato @sena.edu.co si existe
// - validateTelefonoFormat() - 10 dígitos
// - validateFichaExists() - Ficha existe y activa
// - validateProgramaExists() - Programa existe y activo
// FUNCIONES INTERNAS:
// - createUserAccount() - Crear cuenta usuario para login
// - sendWelcomeNotification() - Notificar creación cuenta

// ============================================================================
// FUNCIÓN: updateAprendiz
// DESCRIPCIÓN: Actualizar datos aprendiz
// PARÁMETROS: aprendizId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos personales (nombres, apellidos, teléfono, email)
// - Estado formación
// - Observaciones
// - Documentos entregados
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateUpdateData() - Datos actualización válidos
// - validateEstadoTransition() - Transición estado válida
// - validateUserCanUpdate() - Usuario puede actualizar

// ============================================================================
// FUNCIÓN: deleteAprendiz
// DESCRIPCIÓN: Inactivar aprendiz (soft delete)
// PARÁMETROS: aprendizId, motivo
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateCanInactivate() - Puede ser inactivado
// - validateMotiveRequired() - Motivo requerido
// - validateNoActiveEtapaProductiva() - No tiene EP activa
// FUNCIONES INTERNAS:
// - inactivateRelatedRecords() - Inactivar registros relacionados

// ============================================================================
// FUNCIÓN: getAprendizEtapasProductivas
// DESCRIPCIÓN: Historial completo etapas productivas aprendiz
// PARÁMETROS: aprendizId
// INCLUYE:
// - Todas las EP del aprendiz (activas e inactivas)
// - Modalidades utilizadas
// - Fechas inicio/fin
// - Estado actual de cada EP
// - Instructores asignados
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe

// ============================================================================
// FUNCIÓN: getAprendizBitacoras
// DESCRIPCIÓN: Bitácoras aprendiz por etapa productiva
// PARÁMETROS: aprendizId, etapaProductivaId (opcional)
// RESPUESTA: Bitácoras con estado validación y observaciones

// ============================================================================
// FUNCIÓN: getAprendizSeguimientos
// DESCRIPCIÓN: Seguimientos aprendiz por etapa productiva  
// PARÁMETROS: aprendizId, etapaProductivaId (opcional)
// RESPUESTA: Seguimientos con fechas y resultados

// ============================================================================
// FUNCIÓN: getAprendizCertificaciones
// DESCRIPCIÓN: Estado certificación aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA: Certificaciones completadas y en proceso

// ============================================================================
// FUNCIÓN: checkAprendizVencimientos
// DESCRIPCIÓN: Verificar fechas vencimiento próximas
// PARÁMETROS: aprendizId
// ALERTAS:
// - Vencimiento ficha
// - Bitácoras pendientes
// - Seguimientos próximos
// - Certificación próxima

// ============================================================================
// FUNCIÓN: updateAprendizEstado
// DESCRIPCIÓN: Cambiar estado formación aprendiz
// PARÁMETROS: aprendizId, nuevoEstado, observaciones
// ESTADOS VÁLIDOS:
// - En Formación -> Etapa Productiva
// - Etapa Productiva -> Certificado
// - Cualquier estado -> Retirado
// VALIDACIONES:
// - validateEstadoTransition() - Transición permitida
// - validatePrerequisites() - Cumple prerequisitos
// - validateObservacionesRequired() - Observaciones si aplica

// ============================================================================
// FUNCIÓN: transferAprendizFicha
// DESCRIPCIÓN: Transferir aprendiz entre fichas
// PARÁMETROS: aprendizId, nuevaFichaId, motivo
// VALIDACIONES:
// - validateAprendizExists() - Aprendiz existe
// - validateNewFichaExists() - Nueva ficha existe y activa
// - validateSamePrograma() - Mismo programa formación
// - validateMotivoRequired() - Motivo transferencia
// FUNCIONES INTERNAS:
// - registerTraslado() - Registrar historial traslado
// - updateRelatedRecords() - Actualizar registros relacionados

// ============================================================================
// FUNCIÓN: bulkUploadAprendices
// DESCRIPCIÓN: Carga masiva aprendices desde Excel/CSV
// PARÁMETROS: file
// VALIDACIONES MASIVAS:
// - validateFileFormat() - Formato archivo correcto
// - validateHeaders() - Headers requeridos
// - validateBatchData() - Validar datos en lote
// - validateDuplicatesInFile() - No duplicados en archivo
// FUNCIONES INTERNAS:
// - processUploadFile() - Procesar archivo
// - validateAprendicesData() - Validar datos masivamente
// - createAprendicesBatch() - Crear en lote con transacciones
```

---

## 3. instructorController.js

### FUNCIONES DE GESTIÓN DE INSTRUCTORES

```javascript
// ============================================================================
// FUNCIÓN: getAllInstructores  
// DESCRIPCIÓN: Listar instructores con filtros
// PARÁMETROS: page, limit, search, especialidad, tipoContrato, estado
// FILTROS:
// - Por nombre o documento
// - Por especialidad/área temática  
// - Por tipo contrato (Planta/Contratista)
// - Por estado (Activo/Inactivo/Vacaciones/Licencia)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParameters() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getInstructorById
// DESCRIPCIÓN: Obtener instructor con detalles completos
// PARÁMETROS: instructorId  
// INCLUYE:
// - Datos personales instructor
// - Asignaciones actuales EP
// - Horas programadas/ejecutadas mes actual
// - Proyección horas próximos meses
// - Historial asignaciones
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe

// ============================================================================
// FUNCIÓN: createInstructor
// DESCRIPCIÓN: Crear nuevo instructor
// PARÁMETROS: instructorData
// CAMPOS OBLIGATORIOS:
// - numeroDocumento, tipoDocumento, nombres, apellidos
// - email, especialidad, tipoContrato
// - areasTematicas, horasMensualesDisponibles
// VALIDACIONES:
// - validateDocumentUnique() - Documento único
// - validateEmailUnique() - Email único formato @sena.edu.co
// - validateTipoContrato() - Tipo contrato válido
// - validateAreasTematicas() - Áreas temáticas válidas
// - validateHorasDisponibles() - Horas disponibles positivas
// FUNCIONES INTERNAS:
// - createUserAccount() - Crear cuenta acceso sistema
// - sendWelcomeEmail() - Enviar credenciales acceso

// ============================================================================
// FUNCIÓN: updateInstructor
// DESCRIPCIÓN: Actualizar datos instructor
// PARÁMETROS: instructorId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos personales
// - Especialidad y áreas temáticas
// - Horas mensuales disponibles
// - Estado (Activo/Inactivo/Vacaciones/Licencia)
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateUpdateData() - Datos válidos
// - validateEmailUniqueOnUpdate() - Email único si cambia
// - validateNoActiveAssignments() - Sin asignaciones si inactiva

// ============================================================================
// FUNCIÓN: deleteInstructor
// DESCRIPCIÓN: Inactivar instructor
// PARÁMETROS: instructorId, motivo
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateNoActiveAssignments() - No asignaciones activas
// - validateMotivoRequired() - Motivo inactivación
// FUNCIONES INTERNAS:
// - reassignActiveEtapas() - Reasignar EP activas si aplica
// - notifyAffectedUsers() - Notificar usuarios afectados

// ============================================================================
// FUNCIÓN: getInstructorAsignaciones
// DESCRIPCIÓN: Asignaciones actuales instructor
// PARÁMETROS: instructorId, estado (opcional)
// RESPUESTA: Lista asignaciones con detalles EP y aprendices

// ============================================================================
// FUNCIÓN: getInstructorCargaTrabajo
// DESCRIPCIÓN: Carga trabajo actual instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA:
// - Horas programadas total
// - Horas ejecutadas total
// - Porcentaje utilización
// - Horas disponibles restantes
// - Distribución por modalidad

// ============================================================================
// FUNCIÓN: getInstructorProyeccionHoras
// DESCRIPCIÓN: Proyección horas próximos meses
// PARÁMETROS: instructorId, mesesAdelante
// RESPUESTA: Proyección mensual con distribución detallada

// ============================================================================
// FUNCIÓN: updateInstructorDisponibilidad
// DESCRIPCIÓN: Actualizar disponibilidad mensual instructor
// PARÁMETROS: instructorId, mes, año, horasDisponibles
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validateMesAño() - Mes y año válidos
// - validateHorasDisponibles() - Horas positivas
// - validateNotExceedAssigned() - No exceder horas asignadas

// ============================================================================
// FUNCIÓN: checkInstructorOverload  
// DESCRIPCIÓN: Verificar sobrecarga horas instructor
// PARÁMETROS: instructorId, mes, año
// ALERTAS:
// - Sobrecarga horas mensuales
// - Proyección sobrecarga próximos meses
// - Recomendaciones redistribución

// ============================================================================
// FUNCIÓN: getInstructorsByArea
// DESCRIPCIÓN: Instructores disponibles por área temática
// PARÁMETROS: areaTematica, modalidad, horasRequeridas
// FILTROS:
// - Por área temática específica
// - Compatible con modalidad
// - Con horas disponibles suficientes
// RESPUESTA: Lista instructores con disponibilidad

// ============================================================================
// FUNCIÓN: assignInstructorToEtapa
// DESCRIPCIÓN: Asignar instructor a etapa productiva
// PARÁMETROS: instructorId, etapaProductivaId, tipoInstructor, horasProgramadas
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe y activo
// - validateEtapaProductivaExists() - EP existe y activa
// - validateTipoInstructorCompatible() - Tipo compatible con modalidad
// - validateInstructorDisponibilidad() - Instructor tiene horas disponibles
// - validateAreaTematicaCompatible() - Área temática compatible
// - validateNoAsignacionDuplicada() - No duplicar asignación mismo tipo
// FUNCIONES INTERNAS:
// - createAsignacion() - Crear registro asignación
// - updateProyeccionHoras() - Actualizar proyección instructor
// - notifyStakeholders() - Notificar asignación

// ============================================================================
// FUNCIÓN: removeInstructorFromEtapa
// DESCRIPCIÓN: Quitar instructor de etapa productiva
// PARÁMETROS: instructorId, etapaProductivaId, motivo
// VALIDACIONES:
// - validateAssignmentExists() - Asignación existe
// - validateMotivoRequired() - Motivo retiro
// - validateCanRemove() - Puede ser removido
// FUNCIONES INTERNAS:
// - updateAsignacionStatus() - Actualizar estado asignación
// - adjustProyeccionHoras() - Ajustar proyección horas
// - findReplacementInstructor() - Buscar reemplazo si necesario

// ============================================================================
// FUNCIÓN: getInstructorHistorialAsignaciones
// DESCRIPCIÓN: Historial completo asignaciones instructor
// PARÁMETROS: instructorId, año (opcional)
// RESPUESTA: Historial con fechas, modalidades, horas ejecutadas

// ============================================================================
// FUNCIÓN: calculateInstructorPerformance
// DESCRIPCIÓN: Calcular rendimiento instructor
// PARÁMETROS: instructorId, periodoInicio, periodoFin
// MÉTRICAS:
// - Porcentaje cumplimiento horas
// - Puntualidad entrega seguimientos/bitácoras
// - Tasa certificación aprendices asignados
// - Calificación promedio por aprendices
```

---

## 4. etapaProductivaController.js

### FUNCIONES DE GESTIÓN DE ETAPAS PRODUCTIVAS

```javascript
// ============================================================================
// FUNCIÓN: getAllEtapasProductivas
// DESCRIPCIÓN: Listar etapas productivas con filtros avanzados
// PARÁMETROS: page, limit, search, modalidad, estado, empresa, instructor, ficha
// FILTROS DISPONIBLES:
// - Por aprendiz (nombre o documento)
// - Por modalidad específica
// - Por estado (Activo/Inactivo/Completado/Cancelado)
// - Por empresa
// - Por instructor asignado
// - Por ficha
// - Por fechas inicio/fin
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilters() - Rangos fecha válidos

// ============================================================================
// FUNCIÓN: getEtapaProductivaById
// DESCRIPCIÓN: Obtener EP específica con detalles completos
// PARÁMETROS: etapaProductivaId
// INCLUYE:
// - Datos completos EP y aprendiz
// - Información empresa y contactos
// - Instructores asignados con tipos
// - Bitácoras con estados
// - Seguimientos programados y ejecutados
// - Estado certificación
// - Documentos adjuntos
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateUserCanView() - Usuario puede ver EP

// ============================================================================
// FUNCIÓN: createEtapaProductiva
// DESCRIPCIÓN: Crear nueva etapa productiva
// PARÁMETROS: etapaProductivaData
// CAMPOS OBLIGATORIOS:
// - aprendizId, fichaId, programaId, modalidadId
// - fechaInicio, fechaFin, horasRequeridas
// - nombreEmpresa, direccionEmpresa, jefeFirmante
// VALIDACIONES CRÍTICAS:
// - validateAprendizExists() - Aprendiz existe y activo
// - validateAprendizElegible() - Elegible para EP (completó lectiva)
// - validateMaxEtapasPerAprendiz() - Máximo 3 EP por aprendiz
// - validateNoOverlapFechas() - No solapamiento fechas con otras EP
// - validateModalidadCompatible() - Modalidad compatible con programa
// - validateFichaNoVencida() - Ficha no vencida para registro
// - validateEmpresaData() - Datos empresa completos
// - validateHorasRequeridas() - Horas según modalidad (864 estándar)
// - validateFechaRegistroDentroLimite() - Registro dentro tiempo permitido
// REGLAS TEMPORALES ESPECÍFICAS:
// - Fichas anteriores Nov 2024: 24 meses total para certificar
// - Fichas desde Nov 2024: 6 meses registrar + 6 meses ejecutar = 12 meses
// FUNCIONES INTERNAS:
// - createRelatedRecords() - Crear seguimientos programados
// - assignDefaultInstructors() - Asignar instructor seguimiento
// - scheduleAlerts() - Programar alertas vencimiento
// - generateDocuments() - Generar documentos base

// ============================================================================
// FUNCIÓN: updateEtapaProductiva
// DESCRIPCIÓN: Actualizar datos etapa productiva
// PARÁMETROS: etapaProductivaId, updateData
// CAMPOS ACTUALIZABLES:
// - Datos empresa y contactos
// - Fechas (con restricciones)
// - Observaciones
// - Estado
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanUpdate() - Puede ser actualizada (no certificada)
// - validateFechaCambio() - Cambio fechas permitido
// - validateEmpresaData() - Nuevos datos empresa válidos

// ============================================================================
// FUNCIÓN: deleteEtapaProductiva
// DESCRIPCIÓN: Cancelar etapa productiva
// PARÁMETROS: etapaProductivaId, motivo, usuarioId
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanCancel() - Puede ser cancelada
// - validateMotivoRequired() - Motivo cancelación requerido
// - validateNoCertified() - No certificada aún
// FUNCIONES INTERNAS:
// - updateRelatedRecords() - Actualizar registros relacionados
// - cancelScheduledAlerts() - Cancelar alertas programadas
// - notifyInstructors() - Notificar instructores asignados
// - updateAprendizStatus() - Actualizar estado aprendiz

// ============================================================================
// FUNCIÓN: changeEtapaProductivaModalidad
// DESCRIPCIÓN: Cambiar modalidad EP existente
// PARÁMETROS: etapaProductivaId, nuevaModalidadId, motivo
// CASOS USO: Aprendiz cambia de Pasantía a Vínculo Laboral
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanChangeModalidad() - Cambio permitido
// - validateNewModalidadCompatible() - Nueva modalidad compatible
// - validateNoActiveInstructors() - Sin instructores técnicos activos
// FUNCIONES INTERNAS:
// - createNewEtapaWithNewModalidad() - Crear nueva EP
// - transferBitacorasSeguimientos() - Transferir registros
// - reassignInstructors() - Reasignar instructores
// - updateHorasRequeridas() - Actualizar horas según modalidad

// ============================================================================
// FUNCIÓN: getEtapaProductivaBitacoras
// DESCRIPCIÓN: Bitácoras específicas de una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Lista bitácoras ordenadas por número

// ============================================================================
// FUNCIÓN: getEtapaProductivaSeguimientos
// DESCRIPCIÓN: Seguimientos específicos de una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Seguimientos con fechas y estados

// ============================================================================
// FUNCIÓN: getEtapaProductivaInstructores
// DESCRIPCIÓN: Instructores asignados a EP con detalle
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Instructores con tipo, horas programadas/ejecutadas

// ============================================================================
// FUNCIÓN: checkEtapaProductivaAlerts
// DESCRIPCIÓN: Verificar alertas EP específica
// PARÁMETROS: etapaProductivaId
// ALERTAS:
// - Vencimiento próximo
// - Bitácoras atrasadas
// - Seguimientos pendientes
// - Documentos faltantes para certificación

// ============================================================================
// FUNCIÓN: validateEtapaProductivaForCertification
// DESCRIPCIÓN: Validar si EP puede certificarse
// PARÁMETROS: etapaProductivaId
// VALIDACIONES:
// - Todas bitácoras entregadas y validadas
// - Todos seguimientos completados
// - Horas requeridas completadas
// - Documentos empresa completos
// - Ficha no vencida
// RESPUESTA: { canCertify: boolean, missingRequirements: [] }

// ============================================================================
// FUNCIÓN: extendEtapaProductivaDeadline
// DESCRIPCIÓN: Extender fecha límite EP
// PARÁMETROS: etapaProductivaId, nuevaFechaFin, motivo
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateCanExtend() - Puede extenderse
// - validateNewDateValid() - Nueva fecha válida
// - validateMotiveRequired() - Motivo extensión
// - validateFichaNotExpired() - Ficha permite extensión

// ============================================================================
// FUNCIÓN: calculateEtapaProductivaProgress
// DESCRIPCIÓN: Calcular progreso EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA:
// - Porcentaje horas completadas
// - Bitácoras entregadas/total
// - Seguimientos completados/total
// - Días restantes
// - Estado general progreso

// ============================================================================
// FUNCIÓN: getEtapaProductivasByVencimiento
// DESCRIPCIÓN: EP próximas a vencer
// PARÁMETROS: diasAnticipacion
// FILTROS: Por fechas vencimiento próximas
// USO: Generación alertas automáticas

// ============================================================================
// FUNCIÓN: bulkUpdateEtapasProductivasStatus
// DESCRIPCIÓN: Actualizar estado múltiples EP
// PARÁMETROS: etapaProductivaIds[], nuevoEstado, motivo
// USO: Operaciones masivas administrativas

// ============================================================================
// FUNCIÓN: generateEtapaProductivaReport
// DESCRIPCIÓN: Generar reporte detallado EP
// PARÁMETROS: etapaProductivaId, includeDocuments
// RESPUESTA: Reporte completo para auditorías
```

---

## 5. asignacionController.js

### FUNCIONES DE GESTIÓN DE ASIGNACIONES INSTRUCTOR-EP

```javascript
// ============================================================================
// FUNCIÓN: getAllAsignaciones
// DESCRIPCIÓN: Listar todas las asignaciones con filtros
// PARÁMETROS: page, limit, search, instructor, modalidad, estado, fechaInicio, fechaFin
// FILTROS:
// - Por instructor específico
// - Por modalidad EP
// - Por estado asignación (Activo/Inactivo/Reasignado)
// - Por rango fechas asignación
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilter() - Rango fechas válido
// RESPUESTA: Lista asignaciones con datos instructor, aprendiz, modalidad

// ============================================================================
// FUNCIÓN: getAsignacionById  
// DESCRIPCIÓN: Obtener asignación específica con detalles
// PARÁMETROS: asignacionId
// INCLUYE:
// - Datos instructor y aprendiz
// - Detalles etapa productiva y modalidad
// - Horas programadas vs ejecutadas
// - Historial observaciones
// - Estado actual y fechas
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe

// ============================================================================
// FUNCIÓN: createAsignacion
// DESCRIPCIÓN: Crear nueva asignación instructor a EP
// PARÁMETROS: asignacionData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, instructorId, tipoInstructor
// - horasProgramadas, fechaAsignacion
// TIPOS INSTRUCTOR:
// - "Seguimiento": 2 horas base + 1 hora cada 4 bitácoras
// - "Técnico": Horas variables según modalidad
// - "Proyecto": 8 horas mensuales por proyecto
// VALIDACIONES CRÍTICAS:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorExists() - Instructor existe y activo
// - validateTipoInstructorCompatible() - Tipo compatible con modalidad
// - validateInstructorDisponible() - Instructor tiene horas disponibles
// - validateNoAsignacionDuplicada() - No duplicar asignación mismo tipo
// - validateAreaTematicaCompatible() - Área temática instructor compatible
// - validateHorasProgramadasValidas() - Horas según parámetros modalidad
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Actualizar proyección horas
// - createNotifications() - Notificar instructor y coordinador
// - scheduleBitacoraReviews() - Programar revisión bitácoras
// - updateEtapaProductivaInstructors() - Actualizar EP

// ============================================================================
// FUNCIÓN: updateAsignacion
// DESCRIPCIÓN: Actualizar asignación existente
// PARÁMETROS: asignacionId, updateData  
// CAMPOS ACTUALIZABLES:
// - horasProgramadas (con validaciones)
// - observaciones
// - estado
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanUpdate() - Puede ser actualizada
// - validateNewHorasDisponibles() - Instructor tiene horas disponibles
// - validateHorasNotExceedExecuted() - No reducir bajo horas ejecutadas

// ============================================================================
// FUNCIÓN: deleteAsignacion
// DESCRIPCIÓN: Eliminar/inactivar asignación
// PARÁMETROS: asignacionId, motivo
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanDelete() - Puede ser eliminada
// - validateMotivoRequired() - Motivo eliminación
// - validateNoActiveActivities() - Sin actividades pendientes
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Liberar horas instructor
// - transferPendingActivities() - Transferir actividades pendientes

// ============================================================================
// FUNCIÓN: reassignInstructor
// DESCRIPCIÓN: Reasignar EP de un instructor a otro
// PARÁMETROS: asignacionId, nuevoInstructorId, motivo
// CASOS USO:
// - Instructor se va o no disponible
// - Redistribución carga trabajo
// - Cambio área temática
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateNuevoInstructorExists() - Nuevo instructor existe y activo
// - validateNuevoInstructorDisponible() - Nuevo instructor disponible
// - validateAreaTematicaCompatible() - Nueva área temática compatible
// - validateMotivoReasignacion() - Motivo reasignación válido
// FUNCIONES INTERNAS:
// - updateAsignacionAnterior() - Marcar asignación anterior como reasignada
// - createNuevaAsignacion() - Crear nueva asignación
// - transferActivitiesPendientes() - Transferir actividades
// - updateProyeccionesHoras() - Actualizar ambos instructores
// - notifyAllStakeholders() - Notificar todos involucrados

// ============================================================================
// FUNCIÓN: getAsignacionesByInstructor
// DESCRIPCIÓN: Asignaciones específicas de un instructor
// PARÁMETROS: instructorId, estado, includeCompleted
// RESPUESTA: Lista asignaciones con progreso y fechas

// ============================================================================
// FUNCIÓN: getAsignacionesByEtapaProductiva
// DESCRIPCIÓN: Todos instructores asignados a una EP
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Lista instructores con tipos y horas

// ============================================================================
// FUNCIÓN: updateHorasEjecutadas
// DESCRIPCIÓN: Actualizar horas ejecutadas en asignación
// PARÁMETROS: asignacionId, horasEjecutadas, descripcion
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe y activa
// - validateHorasNoExceedProgramadas() - No exceder horas programadas
// - validateDescripcionRequired() - Descripción actividad requerida
// - validateHorasPositivas() - Horas positivas
// FUNCIONES INTERNAS:
// - updateRegistroHoras() - Crear registro horas detallado
// - updateInstructorProyeccion() - Actualizar proyección
// - checkCompletionStatus() - Verificar si completó asignación

// ============================================================================
// FUNCIÓN: extendHorasProgramadas
// DESCRIPCIÓN: Extender horas programadas asignación
// PARÁMETROS: asignacionId, horasAdicionales, motivo
// CASOS USO: EP requiere más tiempo del programado
// VALIDACIONES:
// - validateAsignacionExists() - Asignación existe
// - validateCanExtend() - Puede extenderse
// - validateInstructorDisponibilidad() - Instructor disponible
// - validateMotivoExtension() - Motivo extensión válido

// ============================================================================
// FUNCIÓN: getAsignacionProgress
// DESCRIPCIÓN: Progreso detallado asignación
// PARÁMETROS: asignacionId
// RESPUESTA:
// - Porcentaje horas ejecutadas
// - Actividades completadas
// - Bitácoras revisadas
// - Seguimientos realizados
// - Tiempo restante estimado

// ============================================================================
// FUNCIÓN: generateAsignacionReport
// DESCRIPCIÓN: Generar reporte asignación
// PARÁMETROS: asignacionId, periodoInicio, periodoFin
// INCLUYE:
// - Resumen horas ejecutadas
// - Actividades realizadas
// - Observaciones registradas
// - Evaluación cumplimiento

// ============================================================================
// FUNCIÓN: bulkReassignInstructores
// DESCRIPCIÓN: Reasignación masiva instructores
// PARÁMETROS: instructorSalienteId, instructorNuevoId, motivo
// USO: Instructor sale del sistema
// VALIDACIONES:
// - validateInstructorSalienteExists() - Instructor saliente existe
// - validateInstructorNuevoCapacidad() - Nuevo instructor capacidad
// - validateAreasTematicasCompatibles() - Areas compatibles

// ============================================================================
// FUNCIÓN: checkAsignacionesVencidas
// DESCRIPCIÓN: Verificar asignaciones próximas vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas automáticas sistema

// ============================================================================
// FUNCIÓN: calculateInstructorWorkload
// DESCRIPCIÓN: Calcular carga trabajo instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA: Distribución horas por asignación y modalidad
```

---

## 6. bitacoraController.js

### FUNCIONES DE GESTIÓN DE BITÁCORAS

```javascript
// ============================================================================
// FUNCIÓN: getAllBitacoras
// DESCRIPCIÓN: Listar bitácoras con filtros avanzados
// PARÁMETROS: page, limit, search, instructor, etapaProductiva, estado, fechaVencimiento
// FILTROS:
// - Por instructor asignado
// - Por etapa productiva
// - Por estado (Pendiente/Ejecutada/Verificada)
// - Por fecha vencimiento próxima
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParameters() - Parámetros filtro

// ============================================================================
// FUNCIÓN: getBitacoraById
// DESCRIPCIÓN: Obtener bitácora específica con detalles
// PARÁMETROS: bitacoraId
// INCLUYE:
// - Datos bitácora y número secuencial
// - Información aprendiz y EP
// - Instructor asignado
// - Archivos adjuntos
// - Historial observaciones
// - Estado validación
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe

// ============================================================================
// FUNCIÓN: createBitacora
// DESCRIPCIÓN: Crear nueva bitácora (automático al crear EP)
// PARÁMETROS: bitacoraData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, numeroBitacora
// - fechaPresentacion, fechaVencimiento
// REGLAS AUTOMÁTICAS:
// - numeroBitacora secuencial (1-12)
// - fechaVencimiento = fechaPresentacion + 15 días
// - estado inicial "Pendiente"
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateNumeroBitacoraSequence() - Número secuencial correcto
// - validateMaxBitacorasPerEP() - Máximo 12 bitácoras por EP
// - validateFechaPresentacionValid() - Fecha presentación válida
// FUNCIONES INTERNAS:
// - scheduleVencimientoAlert() - Programar alerta vencimiento
// - notifyInstructor() - Notificar instructor asignado

// ============================================================================
// FUNCIÓN: updateBitacora
// DESCRIPCIÓN: Actualizar bitácora existente
// PARÁMETROS: bitacoraId, updateData
// CAMPOS ACTUALIZABLES:
// - observaciones
// - observacionInstructor
// - archivoAdjunto
// - horasValidadas
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateCanUpdate() - Puede ser actualizada (no verificada)
// - validateInstructorAssigned() - Instructor asignado puede actualizar
// - validateFileFormat() - Formato archivo permitido

// ============================================================================
// FUNCIÓN: uploadBitacoraFile
// DESCRIPCIÓN: Subir archivo bitácora firmada
// PARÁMETROS: bitacoraId, file, uploaderUserId
// FORMATOS PERMITIDOS: PDF, DOC, DOCX
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateFileFormat() - Formato archivo válido
// - validateFileSize() - Tamaño archivo permitido
// - validateUserCanUpload() - Usuario puede subir archivo
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar en OneDrive
// - updateBitacoraStatus() - Actualizar a "Ejecutada"
// - notifyInstructor() - Notificar instructor para revisión

// ============================================================================
// FUNCIÓN: validateBitacora
// DESCRIPCIÓN: Marcar bitácora como verificada por instructor
// PARÁMETROS: bitacoraId, instructorId, horasAprobadas, observaciones
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateInstructorAuthorized() - Instructor autorizado
// - validateBitacoraExecuted() - Bitácora en estado "Ejecutada"
// - validateHorasAprobadas() - Horas aprobadas válidas
// - validateFileExists() - Archivo adjunto existe
// FUNCIONES INTERNAS:
// - updateBitacoraStatus() - Cambiar a "Verificada"
// - updateInstructorHours() - Sumar horas instructor
// - checkAllBitacorasCompleted() - Verificar si completó todas
// - updateEtapaProductivaProgress() - Actualizar progreso EP

// ============================================================================
// FUNCIÓN: rejectBitacora
// DESCRIPCIÓN: Rechazar bitácora por instructor
// PARÁMETROS: bitacoraId, instructorId, motivo
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateInstructorAuthorized() - Instructor autorizado
// - validateMotivoRequired() - Motivo rechazo requerido
// FUNCIONES INTERNAS:
// - updateBitacoraStatus() - Cambiar a "Pendiente"
// - addObservacionRechazo() - Agregar observación rechazo
// - notifyAprendiz() - Notificar aprendiz rechazo

// ============================================================================
// FUNCIÓN: getBitacorasByEtapaProductiva
// DESCRIPCIÓN: Bitácoras específicas de una EP
// PARÁMETROS: etapaProductivaId, includeFiles
// RESPUESTA: Lista ordenada por número bitácora

// ============================================================================
// FUNCIÓN: getBitacorasByInstructor
// DESCRIPCIÓN: Bitácoras asignadas a instructor
// PARÁMETROS: instructorId, estado, fechaInicio, fechaFin
// FILTROS: Por estado y rango fechas
// RESPUESTA: Lista con prioridad por vencimiento

// ============================================================================
// FUNCIÓN: addBitacoraObservacion
// DESCRIPCIÓN: Agregar observación a bitácora
// PARÁMETROS: bitacoraId, observacion, usuarioId, tipoObservacion
// TIPOS: "Instructor", "Coordinador", "Sistema"
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateObservacionRequired() - Observación no vacía
// - validateUserCanObserve() - Usuario puede observar

// ============================================================================
// FUNCIÓN: checkBitacorasVencidas
// DESCRIPCIÓN: Verificar bitácoras vencidas o próximas vencer
// PARÁMETROS: diasAnticipacion
// RESPUESTA: Lista bitácoras con alertas
// USO: Alertas automáticas sistema

// ============================================================================
// FUNCIÓN: getBitacoraProgress
// DESCRIPCIÓN: Progreso bitácora específica
// PARÁMETROS: bitacoraId
// RESPUESTA:
// - Estado actual
// - Días hasta vencimiento
// - Archivos adjuntos
// - Observaciones pendientes

// ============================================================================
// FUNCIÓN: generateBitacoraReport
// DESCRIPCIÓN: Reporte detallado bitácora
// PARÁMETROS: bitacoraId
// INCLUYE:
// - Datos completos bitácora
// - Historial observaciones
// - Enlaces archivos adjuntos
// - Timeline de actividades

// ============================================================================
// FUNCIÓN: bulkValidateBitacoras
// DESCRIPCIÓN: Validar múltiples bitácoras
// PARÁMETROS: bitacoraIds[], instructorId, observaciones
// USO: Instructor valida varias bitácoras simultáneamente

// ============================================================================
// FUNCIÓN: extendBitacoraDeadline
// DESCRIPCIÓN: Extender fecha vencimiento bitácora
// PARÁMETROS: bitacoraId, nuevaFechaVencimiento, motivo
// VALIDACIONES:
// - validateBitacoraExists() - Bitácora existe
// - validateCanExtend() - Puede extenderse
// - validateNewDateValid() - Nueva fecha válida
// - validateAuthorizedToExtend() - Usuario autorizado

// ============================================================================
// FUNCIÓN: getBitacorasByDateRange
// DESCRIPCIÓN: Bitácoras por rango fechas
// PARÁMETROS: fechaInicio, fechaFin, estado
// USO: Reportes mensuales y estadísticas

// ============================================================================
// FUNCIÓN: calculateBitacoraStatistics
// DESCRIPCIÓN: Estadísticas bitácoras
// PARÁMETROS: periodo, instructor, modalidad
// RESPUESTA:
// - Total bitácoras por estado
// - Promedio tiempo validación
// - Tasa cumplimiento plazos
// - Distribución por instructor
```

---

## 7. seguimientoController.js

### FUNCIONES DE GESTIÓN DE SEGUIMIENTOS

```javascript
// ============================================================================
// FUNCIÓN: getAllSeguimientos
// DESCRIPCIÓN: Listar seguimientos con filtros
// PARÁMETROS: page, limit, search, instructor, etapaProductiva, estado, tipo
// FILTROS:
// - Por instructor responsable
// - Por etapa productiva
// - Por estado (Programada/Ejecutada/Pendiente/Verificada)
// - Por tipo (Inicial/Intermedio/Final)
// - Por fecha programada próxima
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateFilterParams() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getSeguimientoById
// DESCRIPCIÓN: Obtener seguimiento específico con detalles
// PARÁMETROS: seguimientoId
// INCLUYE:
// - Datos seguimiento y tipo
// - Información aprendiz y EP
// - Instructor asignado
// - Documentos adjuntos
// - Resultados seguimiento
// - Plan mejoramiento si aplica
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe

// ============================================================================
// FUNCIÓN: createSeguimiento
// DESCRIPCIÓN: Crear nuevo seguimiento (automático al crear EP)
// PARÁMETROS: seguimientoData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, numeroSeguimiento, tipo
// - fechaProgramada, fechaLimite
// REGLAS AUTOMÁTICAS:
// - 3 seguimientos por EP (Inicial, Intermedio, Final)
// - fechaProgramada distribuida en tiempo EP
// - fechaLimite = fechaProgramada + 7 días
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe
// - validateNumeroSeguimientoSequence() - Número secuencial (1-3)
// - validateTipoSeguimientoCorresponds() - Tipo corresponde a número
// - validateFechaProgramadaValid() - Fecha programada dentro período EP
// FUNCIONES INTERNAS:
// - assignInstructorSeguimiento() - Asignar instructor
// - scheduleAlerts() - Programar alertas vencimiento

// ============================================================================
// FUNCIÓN: updateSeguimiento
// DESCRIPCIÓN: Actualizar seguimiento existente
// PARÁMETROS: seguimientoId, updateData
// CAMPOS ACTUALIZABLES:
// - fechaProgramada (solo si no ejecutado)
// - observaciones
// - observacionInstructor
// - resultados
// - planMejoramiento
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateCanUpdate() - Puede ser actualizado
// - validateInstructorAuthorized() - Instructor autorizado actualizar

// ============================================================================
// FUNCIÓN: executeSeguimiento
// DESCRIPCIÓN: Marcar seguimiento como ejecutado
// PARÁMETROS: seguimientoId, instructorId, resultados, planMejoramiento
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateInstructorAuthorized() - Instructor asignado autorizado
// - validateSeguimientoNotExecuted() - No ejecutado previamente
// - validateResultadosRequired() - Resultados obligatorios
// - validateDateInRange() - Fecha ejecución dentro rango permitido
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Ejecutada"
// - updateInstructorHours() - Sumar 2 horas instructor
// - scheduleNextSeguimiento() - Programar siguiente si aplica
// - checkAllSeguimientosCompleted() - Verificar completitud

// ============================================================================
// FUNCIÓN: uploadSeguimientoDocument
// DESCRIPCIÓN: Subir documento seguimiento
// PARÁMETROS: seguimientoId, file, uploaderUserId
// FORMATOS: PDF, DOC, DOCX
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateFileFormat() - Formato válido
// - validateFileSize() - Tamaño permitido
// - validateUserCanUpload() - Usuario puede subir
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar archivo
// - linkFileToSeguimiento() - Vincular archivo

// ============================================================================
// FUNCIÓN: verifySeguimiento
// DESCRIPCIÓN: Verificar seguimiento por coordinador
// PARÁMETROS: seguimientoId, coordinadorId, observaciones
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateSeguimientoExecuted() - Seguimiento ejecutado
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateDocumentExists() - Documento adjunto existe
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Verificada"
// - updateEtapaProductivaProgress() - Actualizar progreso EP

// ============================================================================
// FUNCIÓN: rejectSeguimiento
// DESCRIPCIÓN: Rechazar seguimiento
// PARÁMETROS: seguimientoId, coordinadorId, motivo
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - updateSeguimientoStatus() - Cambiar a "Pendiente"
// - addObservacionRechazo() - Agregar observación
// - notifyInstructor() - Notificar instructor

// ============================================================================
// FUNCIÓN: getSeguimientosByEtapaProductiva
// DESCRIPCIÓN: Seguimientos de EP específica
// PARÁMETROS: etapaProductivaId
// RESPUESTA: Los 3 seguimientos ordenados por número

// ============================================================================
// FUNCIÓN: getSeguimientosByInstructor
// DESCRIPCIÓN: Seguimientos asignados a instructor
// PARÁMETROS: instructorId, estado, fechaInicio, fechaFin
// RESPUESTA: Lista con prioridad por fecha límite

// ============================================================================
// FUNCIÓN: createSeguimientoExtraordinario
// DESCRIPCIÓN: Crear seguimiento extraordinario por problemas
// PARÁMETROS: etapaProductivaId, instructorId, motivo, fechaProgramada
// CASOS USO: Problemas en empresa, aprendiz con dificultades
// VALIDACIONES:
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorExists() - Instructor existe
// - validateMotivoRequired() - Motivo obligatorio
// - validateNotExceedMaxSeguimientos() - No exceder límite
// FUNCIONES INTERNAS:
// - assignAdditionalHours() - Asignar 2 horas adicionales
// - createSpecialAlert() - Crear alerta especial

// ============================================================================
// FUNCIÓN: scheduleSeguimientoDate
// DESCRIPCIÓN: Programar nueva fecha seguimiento
// PARÁMETROS: seguimientoId, nuevaFecha, motivo
// VALIDACIONES:
// - validateSeguimientoExists() - Seguimiento existe
// - validateNotExecuted() - No ejecutado aún
// - validateNewDateValid() - Nueva fecha válida
// - validateInAdvance() - Con mínimo 24h anticipación

// ============================================================================
// FUNCIÓN: addSeguimientoObservacion
// DESCRIPCIÓN: Agregar observación seguimiento
// PARÁMETROS: seguimientoId, observacion, usuarioId, tipo
// TIPOS: "Instructor", "Coordinador", "Sistema", "Empresa"

// ============================================================================
// FUNCIÓN: getSeguimientosVencidos
// DESCRIPCIÓN: Seguimientos vencidos o próximos vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas automáticas

// ============================================================================
// FUNCIÓN: getSeguimientoProgress
// DESCRIPCIÓN: Progreso seguimiento específico
// PARÁMETROS: seguimientoId
// RESPUESTA:
// - Estado actual
// - Días hasta límite
// - Documentos adjuntos
// - Avance plan mejoramiento

// ============================================================================
// FUNCIÓN: generateSeguimientoReport
// DESCRIPCIÓN: Reporte detallado seguimiento
// PARÁMETROS: seguimientoId
// INCLUYE:
// - Datos completos seguimiento
// - Resultados detallados
// - Plan mejoramiento
// - Historial observaciones

// ============================================================================
// FUNCIÓN: bulkScheduleSeguimientos
// DESCRIPCIÓN: Programar múltiples seguimientos
// PARÁMETROS: etapaProductivaIds[], fechasProgramadas[]
// USO: Programación masiva mensual

// ============================================================================
// FUNCIÓN: calculateSeguimientoStatistics
// DESCRIPCIÓN: Estadísticas seguimientos
// PARÁMETROS: periodo, instructor, modalidad
// RESPUESTA:
// - Total seguimientos por estado
// - Tasa cumplimiento fechas
// - Promedio tiempo ejecución
// - Distribución por tipo

// ============================================================================
// FUNCIÓN: validateAllSeguimientosCompleted
// DESCRIPCIÓN: Validar si EP completó todos seguimientos
// PARÁMETROS: etapaProductivaId
// RESPUESTA: boolean + detalles faltantes
// USO: Validación previa certificación
```

---

## 8. certificacionController.js

### FUNCIONES DE GESTIÓN DE CERTIFICACIONES

```javascript
// ============================================================================
// FUNCIÓN: getAllCertificaciones
// DESCRIPCIÓN: Listar certificaciones con filtros
// PARÁMETROS: page, limit, search, estado, ficha, programa, fechaInicio, fechaFin
// FILTROS:
// - Por estado certificación (Por Certificar/Certificado/Rechazado)
// - Por ficha específica
// - Por programa formación
// - Por rango fechas solicitud
// - Por aprendiz (nombre o documento)
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateRangeFilter() - Rango fechas válido

// ============================================================================
// FUNCIÓN: getCertificacionById
// DESCRIPCIÓN: Obtener certificación específica con detalles
// PARÁMETROS: certificacionId
// INCLUYE:
// - Datos certificación completos
// - Información aprendiz y ficha
// - Detalles etapa productiva
// - Documentos adjuntos (certificación, juicio, pantallazos)
// - Historial observaciones
// - Estado evaluación Sofía Plus
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe

// ============================================================================
// FUNCIÓN: createCertificacion
// DESCRIPCIÓN: Crear solicitud certificación
// PARÁMETROS: certificacionData
// CAMPOS OBLIGATORIOS:
// - etapaProductivaId, aprendizId, fichaId
// PREREQUISITOS AUTOMÁTICOS:
// - Todas bitácoras entregadas y verificadas (12/12)
// - Todos seguimientos completados (3/3)
// - Horas EP completadas (864 mínimo)
// - Evaluación Sofía Plus realizada
// - Documentos empresa completos
// VALIDACIONES CRÍTICAS:
// - validateEtapaProductivaExists() - EP existe
// - validateEtapaProductivaCompleted() - EP completada
// - validateAllBitacorasCompleted() - Todas bitácoras OK
// - validateAllSeguimientosCompleted() - Todos seguimientos OK
// - validateHorasCompleted() - Horas requeridas completadas
// - validateFichaNotExpired() - Ficha no vencida
// - validateEvaluacionSofiaCompleted() - Evaluación Sofía realizada
// - validateNoPreviousCertification() - No certificado previamente
// FUNCIONES INTERNAS:
// - generateCertificationCode() - Generar código certificación
// - createNotifications() - Notificar coordinador y aprendiz
// - updateAprendizStatus() - Actualizar estado aprendiz

// ============================================================================
// FUNCIÓN: updateCertificacion
// DESCRIPCIÓN: Actualizar certificación existente
// PARÁMETROS: certificacionId, updateData
// CAMPOS ACTUALIZABLES:
// - observaciones
// - evaluacionSofia (marcar como completada)
// - documentos adjuntos
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateNotCertified() - No certificada aún
// - validateUserCanUpdate() - Usuario puede actualizar

// ============================================================================
// FUNCIÓN: uploadCertificationDocument
// DESCRIPCIÓN: Subir documento certificación
// PARÁMETROS: certificacionId, tipoDocumento, file, uploaderUserId
// TIPOS DOCUMENTO:
// - "certificacion": Documento certificación final
// - "juicio": Documento juicio evaluativo
// - "pantallazo": Pantallazo evaluación Sofía
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateTipoDocumentoValid() - Tipo documento válido
// - validateFileFormat() - Formato PDF obligatorio
// - validateFileSize() - Tamaño máximo 10MB
// - validateUserCanUpload() - Usuario autorizado subir
// FUNCIONES INTERNAS:
// - saveFileToOneDrive() - Guardar en OneDrive
// - linkDocumentToCertification() - Vincular documento
// - checkAllDocumentsUploaded() - Verificar completitud documentos

// ============================================================================
// FUNCIÓN: approveCertification
// DESCRIPCIÓN: Aprobar certificación final
// PARÁMETROS: certificacionId, coordinadorId, observaciones
// VALIDACIONES FINALES:
// - validateCertificacionExists() - Certificación existe
// - validateAllDocumentsUploaded() - Todos documentos subidos
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateEvaluacionSofiaCompleted() - Evaluación Sofía OK
// - validateFichaStillValid() - Ficha aún válida
// FUNCIONES INTERNAS:
// - updateCertificationStatus() - Cambiar a "Certificado"
// - generateFinalCertificate() - Generar certificado final
// - updateAprendizStatus() - Cambiar aprendiz a "Certificado"
// - createSuccessNotifications() - Notificar éxito
// - updateStatistics() - Actualizar estadísticas centro

// ============================================================================
// FUNCIÓN: rejectCertification
// DESCRIPCIÓN: Rechazar certificación
// PARÁMETROS: certificacionId, coordinadorId, motivoRechazo
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validateNotCertified() - No certificada aún
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - updateCertificationStatus() - Cambiar a "Rechazado"
// - addRejectionObservation() - Agregar observación rechazo
// - notifyStakeholders() - Notificar instructor y aprendiz
// - createFollowUpTasks() - Crear tareas seguimiento

// ============================================================================
// FUNCIÓN: getCertificacionesByAprendiz
// DESCRIPCIÓN: Certificaciones específicas de aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA: Historial certificaciones con estados

// ============================================================================
// FUNCIÓN: getCertificacionesByFicha
// DESCRIPCIÓN: Certificaciones por ficha específica
// PARÁMETROS: fichaId, estado
// USO: Reportes auditoria por ficha

// ============================================================================
// FUNCIÓN: markEvaluacionSofiaCompleted
// DESCRIPCIÓN: Marcar evaluación Sofía como completada
// PARÁMETROS: certificacionId, pantallazoUrl
// VALIDACIONES:
// - validateCertificacionExists() - Certificación existe
// - validatePantallazoRequired() - Pantallazo obligatorio
// - validateImageFormat() - Formato imagen válido
// FUNCIONES INTERNAS:
// - savePantallazoToOneDrive() - Guardar pantallazo
// - updateEvaluacionStatus() - Marcar evaluación completada

// ============================================================================
// FUNCIÓN: validateCertificationPrerequisites
// DESCRIPCIÓN: Validar prerequisitos certificación
// PARÁMETROS: etapaProductivaId
// RESPUESTA: { canCertify: boolean, missingItems: [], details: {} }
// VERIFICA:
// - Bitácoras completadas (12/12)
// - Seguimientos completados (3/3)  
// - Horas EP completadas
// - Documentos empresa
// - Evaluación Sofía
// - Ficha no vencida

// ============================================================================
// FUNCIÓN: generateCertificationReport
// DESCRIPCIÓN: Generar reporte certificación
// PARÁMETROS: certificacionId
// INCLUYE:
// - Resumen ejecutivo certificación
// - Detalles etapa productiva
// - Documentos adjuntos
// - Timeline proceso certificación

// ============================================================================
// FUNCIÓN: bulkCreateCertifications
// DESCRIPCIÓN: Crear certificaciones masivas
// PARÁMETROS: etapaProductivaIds[]
// USO: Proceso mensual certificaciones
// VALIDACIONES:
// - validateAllEPsCompleted() - Todas EP completadas
// - validateNoDuplicates() - No duplicar certificaciones

// ============================================================================
// FUNCIÓN: getCertificationStatistics
// DESCRIPCIÓN: Estadísticas certificaciones
// PARÁMETROS: periodo, programa, ficha
// RESPUESTA:
// - Total certificaciones por estado
// - Tasa certificación por programa
// - Tiempo promedio proceso
// - Motivos rechazo frecuentes

// ============================================================================
// FUNCIÓN: checkExpiredFichas
// DESCRIPCIÓN: Verificar fichas próximas vencer
// PARÁMETROS: diasAnticipacion
// USO: Alertas fichas próximas vencer para certificación urgente

// ============================================================================
// FUNCIÓN: extendFichaForCertification
// DESCRIPCIÓN: Extender ficha para permitir certificación
// PARÁMETROS: fichaId, nuevaFechaVencimiento, motivo
// VALIDACIONES:
// - validateFichaExists() - Ficha existe
// - validateCanExtend() - Puede extenderse
// - validateJustification() - Justificación válida
// - validateAdminAuthorized() - Solo admin puede extender

// ============================================================================
// FUNCIÓN: generateFinalCertificate
// DESCRIPCIÓN: Generar certificado final PDF
// PARÁMETROS: certificacionId
// INCLUYE:
// - Template certificación SENA
// - Datos aprendiz y programa
// - Códigos verificación
// - Firmas digitales
// FUNCIONES INTERNAS:
// - loadCertificateTemplate() - Cargar plantilla
// - populateAprendizData() - Llenar datos aprendiz
// - generateVerificationCode() - Generar código verificación
// - addDigitalSignatures() - Agregar firmas digitales
```

---

## 9. horasController.js

### FUNCIONES DE GESTIÓN DE HORAS INSTRUCTORES

```javascript
// ============================================================================
// FUNCIÓN: getAllRegistroHoras
// DESCRIPCIÓN: Listar registros horas con filtros
// PARÁMETROS: page, limit, search, instructor, mes, año, tipoActividad, aprobado
// FILTROS:
// - Por instructor específico
// - Por mes y año
// - Por tipo actividad (Seguimiento/Revisión Bitácora/Asesoría Técnica/Asesoría Proyecto)
// - Por estado aprobación
// VALIDACIONES:
// - validatePaginationParams() - Parámetros paginación
// - validateDateFilters() - Filtros fecha válidos

// ============================================================================
// FUNCIÓN: getRegistroHorasById
// DESCRIPCIÓN: Obtener registro horas específico
// PARÁMETROS: registroHorasId
// INCLUYE:
// - Datos registro horas
// - Información instructor y EP
// - Detalles actividad realizada
// - Estado aprobación
// VALIDACIONES:
// - validateRegistroExists() - Registro existe

// ============================================================================
// FUNCIÓN: createRegistroHoras
// DESCRIPCIÓN: Crear nuevo registro horas
// PARÁMETROS: registroHorasData
// CAMPOS OBLIGATORIOS:
// - instructorId, etapaProductivaId, aprendizId
// - fecha, tipoActividad, horasRegistradas, descripcion
// REGLAS HORAS POR ACTIVIDAD:
// - Seguimiento: 2 horas fijas
// - Revisión Bitácora: 0.25 horas (1 hora cada 4 bitácoras)
// - Asesoría Técnica: Variable según modalidad
// - Asesoría Proyecto: Variable según tipo proyecto
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe y activo
// - validateEtapaProductivaExists() - EP existe y activa
// - validateInstructorAssigned() - Instructor asignado a EP
// - validateTipoActividadValid() - Tipo actividad válido
// - validateHorasWithinLimits() - Horas dentro límites (0.5-8 diarias)
// - validateFechaNotFuture() - Fecha no futura
// - validateNoDuplicateEntry() - No duplicar mismo día/actividad
// - validateDescripcionRequired() - Descripción obligatoria
// FUNCIONES INTERNAS:
// - updateInstructorProyeccion() - Actualizar proyección horas
// - createApprovalRequest() - Crear solicitud aprobación

// ============================================================================
// FUNCIÓN: updateRegistroHoras
// DESCRIPCIÓN: Actualizar registro horas (solo si no aprobado)
// PARÁMETROS: registroHorasId, updateData
// CAMPOS ACTUALIZABLES:
// - horasRegistradas
// - descripcion
// - observaciones
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateNotApproved() - No aprobado aún
// - validateInstructorOwner() - Instructor propietario
// - validateHorasValid() - Nuevas horas válidas

// ============================================================================
// FUNCIÓN: approveRegistroHoras
// DESCRIPCIÓN: Aprobar registro horas
// PARÁMETROS: registroHorasId, coordinadorId, observaciones
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateNotApproved() - No aprobado previamente
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateWithinMonthlyLimit() - Dentro límite mensual instructor
// FUNCIONES INTERNAS:
// - updateRegistroStatus() - Marcar como aprobado
// - updateInstructorTotalHours() - Actualizar total horas instructor
// - createPayrollEntry() - Crear entrada nómina
// - notifyInstructor() - Notificar aprobación

// ============================================================================
// FUNCIÓN: rejectRegistroHoras
// DESCRIPCIÓN: Rechazar registro horas
// PARÁMETROS: registroHorasId, coordinadorId, motivo
// VALIDACIONES:
// - validateRegistroExists() - Registro existe
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateMotivoRequired() - Motivo rechazo obligatorio
// FUNCIONES INTERNAS:
// - addRejectionObservation() - Agregar observación rechazo
// - notifyInstructorRejection() - Notificar instructor

// ============================================================================
// FUNCIÓN: getHorasByInstructor
// DESCRIPCIÓN: Horas instructor por período
// PARÁMETROS: instructorId, mes, año, includeDetails
// RESPUESTA:
// - Total horas por tipo actividad
// - Horas aprobadas vs pendientes
// - Distribución por EP
// - Comparativo meses anteriores

// ============================================================================
// FUNCIÓN: getHorasByEtapaProductiva
// DESCRIPCIÓN: Horas registradas en EP específica
// PARÁMETROS: etapaProductivaId, mes, año
// RESPUESTA: Desglose horas por instructor y actividad

// ============================================================================
// FUNCIÓN: generateInstructorTimesheet
// DESCRIPCIÓN: Generar hoja tiempo instructor
// PARÁMETROS: instructorId, mes, año
// INCLUYE:
// - Detalle diario actividades
// - Total horas por tipo
// - Estado aprobación
// - Observaciones coordinador

// ============================================================================
// FUNCIÓN: bulkApproveHoras
// DESCRIPCIÓN: Aprobar múltiples registros horas
// PARÁMETROS: registroHorasIds[], coordinadorId, observaciones
// VALIDACIONES:
// - validateAllRegistrosExist() - Todos registros existen
// - validateCoordinadorAuthorized() - Coordinador autorizado
// - validateNoneApproved() - Ninguno aprobado previamente

// ============================================================================
// FUNCIÓN: calculateInstructorPayroll
// DESCRIPCIÓN: Calcular nómina instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA:
// - Horas aprobadas por tipo
// - Tarifas por actividad
// - Total a pagar
// - Deducciones si aplica

// ============================================================================
// FUNCIÓN: getMonthlyHoursSummary
// DESCRIPCIÓN: Resumen mensual horas centro
// PARÁMETROS: mes, año, programa
// RESPUESTA:
// - Total horas por modalidad
// - Distribución por instructor
// - Comparativo presupuestado vs ejecutado
// - Tendencias y proyecciones

// ============================================================================
// FUNCIÓN: validateInstructorMonthlyLimit
// DESCRIPCIÓN: Validar límite mensual instructor
// PARÁMETROS: instructorId, mes, año, horasAdicionales
// REGLAS:
// - Máximo 160 horas mensuales base
// - Horas extra requieren aprobación especial
// - Distribución balanceada entre modalidades

// ============================================================================
// FUNCIÓN: createHorasFromActivities
// DESCRIPCIÓN: Crear registros horas automáticamente desde actividades
// PARÁMETROS: instructorId, mes, año
// FUENTES:
// - Seguimientos ejecutados (2h c/u)
// - Bitácoras validadas (0.25h c/u)
// - Asesorías programadas
// FUNCIONES INTERNAS:
// - getSeguimientosExecuted() - Obtener seguimientos mes
// - getBitacorasValidated() - Obtener bitácoras validadas
// - getAsesoriasRegistered() - Obtener asesorías registradas

// ============================================================================
// FUNCIÓN: getInstructorOvertime
// DESCRIPCIÓN: Calcular horas extra instructor
// PARÁMETROS: instructorId, mes, año
// RESPUESTA: Horas que exceden límite mensual

// ============================================================================
// FUNCIÓN: generateHorasReport
// DESCRIPCIÓN: Generar reporte horas detallado
// PARÁMETROS: fechaInicio, fechaFin, instructorId, programa
// INCLUYE:
// - Resumen ejecutivo
// - Desglose por actividad
// - Análisis tendencias
// - Recomendaciones optimización

// ============================================================================
// FUNCIÓN: proyectarHorasProximoMes
// DESCRIPCIÓN: Proyectar horas instructor próximo mes
// PARÁMETROS: instructorId, mesProyeccion, añoProyeccion
// BASADO EN:
// - EP activas asignadas
// - Seguimientos programados
// - Bitácoras estimadas
// - Asesorías planificadas

// ============================================================================
// FUNCIÓN: getHoursStatistics
// DESCRIPCIÓN: Estadísticas horas sistema
// PARÁMETROS: periodo, modalidad, tipoInstructor
// RESPUESTA:
// - Promedio horas por modalidad
// - Distribución por tipo instructor
// - Eficiencia por actividad
// - Tendencias mensuales

// ============================================================================
// FUNCIÓN: exportHorasToExcel
// DESCRIPCIÓN: Exportar horas a Excel para nómina
// PARÁMETROS: mes, año, instructorIds[]
// FORMATO: Compatible con sistema nómina SENA
```

---

## 10. reportesController.js

### FUNCIONES DE GENERACIÓN DE REPORTES

```javascript
// ============================================================================
// FUNCIÓN: getReporteGeneral
// DESCRIPCIÓN: Reporte general estado etapas productivas
// PARÁMETROS: fechaInicio, fechaFin, programa, modalidad, estado
// INCLUYE:
// - Total aprendices por estado
// - Distribución por modalidades
// - Estadísticas certificación
// - Indicadores cumplimiento
// - Comparativo períodos anteriores
// VALIDACIONES:
// - validateDateRange() - Rango fechas válido
// - validateFilterParameters() - Parámetros filtro válidos

// ============================================================================
// FUNCIÓN: getReporteFicha
// DESCRIPCIÓN: Reporte detallado por ficha específica
// PARÁMETROS: fichaId, includeDetails
// INCLUYE:
// - Información ficha y programa
// - Lista aprendices con estados
// - Etapas productivas activas
// - Instructores asignados
// - Proyección certificaciones
// - Alertas vencimiento
// VALIDACIONES:
// - validateFichaExists() - Ficha existe
// - validateUserCanViewFicha() - Usuario puede ver ficha

// ============================================================================
// FUNCIÓN: getReporteInstructor
// DESCRIPCIÓN: Reporte individual instructor
// PARÁMETROS: instructorId, mes, año, includeProjection
// INCLUYE:
// - Datos personales instructor
// - Asignaciones actuales
// - Horas ejecutadas vs programadas
// - Distribución por modalidad
// - Evaluación desempeño
// - Proyección próximos meses
// VALIDACIONES:
// - validateInstructorExists() - Instructor existe
// - validatePeriodoValid() - Período válido

// ============================================================================
// FUNCIÓN: getReporteModalidades
// DESCRIPCIÓN: Reporte estadístico por modalidades
// PARÁMETROS: fechaInicio, fechaFin, includeComparativo
// INCLUYE:
// - Total EP por modalidad
// - Tasa éxito certificación
// - Tiempo promedio EP
// - Horas instructor utilizadas
// - Empresas colaboradoras
// - Tendencias y proyecciones
// RESPUESTA: Datos para gráficos y tablas

// ============================================================================
// FUNCIÓN: getReporteAuditoria
// DESCRIPCIÓN: Reporte para auditoría interna/externa
// PARÁMETROS: fichaId, tipoAuditoria, fechaCorte
// INCLUYE:
// - Trazabilidad completa por ficha
// - Documentos y evidencias
// - Cumplimiento procedimientos
// - Observaciones y seguimientos
// - Estado certificaciones
// - Indicadores calidad
// FORMATOS: PDF para impresión, Excel para análisis

// ============================================================================
// FUNCIÓN: getReporteBitacoras
// DESCRIPCIÓN: Reporte estado bitácoras
// PARÁMETROS: fechaInicio, fechaFin, instructor, estado
// INCLUYE:
// - Total bitácoras por estado
// - Bitácoras vencidas/próximas vencer
// - Tiempo promedio validación
// - Distribución por instructor
// - Alertas y observaciones
// FILTROS: Por instructor, modalidad, programa

// ============================================================================
// FUNCIÓN: getReporteSeguimientos
// DESCRIPCIÓN: Reporte seguimientos realizados
// PARÁMETROS: fechaInicio, fechaFin, instructor, tipo
// INCLUYE:
// - Seguimientos programados vs ejecutados
// - Distribución por tipo (Inicial/Intermedio/Final)
// - Tiempo promedio ejecución
// - Planes mejoramiento generados
// - Seguimientos extraordinarios
// MÉTRICAS: Cumplimiento, puntualidad, efectividad

// ============================================================================
// FUNCIÓN: getReporteCertificaciones
// DESCRIPCIÓN: Reporte proceso certificaciones
// PARÁMETROS: fechaInicio, fechaFin, programa, estado
// INCLUYE:
// - Total certificaciones por estado
// - Tiempo promedio proceso
// - Tasa certificación por programa
// - Motivos rechazo frecuentes
// - Fichas próximas vencer
// ALERTAS: Certificaciones urgentes, documentos faltantes

// ============================================================================
// FUNCIÓN: getReporteHorasInstructores
// DESCRIPCIÓN: Reporte horas instructores detallado
// PARÁMETROS: mes, año, tipoInstructor, programa
// INCLUYE:
// - Distribución horas por instructor
// - Horas por tipo actividad
// - Comparativo presupuestado vs ejecutado
// - Instructores con sobrecarga
// - Proyección necesidades próximo período
// USO: Planeación recursos humanos

// ============================================================================
// FUNCIÓN: getReporteEmpresas
// DESCRIPCIÓN: Reporte empresas colaboradoras
// PARÁMETROS: fechaInicio, fechaFin, sector, tamaño
// INCLUYE:
// - Empresas activas por modalidad
// - Aprendices recibidos por empresa
// - Tasa retención aprendices
// - Evaluación colaboración
// - Nuevas empresas incorporadas
// MÉTRICAS: Satisfacción, capacidad, sectores

// ============================================================================
// FUNCIÓN: getReporteDashboard
// DESCRIPCIÓN: Datos para dashboard principal
// PARÁMETROS: rol, usuarioId, periodo
// INCLUYE SEGÚN ROL:
// ADMINISTRADOR:
//   - Totales generales sistema
//   - Indicadores clave rendimiento
//   - Alertas críticas
//   - Tendencias mensuales
// COORDINADOR:  
//   - Resumen área responsabilidad
//   - Tareas pendientes
//   - Alertas moderadas
//   - Comparativos período
// INSTRUCTOR:
//   - Asignaciones personales
//   - Actividades pendientes
//   - Horas ejecutadas/programadas
//   - Próximos vencimientos

// ============================================================================
// FUNCIÓN: getReporteIndicadores
// DESCRIPCIÓN: Reporte indicadores gestión
// PARÁMETROS: periodo, nivel (Centro/Nacional)
// INDICADORES:
// - Tasa certificación oportuna
// - Tiempo promedio EP
// - Satisfacción empresas
// - Utilización instructores
// - Cumplimiento procedimientos
// - Calidad documentación
// FORMATO: Cuadro mando integral

// ============================================================================
// FUNCIÓN: getReporteComparativo
// DESCRIPCIÓN: Reporte comparativo períodos
// PARÁMETROS: periodoActual, periodoAnterior, nivelComparacion
// INCLUYE:
// - Variaciones porcentuales
// - Tendencias principales
// - Análisis causas variaciones
// - Proyecciones futuras
// - Recomendaciones mejora

// ============================================================================
// FUNCIÓN: generateCustomReport
// DESCRIPCIÓN: Generar reporte personalizado
// PARÁMETROS: reportConfig
// CONFIGURACIÓN:
// - Campos seleccionados
// - Filtros aplicados
// - Agrupaciones
// - Ordenamiento
// - Formato salida
// VALIDACIONES:
// - validateReportConfig() - Configuración válida
// - validateUserPermissions() - Permisos usuario

// ============================================================================
// FUNCIÓN: exportReportToFormat
// DESCRIPCIÓN: Exportar reporte a formato específico
// PARÁMETROS: reportData, formato, configuracion
// FORMATOS: PDF, Excel, CSV, JSON
// CONFIGURACIÓN:
// - Plantilla diseño
// - Filtros aplicados
// - Metadatos reporte
// FUNCIONES INTERNAS:
// - generatePDFReport() - Generar PDF con plantillas
// - generateExcelReport() - Generar Excel con formato
// - generateCSVReport() - Generar CSV para análisis

// ============================================================================
// FUNCIÓN: scheduleAutomaticReport
// DESCRIPCIÓN: Programar reporte automático
// PARÁMETROS: reportConfig, schedule, recipients
// PROGRAMACIÓN:
// - Frecuencia (Diaria/Semanal/Mensual)
// - Horario envío
// - Lista destinatarios
// - Formato y configuración
// FUNCIONES INTERNAS:
// - createScheduledTask() - Crear tarea programada
// - validateScheduleConfig() - Validar configuración

// ============================================================================
// FUNCIÓN: getReportHistory
// DESCRIPCIÓN: Historial reportes generados
// PARÁMETROS: usuarioId, tipoReporte, fechaInicio, fechaFin
// INCLUYE:
// - Reportes generados por usuario
// - Fecha y hora generación
// - Parámetros utilizados
// - Enlaces descarga (si aplica)

// ============================================================================
// FUNCIÓN: validateReportAccess
// DESCRIPCIÓN: Validar acceso usuario a reporte
// PARÁMETROS: usuarioId, tipoReporte, parametros
// REGLAS ACCESO:
// - Administrador: Todos los reportes
// - Coordinador: Reportes área responsabilidad
// - Instructor: Solo reportes propios
// - Aprendiz: Solo datos personales

// ============================================================================
// FUNCIÓN: getReportTemplate
// DESCRIPCIÓN: Obtener plantilla reporte
// PARÁMETROS: tipoReporte, formato
// RESPUESTA: Configuración campos y formato por defecto
```

---

## 11. dashboardController.js

### FUNCIONES PARA DASHBOARDS POR ROL

```javascript
// ============================================================================
// FUNCIÓN: getDashboardAdmin
// DESCRIPCIÓN: Dashboard completo administrador
// PARÁMETROS: periodo, refresh
// WIDGETS PRINCIPALES:
// - Resumen general sistema (total EP, aprendices, instructores)
// - Indicadores clave rendimiento (KPIs)
// - Distribución modalidades (gráfico circular)
// - Tendencias mensuales (gráfico líneas)
// - Alertas críticas sistema
// - Estado fichas próximas vencer
// - Top instructores por desempeño
// - Empresas más activas
// MÉTRICAS TIEMPO REAL:
// - Certificaciones pendientes
// - Bitácoras vencidas
// - Seguimientos atrasados
// - Instructores sobrecargados

// ============================================================================
// FUNCIÓN: getDashboardCoordinador
// DESCRIPCIÓN: Dashboard coordinador área específica
// PARÁMETROS: coordinadorId, periodo
// WIDGETS ÁREA RESPONSABILIDAD:
// - Resumen EP área (activas, completadas, problemas)
// - Instructores área (disponibilidad, carga trabajo)
// - Fichas área (vencimientos próximos, certificaciones)
// - Tareas pendientes (aprobaciones, validaciones)
// - Alertas moderadas (seguimientos, bitácoras)
// - Progreso mensual vs objetivos
// - Estadísticas comparativas
// PERMISOS: Solo datos área asignada

// ============================================================================  
// FUNCIÓN: getDashboardInstructor
// DESCRIPCIÓN: Dashboard personal instructor
// PARÁMETROS: instructorId, mes, año
// WIDGETS PERSONALES:
// - Mis asignaciones actuales
// - Horas ejecutadas vs programadas
// - Actividades pendientes (seguimientos, bitácoras)
// - Cronograma próximas actividades
// - Mis aprendices (progreso individual)
// - Notificaciones personales
// - Estadísticas personales
// - Evaluación desempeño
// ALERTAS PERSONALES:
// - Seguimientos próximos vencer
// - Bitácoras sin validar
// - Sobrecarga horas

// ============================================================================
// FUNCIÓN: getDashboardAprendiz
// DESCRIPCIÓN: Dashboard personal aprendiz
// PARÁMETROS: aprendizId
// WIDGETS PERSONALES:
// - Mi etapa productiva actual
// - Progreso EP (bitácoras, seguimientos, horas)
// - Mis instructores asignados
// - Documentos pendientes
// - Próximas actividades
// - Estado certificación
// - Mi empresa (contactos, horarios)
// - Calendario personal
// ALERTAS PERSONALES:
// - Bitácoras próximas vencer
// - Seguimientos programados
// - Documentos faltantes

// ============================================================================
// FUNCIÓN: getWidgetResumenGeneral
// DESCRIPCIÓN: Widget resumen números generales
// PARÁMETROS: periodo, filtros
// RESPUESTA:
// - Total aprendices activos
// - Total EP activas
// - Total instructores
// - Certificaciones mes
// - Comparativo período anterior

// ============================================================================
// FUNCIÓN: getWidgetIndicadoresClave
// DESCRIPCIÓN: Widget KPIs principales
// RESPUESTA:
// - Tasa certificación oportuna
// - Tiempo promedio EP
// - Satisfacción empresas
// - Utilización instructores
// - Cumplimiento procedimientos
// FORMATO: Medidores visuales con colores

// ============================================================================
// FUNCIÓN: getWidgetDistribucionModalidades
// DESCRIPCIÓN: Widget gráfico modalidades
// RESPUESTA: Datos para gráfico circular/barras
// - Cantidad EP por modalidad
// - Porcentajes distribución
// - Comparativo períodos

// ============================================================================
// FUNCIÓN: getWidgetTendenciasMensuales
// DESCRIPCIÓN: Widget tendencias temporales
// PARÁMETROS: mesesHistorico
// RESPUESTA: Datos gráfico líneas
// - EP iniciadas por mes
// - Certificaciones por mes
// - Tendencias principales

// ============================================================================
// FUNCIÓN: getWidgetAlertasCriticas
// DESCRIPCIÓN: Widget alertas sistema
// PARÁMETROS: nivelCriticidad, limite
// ALERTAS POR CRITICIDAD:
// CRÍTICAS (Rojas):
//   - Fichas vencidas sin certificar
//   - Bitácoras vencidas >15 días
//   - Instructores >180 horas/mes
// MODERADAS (Amarillas):
//   - Fichas próximas vencer (30 días)
//   - Bitácoras próximas vencer (7 días)
//   - Seguimientos atrasados
// INFORMATIVAS (Azules):
//   - Certificaciones próximas completar
//   - Nuevas asignaciones

// ============================================================================
// FUNCIÓN: getWidgetMisAsignaciones
// DESCRIPCIÓN: Widget asignaciones instructor
// PARÁMETROS: instructorId
// INCLUYE:
// - EP asignadas con progreso
// - Próximas actividades
// - Horas ejecutadas/programadas
// - Estado cada asignación

// ============================================================================
// FUNCIÓN: getWidgetCalendarioActividades
// DESCRIPCIÓN: Widget calendario próximas actividades
// PARÁMETROS: usuarioId, rol, diasAdelante
// EVENTOS:
// - Seguimientos programados
// - Vencimientos bitácoras
// - Reuniones coordinación
// - Fechas límite certificación

// ============================================================================
// FUNCIÓN: getWidgetTopInstructores
// DESCRIPCIÓN: Widget ranking instructores
// PARÁMETROS: criterio, periodo
// CRITERIOS RANKING:
// - Puntualidad actividades
// - Tasa certificación aprendices
// - Evaluación aprendices
// - Cumplimiento horas
// RESPUESTA: Top 10 instructores

// ============================================================================
// FUNCIÓN: getWidgetEmpresasActivas
// DESCRIPCIÓN: Widget empresas colaboradoras
// PARÁMETROS: periodo, limite
// INCLUYE:
// - Empresas con más aprendices
// - Nuevas empresas incorporadas
// - Evaluación colaboración
// - Sectores más activos

// ============================================================================
// FUNCIÓN: getWidgetProgresoCertificacion
// DESCRIPCIÓN: Widget progreso certificación aprendiz
// PARÁMETROS: aprendizId
// RESPUESTA:
// - Porcentaje completado
// - Bitácoras entregadas
// - Seguimientos realizados
// - Documentos pendientes

// ============================================================================
// FUNCIÓN: getWidgetNotificaciones
// DESCRIPCIÓN: Widget notificaciones personales
// PARÁMETROS: usuarioId, limite
// TIPOS NOTIFICACIÓN:
// - Tareas asignadas
// - Vencimientos próximos
// - Cambios asignaciones
// - Mensajes sistema

// ============================================================================
// FUNCIÓN: refreshDashboardData
// DESCRIPCIÓN: Actualizar datos dashboard tiempo real
// PARÁMETROS: dashboardId, widgets[]
// FUNCIONES INTERNAS:
// - updateWidgetData() - Actualizar widget específico
// - validateDataChanges() - Verificar cambios significativos
// - broadcastUpdates() - Enviar actualizaciones WebSocket

// ============================================================================
// FUNCIÓN: exportDashboard
// DESCRIPCIÓN: Exportar dashboard a formato
// PARÁMETROS: dashboardConfig, formato
// FORMATOS: PDF (informe ejecutivo), Excel (datos), PNG (imágenes)

// ============================================================================
// FUNCIÓN: configureDashboard
// DESCRIPCIÓN: Configurar widgets dashboard usuario
// PARÁMETROS: usuarioId, widgetConfig
// CONFIGURACIÓN:
// - Widgets visibles
// - Orden widgets
// - Parámetros por widget
// - Frecuencia actualización

// ============================================================================
// FUNCIÓN: getDashboardMetrics
// DESCRIPCIÓN: Métricas agregadas para dashboard
// PARÁMETROS: nivel, periodo, filtros
// NIVELES: Personal, Área, Centro, Nacional
// RESPUESTA: Métricas agregadas con comparativos

// ============================================================================
// FUNCIÓN: getAlertasUsuario
// DESCRIPCIÓN: Alertas específicas usuario
// PARÁMETROS: usuarioId, rol, criticidad
// PERSONALIZACIÓN: Según rol y responsabilidades
// PRIORIZACIÓN: Por impacto y urgencia
```

---

## 12. parametrosController.js

### FUNCIONES DE GESTIÓN DE PARÁMETROS SISTEMA

```javascript
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
// SISTEMAS: SGBA, SOFIA, ONEDRIVE
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
```

---

## 13. uploadController.js

### FUNCIONES DE GESTIÓN DE ARCHIVOS

```javascript
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
```

---

## CAMPOS ADICIONALES SUGERIDOS BASADOS EN ANÁLISIS MOCKUPS

### **CAMPOS FALTANTES IMPORTANTES DETECTADOS:**

#### **Aprendiz.js - CAMPOS ADICIONALES:**
- `codigoSena`: String - Código único SENA del aprendiz
- `ciudadResidencia`: String - Ciudad residencia para estadísticas
- `tieneDiscapacidad`: Boolean - Para reportes inclusión
- `esFIC`: Boolean - Formación Integral del Campo (requiere apoyo sostenimiento)
- `requiereAposoSostenimiento`: Boolean - Solicita apoyo sostenimiento
- `fechaUltimaActualizacion`: Date - Control cambios datos
- `documentosEntregados`: Array - Lista documentos entregados coordinación

#### **EtapaProductiva.js - CAMPOS ADICIONALES:**
- `codigoModalidad`: String - Código interno modalidad para reportes
- `subdivisionModalidad`: String - Nueva subdivisión (Vínculo Formativo, Pasantía PYME, etc.)
- `numeroEtapaProductiva`: Number - Número EP del aprendiz (1ra, 2da, 3ra)
- `requiereCartaIntencion`: Boolean - Si modalidad requiere carta intención
- `fechaRegistroSistema`: Date - Fecha registro en sistema (diferente a fecha inicio)
- `alertasVencimiento`: Array - Alertas programadas específicas

#### **Modalidad.js - CAMPOS ADICIONALES:**
- `codigoModalidad`: String - Código único modalidad
- `requiereEmpresaFormal`: Boolean - Si requiere empresa con RUT
- `permiteTrabajoRemoto`: Boolean - Si permite trabajo remoto
- `requiereSeguroAccidentes`: Boolean - Si requiere seguro accidentes
- `documentosAdicionales`: Array - Documentos adicionales específicos modalidad

#### **Instructor.js - CAMPOS ADICIONALES:**
- `codigoEmpleado`: String - Código empleado SENA
- `centroFormacion`: String - Centro formación asignado
- `coordinacionAsignada`: String - Coordinación específica
- `nivelEducativo`: String - Nivel educativo instructor
- `experienciaLaboral`: Number - Años experiencia laboral
- `fechaUltimaEvaluacion`: Date - Última evaluación desempeño

#### **Empresa.js - CAMPOS ADICIONALES:**
- `representanteLegal`: String - Nombre representante legal
- `cedulaRepresentante`: String - Documento representante legal
- `actividadEconomica`: String - Actividad económica principal  
- `numeroEmpleados`: Number - Número empleados empresa
- `paginaWeb`: String - Página web empresa
- `redesSociales`: Object - Enlaces redes sociales
- `calificacionGeneral`: Number - Calificación general empresa (1-5)

### **VALIDACIONES ADICIONALES CRÍTICAS:**

#### **Reglas Temporales Específicas SENA:**
```javascript
// REGLA VENCIMIENTO FICHAS (Detectada en entrevista)
if (ficha.fechaInicio < new Date('2024-11-01')) {
    // Fichas anteriores a Nov 2024: 24 meses para certificar
    ficha.fechaVencimiento = addMonths(ficha.fechaFin, 24);
} else {
    // Fichas desde Nov 2024: 12 meses para certificar (6+6)
    ficha.fechaVencimiento = addMonths(ficha.fechaFin, 12);
}
```

#### **Validación Subdivisiones Modalidad:**
```javascript
// NUEVAS SUBDIVISIONES DETECTADAS EN MOCKUPS
const SUBDIVISIONES_MODALIDAD = {
    'VINCULO_LABORAL': [
        'Vínculo Formativo',
        'Pasantía Regular', 
        'Pasantía PYME',
        'Pasantía UPF',
        'Pasantía ONG'
    ],
    'CONTRATO_APRENDIZAJE': [
        'Por Empresa',
        'Por Campesena',
        'Por Región'
    ],
    'PROYECTO_PRODUCTIVO': [
        'I+D+I',
        'Empresarial',
        'Social',
        'Ambiental'
    ]
};
```

#### **Horas por Tipo Instructor (Detectadas en entrevista):**
```javascript
const HORAS_POR_TIPO_INSTRUCTOR = {
    'SEGUIMIENTO': {
        base: 2, // 2 horas por seguimiento
        bitacoras: 0.25, // 1 hora cada 4 bitácoras
        extraordinario: 2 // 2 horas seguimiento extraordinario
    },
    'TECNICO': {
        'PROYECTO_EMPRESARIAL': 24, // 24 horas mensuales
        'PROYECTO_PRODUCTIVO': 32, // 32 horas mensuales
        'PROYECTO_ID': 32 // 32 horas mensuales
    },
    'PROYECTO': {
        'PROYECTO_EMPRESARIAL': 48, // 48 horas mensuales
        'PROYECTO_ID': 48, // 48 horas mensuales
        'BRIGADAS': 'variable' // Según duración brigada
    }
};
```