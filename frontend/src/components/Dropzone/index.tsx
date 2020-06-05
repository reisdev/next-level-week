import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from "react-icons/fi"

import "./styles.css";

interface Props {
    onFileUploaded: (file: File) => void
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
    const [selectedFileUrl, setSelectedFileUrl] = useState("")
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        setSelectedFileUrl(URL.createObjectURL(file))
        onFileUploaded(file)
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone(
        { onDrop, accept: "image/*" })

    return (
        <section className="dropzone" {...getRootProps()}>
            <input accept="image/*" {...getInputProps()} />
            {selectedFileUrl ?
                <img alt="Selected image" src={selectedFileUrl} />
                : <p>
                    <FiUpload />Arraste e solte seus arquivos aqui, ou clique para selecioná-los
                </p>
            }
        </section>
    )
}

export default Dropzone;