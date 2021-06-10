import React from 'react'
import { Form, Input } from 'antd'

const FormItem = Form.Item

const CustomInput = props => {
  const {
    getFieldDecorator,
    field,
    label,
    type,
    placeholder,
    initialValue,
    validate,
    requiredValue,
    message,
    disable,
    style,
    prefix,
  } = props
  return (
    <FormItem style={style} label={label || ''}>
      {getFieldDecorator(field, {
        initialValue,
        rules: [
          { required: requiredValue, message: message || `please input your ${field}` },
          {
            validator: (rule, value, callback) => validate(rule, value, callback, field),
          },
        ],
      })(<Input prefix={prefix} type={type} placeholder={placeholder} disabled={disable} />)}
    </FormItem>
  )
}

export default CustomInput
