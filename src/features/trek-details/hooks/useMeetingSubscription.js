import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cancelMeetingSubscription, subscribeMeeting } from '../../auth/authApi'

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
      if (isSubscribed) await cancelMeetingSubscription(token, meetingId)
      else await subscribeMeeting(token, meetingId)
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
