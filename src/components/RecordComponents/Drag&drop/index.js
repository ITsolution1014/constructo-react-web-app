import React, { useState } from 'react'
import { Icon } from 'antd'
import Dropzone from 'react-dropzone'

export default function App() {
  const [fileNames, setFileNames] = useState([])
  const handleDrop = acceptedFiles => {
    setFileNames(acceptedFiles.map(file => file.name))
  }

  return (
    <div>
      <Dropzone multiple onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or
              other band files
            </p>
          </div>
        )}
      </Dropzone>
      <div>
        <strong>Files:</strong>
        <ul>
          {fileNames.map(fileName => (
            <li key={fileName}>{fileName}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
