import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
    onFileUpload: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUpload }) => {
  const[selectedFileUrl, setSelectedFileURL] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileURL(fileUrl);

    onFileUpload(file);
  }, [onFileUpload]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop,
      accept: 'image/*'
    });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*"/>

      {
          selectedFileUrl ?
            <img src={selectedFileUrl} alt="Point thumbnail"/>:
            isDragActive ?
                <p>
                <FiUpload />
                Drop the image here...
                </p> :
                <p>
                <FiUpload />
                Upload an image of the Organization.
                </p>
      }
    </div>
  );
};

export default Dropzone;