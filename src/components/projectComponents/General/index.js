import React, { useEffect } from 'react'
import { Form, Button, Select } from 'antd'
import { connect, useSelector } from 'react-redux'
import * as BootStrap from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import CustomInput from '../../Input'
import StatesData from '../states'
import GoogleMap from '../GoogleMap/index'

const General = props => {
  const {
    formHandel,
    mapSearch,
    city1,
    state1,
    street1,
    latitudeHandler,
    roles,
    project: { currentProject },
  } = props
  const userData = useSelector(state => state.user)
  const [projectCreator, setProjectCreator] = React.useState(false)
  const { Option } = Select
  const FormItem = Form.Item
  const { name, street, city, zip, state, projectDescription, location, deleted, userID } =
    currentProject || {}
  useEffect(() => {
    if (city) mapSearch()
  }, [city1, street1, mapSearch, city])
  useEffect(() => {
    const { ID } = userData
    if (userID) {
      const flag = ID === userID || roles() === 'WRITE'
      setProjectCreator(!flag)
    } else {
      setProjectCreator(false)
    }
  }, [userData, currentProject, roles, userID])
  return (
    <React.Fragment>
      <section style={{ borderRadius: '5px' }} className="card">
        <div className="card-header">
          <div className="form-title">
            <h3>
              <FormattedMessage id="project.general.heading" />
            </h3>
            <p>
              <FormattedMessage id="project.general.desc" />
            </p>
          </div>
        </div>
        <div className="card-body">
          <Form hideRequiredMark>
            <FormattedMessage id="projectList.name">
              {placeholder => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={name || ''}
                  disable={deleted || projectCreator}
                  requiredValue
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="name"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="projectList.street">
              {placeholder => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={street || ''}
                  disable={deleted || projectCreator}
                  requiredValue
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="street"
                  type="text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="project.general.city">
              {placeholder => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={city || ''}
                  disable={deleted || projectCreator}
                  requiredValue
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="city"
                  type="text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <FormattedMessage id="project.general.zip">
              {placeholder => (
                <CustomInput
                  style={{ margin: '0px' }}
                  initialValue={zip || ''}
                  disable={deleted || projectCreator}
                  requiredValue
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="zip"
                  type="text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>

            <FormItem style={{ margin: '0px' }} label={<FormattedMessage id="projectList.state" />}>
              {formHandel.getFieldDecorator('state', {
                initialValue: state || '',
                rules: [{ required: true, message: `please input your state` }],
              })(
                <Select
                  disabled={deleted || projectCreator}
                  showSearch
                  className="drop-down"
                  placeholder="Select State"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {StatesData.map(val => (
                    <Option key={val.name} value={val.name}>
                      {val.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>

            <FormattedMessage id="project.general.descField">
              {placeholder => (
                <CustomInput
                  style={{ marginBottom: '10px' }}
                  initialValue={projectDescription || ''}
                  disable={deleted || projectCreator}
                  validate={(rule, value, callback) => callback()}
                  getFieldDecorator={formHandel.getFieldDecorator}
                  field="projectDescription"
                  type="Text"
                  placeholder={placeholder}
                  label={placeholder}
                />
              )}
            </FormattedMessage>
            <BootStrap.Form.Group as={BootStrap.Col} sm="12" md="12">
              <GoogleMap
                location={location || ''}
                latitudeHandler={latitudeHandler}
                city={city1}
                street={street1}
                state={state1}
                mapSearch={mapSearch}
                pins
                formHandel={formHandel}
              />
            </BootStrap.Form.Group>
            <Button
              disabled={deleted || projectCreator}
              onClick={mapSearch}
              style={{ width: '100%', padding: '5px' }}
              className="management-form-btn"
            >
              <FormattedMessage id="project.general.search" />
            </Button>
          </Form>
        </div>
      </section>
    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return {
    project: state.project,
    user: state.user,
  }
}

export default connect(mapStateToProps, null)(General)
