import { useRef } from 'react'

export function useCarouselDrag(carouselRef) {
  // Guarda estado temporal del gesto de arrastre
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })

  // Desplaza el carrusel por botones con scroll suave
  const scrollCarouselBy = (offset) => {
    if (!carouselRef.current) return
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  // Inicia el arrastre con puntero y captura el elemento
  const handlePointerDown = (event) => {
    const container = carouselRef.current
    if (!container) return
    if (event.target.closest('button')) return
    container.setPointerCapture(event.pointerId)
    container.classList.add('carousel-dragging')
    dragState.current.isDragging = true
    dragState.current.startX = event.clientX
    dragState.current.scrollLeft = container.scrollLeft
  }

  // Actualiza la posición horizontal mientras se arrastra
  const handlePointerMove = (event) => {
    const container = carouselRef.current
    if (!container || !dragState.current.isDragging) return
    const deltaX = event.clientX - dragState.current.startX
    container.scrollLeft = dragState.current.scrollLeft - deltaX
  }

  // Finaliza el arrastre y restablece el estado visual
  const handlePointerUp = (event) => {
    const container = carouselRef.current
    if (!container) return
    container.releasePointerCapture(event.pointerId)
    container.classList.remove('carousel-dragging')
    dragState.current.isDragging = false
  }

  return {
    scrollCarouselBy,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
