// Muestra un recordatorio de seguridad sobre sensibilidad a mayúsculas en credenciales
export default function AuthSecurityNotice() {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
      <span className="material-symbols-outlined text-blue-500 text-xl">info</span>
      <div className="space-y-1">
        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">
          Aviso de seguridad
        </p>
        <p className="text-xs text-blue-700 leading-relaxed">
          Recuerda que nuestro sistema distingue entre <strong>mayúsculas y minúsculas</strong>. Asegúrate de
          guardarlas correctamente para evitar errores al iniciar sesión.
        </p>
      </div>
    </div>
  )
}
