import React, { useState, useEffect, useCallback, ChangeEvent, FormEvent, useMemo } from 'react';

import logo from "../../assets/logo.svg"
import "./style.css"
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi"
import MapComponent from '../../components/Map';
import Dropzone from '../../components/Dropzone';
import Success from '../../components/Success';

interface Item {
    id: number
    title: string;
    imageUrl: string;
}

interface UF {
    initials: string;
}

const CreatePoint = () => {
    const history = useHistory();
    const [status, setStatus] = useState('');
    const [items, setItems] = useState<Item[]>([]);
    const [selectedUF, setSelectedUF] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();
    const [ufs, setUFs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: ""
    })
    const [position, setPosition] = useState<{ latitude: number, longitude: number }>({
        latitude: 0,
        longitude: 0
    });

    const getItems = async () => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/items`);
        setItems(await res.json());

        const res2 = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`);
        setUFs((await res2.json()).map((uf: any) => uf.sigla));
        alert()
    }

    const createPoint = async (e: FormEvent) => {
        e.preventDefault()
        const payload = new FormData();

        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("whatsapp", formData.whatsapp);
        payload.append("city", selectedCity);
        payload.append("uf", selectedUF);
        payload.append("items", selectedItems.join(","));
        payload.append("latitude", position.latitude.toString());
        payload.append("longitude", position.longitude.toString());
        if (selectedFile) payload.append("image", selectedFile)

        const res = await fetch(`${process.env.REACT_APP_API_URL}/points`, {
            method: "POST",
            body: payload
        });
        if (await res.status !== 200) setStatus("failure")
        else setStatus("success")
        history.push("/");
    }

    const handleImage = (file: File) => setSelectedFile(file)

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleItemSelect = (id: number) => {
        const index = selectedItems.indexOf(id);
        if (index >= 0) setSelectedItems(selectedItems.filter(item => item != id))
        else setSelectedItems([...selectedItems, id])
    }

    const getCities = useCallback(async () => {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
        setCities((await res.json()).map((city: any) => city.nome));
    }, [selectedUF]);

    const isFormValid = useMemo(() => {
        if (!selectedUF || !selectedCity ||
            Object.values(formData).every(field => !field)
            || selectedItems.length === 0) return false;
        return true
    }, [selectedItems, selectedUF, selectedCity, formData]);

    useEffect(() => {
        if (selectedUF !== '0') getCities();
        navigator.geolocation.getCurrentPosition((p) => {
            setPosition({
                latitude: p.coords.latitude,
                longitude: p.coords.longitude
            })
        })
    }, [selectedUF])

    useEffect(() => {
        getItems();
    }, [])

    return <section id="page-create-point">
        <Success status={status} onClose={() => setStatus("")} />
        <header>
            <img src={logo} alt="Ecoleta" />
            <Link to="/">
                <FiArrowLeft />
                Voltar para a Home
            </Link>
        </header>
        <form onSubmit={createPoint}>
            <h1>Cadastro do<br /> ponto de coleta</h1>
            <Dropzone onFileUploaded={handleImage} />
            <fieldset>
                <legend>
                    <h2> Dados </h2>
                </legend>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="name">
                            Nome da entidade
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="whatsapp">
                            WhatsApp
                        </label>
                        <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    <h2>Endereço</h2>
                    <span>Selecione o endereço no mapa</span>
                </legend>
                <MapComponent
                    position={position}
                    onMark={(latitude: number, longitude: number) => {
                        setPosition({ latitude, longitude })
                    }}
                />
                <div className="field-group">
                    <div className="field">
                        <label htmlFor="uf"></label>
                        <select
                            required
                            name="uf"
                            id="uf"
                            onChange={(e) => setSelectedUF(e.target.value)}
                        >
                            <option value="0">Escolha um estado</option>
                            {ufs.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="city"></label>
                        <select
                            required
                            name="city"
                            id="city"
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value={0}>Escolha uma cidade</option>
                            {cities.map((city) =>
                                <option key={city} value={city}>{city}</option>
                            )}
                        </select>
                    </div>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    <h2>Ítens de Coleta</h2>
                    <span>Selecione um ou mais itens abaixo</span>
                </legend>
                <ul className="items-grid">
                    {items.map((item) =>
                        (<li
                            key={item.id}
                            className={selectedItems.includes(item.id) ?
                                "selected" : ""}
                            onClick={() => handleItemSelect(item.id)}
                        >
                            <img src={item.imageUrl} alt={item.title} />
                            <span>{item.title}</span>
                        </li>)
                    )}
                </ul>
            </fieldset>
            <button type="submit" disabled={!isFormValid}>
                Cadastrar ponto de coleta
            </button>
        </form>
    </section>
}

export default CreatePoint;
