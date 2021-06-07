import React, { useState, useEffect } from 'react'
import { Input, Button, Statistic, notification } from 'antd'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import WithModal from '../../HOC/WithModal'

const { Countdown } = Statistic

export default ({ modal, setModal, verify, sendMessage }) => {
  const [value, setValue] = useState('')
  const [sent, setSent] = useState(false)
  const [isRemain, setIsRemain] = useState(false)
  const [deadline, setDedLine] = useState(Date.now() + 60 * 60 * 24 * 10 + 1000 * 37)
  const verificationCode = useSelector(state => state?.record?.verificationCode)
  const signing = useSelector(state => state?.record?.ssigning)

  const SignRecord = async () => {
    if (value && Number(value) === verificationCode && !isRemain) {
      setSent(!sent)
      await verify()
      // setIsRemain(!isRemain)
      setDedLine('')
    }
    if (isRemain)
      notification.warn({ message: 'Verification time expire plesase try again with new code' })
    if (Number(value) !== verificationCode)
      notification.warn({ message: 'Verification code not match' })
  }

  const tryAgain = () => {
    sendMessage()
    setDedLine(Date.now() + 60 * 60 * 24 * 10 + 1000 * 37)
    setSent(!sent)
    setIsRemain(!isRemain)
  }

  useEffect(() => {
    return () => setValue('')
  }, [])
  return (
    <WithModal showModal={modal} hideModal={() => setModal()} deleteModal>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 20,
        }}
      >
        {!isRemain ? (
          <FormattedMessage id="recordDetails.placeholder">
            {message => (
              <Input placeholder={message} value={value} onChange={e => setValue(e.target.value)} />
            )}
          </FormattedMessage>
        ) : null}

        <Button
          loading={signing}
          style={{ marginLeft: 10 }}
          onClick={!isRemain ? SignRecord : tryAgain}
        >
          {!isRemain ? (
            <FormattedMessage id="recordDetails.verify" />
          ) : (
            <FormattedMessage id="recordDetails.tryAgain" />
          )}
        </Button>
      </div>
      {!isRemain && deadline ? (
        <Countdown
          style={{ marginTop: 10 }}
          title={<FormattedMessage id="recordDetails.time" />}
          value={deadline}
          onFinish={() => setIsRemain(!isRemain)}
          format="mm:ss"
        />
      ) : null}
    </WithModal>
  )
}
