import React from 'react';

import logo from "../../assets/logo.svg";
import { FiSearch, FiLogIn } from "react-icons/fi";
import "./style.css";
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section id="page-home">
            <section className="content">
                <header>
                    <img src={logo} alt="Ecoleta logo" />
                    <Link to="/cadastro">
                        <span>
                            <FiLogIn />
                        </span>
                        Cadastre um ponto de coleta
                    </Link>
                </header>
                <main>
                    <h1>Seu marketplace de coleta de resíduos.</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                    <Link to="/cadastro">
                        <span>
                            <FiSearch />
                        </span>
                        <strong>Cadastre um ponto de coleta</strong>
                    </Link>
                </main>
            </section>

        </section>)
}

export default Home