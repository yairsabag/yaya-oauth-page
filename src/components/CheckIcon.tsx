import React from 'react'

interface CheckIconProps {
  size?: number
  style?: React.CSSProperties
}

export const CheckIcon: React.FC<CheckIconProps> = ({ size = 24, style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <polyline points="20,6 9,17 4,12"></polyline>
    </svg>
  )
}
