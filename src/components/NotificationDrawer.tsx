import React, { useEffect, useState, useRef } from 'react'
import { notificationStore, clearNotification } from '@/store/notificationStore'

const NotificationDrawer: React.FC = () => {
  const [notification, setNotification] = useState(notificationStore.state)
  const [countdown, setCountdown] = useState(notification.countdown ?? 4)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const unsubscribe = notificationStore.subscribe(() => {
      const newNotification = notificationStore.state
      setNotification(newNotification)
      setCountdown(newNotification.countdown ?? 4)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (notification.status) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        clearNotification()
      }, (notification.countdown ?? 4) * 1000)
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [notification])

  useEffect(() => {
    if (!notification.status) {
      setCountdown(notification.countdown ?? 4)
      return
    }
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval)
          return 0
        }
        return +(prev - 0.1).toFixed(1)
      })
    }, 100)
    return () => clearInterval(interval)
  }, [notification])

  if (!notification.status) return null

  const notificationTypeStyles = {
    DEFAULT: {
      backgroundColor: 'rgba(51, 51, 51, 0.3)',
    },
    ERROR: {
      backgroundColor: 'rgba(255, 70, 70, 0.3)',
    },
    WARNING: {
      backgroundColor: 'rgba(255, 210, 0, 0.3)',
    },
    SUCCESS: {
      backgroundColor: 'rgba(70, 255, 70, 0.3)',
    },
  }

  const notificationStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 20,
    right: 20,
    color: '#fff',
    padding: '16px 24px',
    borderRadius: 16,
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    minWidth: 300,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    ...notificationTypeStyles[notification.type || 'DEFAULT'],
  }

  return (
    <div style={notificationStyle} role="alert" aria-live="assertive">
      <div style={{ marginBottom: 8 }}>
        <strong>{notification.type}</strong>: {notification.message}
      </div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>
        Closing in {countdown.toFixed(1)}s
      </div>
      <button
        onClick={() => clearNotification()}
        style={{
          marginTop: 8,
          backgroundColor: 'rgba(85, 85, 85, 0.5)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '6px 12px',
          borderRadius: 8,
          cursor: 'pointer',
        }}
        aria-label="Close notification"
      >
        Close
      </button>
    </div>
  )
}

export default NotificationDrawer