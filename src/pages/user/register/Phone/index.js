import React from 'react'
import PhoneInput from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import './style.css'

export default function index(props) {
  const { phone } = props
  return (
    <div>
      <PhoneInput
        flags={flags}
        placeholder="Enter phone number"
        value={phone}
        onChange={event => props.setPhone(event)}
      />
    </div>
  )
}
