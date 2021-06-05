import React from 'react'
import './marker.css'

const Marker = props => {
  const { color, name = 'no Name Provided' } = props
  return (
    <div>
      <div
        className="pin bounce"
        style={{ backgroundColor: color, cursor: 'pointer' }}
        title={name}
      />
      <div className="pulse" />
    </div>
  )
}

export default Marker
