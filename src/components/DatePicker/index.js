import React from 'react'
import { DatePicker, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item

const Date = props => {
  const { getFieldDecorator, field, placeholder, initialValue, label, disabled } = props
  return (
    <FormItem label={label}>
      {getFieldDecorator(field, {
        initialValue: initialValue ? moment(initialValue, 'YYYY-MM-DD') : '',
        rules: [
          {
            type: 'object',
            required: true,
            message: `Please input ${field}`,
            whitespace: true,
          },
        ],
      })(
        <DatePicker
          disabled={disabled}
          format="YYYY-MM-DD"
          style={{ width: '100%' }}
          placeholder={placeholder}
        />,
      )}
    </FormItem>
  )
}

export default Date
