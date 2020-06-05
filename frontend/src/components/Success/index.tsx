import React from 'react'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

import "./styles.css"
import { useHistory } from 'react-router-dom'

interface Props {
    status: string;
    onClose: () => void
}

const Success: React.FC<Props> = ({ status, onClose }) => {
    const history = useHistory();
    return (
        <section className={`success ${status ? "open" : ""}`}>
            {
                status === "success" ? <section>
                    <FiCheckCircle />
                    <p>Cadastrado com sucesso</p>
                    <button onClick={() => history.push("/")}>Continuar</button>
                </section>
                    : <section>
                        <FiXCircle color={"red"} />
                        <p>Desculpe, tivemos um problema</p>
                        <button onClick={onClose}>Continuar</button>
                    </section>
            }
        </section>
    )
}

export default Success;
