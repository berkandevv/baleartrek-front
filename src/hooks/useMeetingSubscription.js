import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildApiUrl } from '../utils/api'

export function useMeetingSubscription({ isAuthenticated, token, onSuccess }) {
  const navigate = useNavigate()
  const [subscribeError, setSubscribeError] = useState('')
  const [activeMeetingId, setActiveMeetingId] = useState(null)

  const handleToggleSubscription = async (meetingId, isSubscribed, isGuide) => {
    if (!isAuthenticated || !token) {
      navigate('/login')
      return
    }

    if (isGuide) {
      window.alert('Como guía de este encuentro no puedes inscribirte.')
      return
    }

    if (isSubscribed) {
      const confirmed = window.confirm('¿Estás seguro de cancelar tu asistencia?')
      if (!confirmed) return
    }

    setSubscribeError('')
    setActiveMeetingId(meetingId)

    try {
      const response = await fetch(buildApiUrl(`/api/meetings/${meetingId}/subscribe`), {
        method: isSubscribed ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(payload?.message || 'No se pudo actualizar la suscripción')
      }
      if (typeof onSuccess === 'function') {
        await onSuccess()
      }
    } catch (error) {
      console.error('Error al actualizar suscripción:', error)
      setSubscribeError(error?.message || 'No se pudo actualizar la suscripción')
    } finally {
      setActiveMeetingId(null)
    }
  }

  return {
    subscribeError,
    activeMeetingId,
    handleToggleSubscription,
  }
}
