// CAMPOS PRINCIPALES:
// - nombreModalidad: String, required, unique, maxlength: 100
// - descripcion: String, maxlength: 500
// - horasInstructorSeguimiento: Number, required, min: 0, default: 8
// - horasInstructorTecnico: Number, min: 0, default: 0
// - horasInstructorProyecto: Number, min: 0, default: 0
// - requiereEmpresa: Boolean, default: true
// - documentosRequeridos: [String] // Lista de documentos necesarios
// - estado: String, enum: ['Activa', 'Inactiva'], default: 'Activa'
// - subdivisiones: [String] // Nuevas subdivisiones por modalidad
// - fechaCreacion: Date, default: Date.now
// - fechaActualizacion: Date

// MODALIDADES DETECTADAS EN MOCKUPS:
// 1. PASANTÍA - 8 horas seguimiento
// 2. VÍNCULO LABORAL - 8 horas seguimiento  
// 3. UNIDAD PRODUCTIVA FAMILIAR - 8 horas seguimiento
// 4. CONTRATO DE APRENDIZAJE - 8 horas seguimiento
// 5. PROYECTO EMPRESARIAL - 8 seg + 24 téc + 48 proyecto
// 6. PROYECTO PRODUCTIVO - 8 seg + 32 téc
// 7. PROYECTO PRODUCTIVO I+D - 8 seg + 32 téc + 48 proyecto
// 8. PROYECTO SOCIAL - 8 seguimiento
// 9. MONITORÍAS - 0 horas seguimiento

// SUBDIVISIONES DETECTADAS (nuevos formatos):
// - Vínculo Laboral: [Vínculo Formativo, Pasantía Regular, Pasantía PYME, Pasantía UPF, Pasantía ONG]
// - Contrato Aprendizaje: [Por Empresa, Por Campesena, Por Región]

// MÉTODOS REQUERIDOS:
// - calculateHorasTotales() // Suma total de horas instructor
// - getDocumentosRequeridos() // Lista documentos necesarios
// - validateSubdivision(subdivision) // Validar subdivisión existe
// - addSubdivision(subdivision) // Agregar nueva subdivisión
// - removeSubdivision(subdivision) // Quitar subdivisión
// - updateHorasInstructor(tipo, horas) // Actualizar horas por tipo
// - isCompatibleWithPrograma(programaId) // Compatible con programa
// - getInstructoresRequeridos() // Tipos de instructor necesarios
// - calculateCostoTotal() // Costo total en horas instructor

// VALIDACIONES ESPECÍFICAS:
// - validateNombreModalidadUnique() // Nombre único
// - validateHorasPositivas() // Horas no negativas
// - validateDocumentosFormat() // Formato correcto documentos
// - validateSubdivisionesArray() // Array subdivisiones válido
// - validateEstadoTransition() // Transiciones estado válidas
// - validateHorasConfiguration() // Configuración horas coherente
// - validateRequiereEmpresaConsistency() // Consistencia requiere empresa
// - validateDocumentosRequiredComplete() // Documentos completos