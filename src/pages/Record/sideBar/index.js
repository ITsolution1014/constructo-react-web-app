import React from 'react'
import { Form } from 'antd'
import CustomInput from '../../../components/Input'

export default ({ formHandel }) => {
  return (
    <React.Fragment>
      <section style={{ borderRadius: '5px', height: '900px' }} className="card">
        <div className="card-body" style={{ width: '100%', height: '100%' }}>
          <Form hideRequiredMark>
            <CustomInput
              style={{ margin: '0px' }}
              initialValue=""
              //   disable={(roles() !== 'WRITE' && projectId !== '') || deleted}
              requiredValue
              validate={(rule, value, callback) => callback()}
              getFieldDecorator={formHandel.getFieldDecorator}
              field="userName"
              type="text"
              placeholder="userName"
              label="User Name"
            />
            <CustomInput
              style={{ margin: '0px' }}
              initialValue=""
              //   disable={(roles() !== 'WRITE' && projectId !== '') || deleted}
              requiredValue
              validate={(rule, value, callback) => callback()}
              getFieldDecorator={formHandel.getFieldDecorator}
              field="createdAt"
              type="text"
              placeholder="CreatedAt"
              label="CreatedAt"
            />
            <CustomInput
              style={{ margin: '0px' }}
              initialValue=""
              //   disable={(roles() !== 'WRITE' && projectId !== '') || deleted}
              requiredValue
              validate={(rule, value, callback) => callback()}
              getFieldDecorator={formHandel.getFieldDecorator}
              field="updatedAt"
              type="text"
              placeholder="updatedAt"
              label="updatedAt"
            />
            <CustomInput
              style={{ margin: '0px' }}
              initialValue=""
              //   disable={(roles() !== 'WRITE' && projectId !== '') || deleted}
              requiredValue
              validate={(rule, value, callback) => callback()}
              getFieldDecorator={formHandel.getFieldDecorator}
              field="deletedAt"
              type="text"
              placeholder="deletedAt"
              label="deletedAt"
            />
          </Form>
        </div>
      </section>
    </React.Fragment>
  )
}
