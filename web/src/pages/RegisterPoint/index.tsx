import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import api from '../../services/api';
import countryCodes from './countryCodes';
import getCitiesfromCC from '../../services/getCities';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

// Everytime you use useState to create an array or an object
// you need to manually inform the variable type. (Interface).

interface Item {
    id: number;
    title: string;
    image_url: string;
};




const RegisterPoint = () => {
    const [items, setItems] = useState<Item[]>([])
    const [countryCode, setCountryCode] = useState<string[]>([]);
    const [cityList, setCityList] = useState<string[]>([]);

    const [selectedCC, setSelectedCC] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: '',
        apartmentNumber: '',
    })

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();


    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            setInitialPosition([latitude, longitude])
        });
    }, []);

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    useEffect(() => {
        setCountryCode(countryCodes);
    }, []);

    useEffect(() => {
        if (selectedCC === '0') {
            return;
        }
        getCitiesfromCC(selectedCC).then(result => setCityList(result));
        
    }, [selectedCC]);

    function handleSelectCC(event: ChangeEvent<HTMLSelectElement>) {
        const tempSelectedCC = event.target.value;

        setSelectedCC(tempSelectedCC);
    };

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const tempSelectedCity = event.target.value;

        setSelectedCity(tempSelectedCity);
    };

    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([event.latlng.lat, event.latlng.lng]);
    };

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value });
    };

    function handleSelectItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([...selectedItems, id]);
        }

    };

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const { name, email, whatsapp, apartmentNumber} = formData;
        const countryCode = selectedCC;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('latitude', String(latitude));
        data.append('longitude', String(longitude));
        data.append('apartmentNumber', apartmentNumber);
        data.append('countryCode', countryCode);
        data.append('city', city);
        data.append('items', items.join(','));
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        await api.post('points', data);

        alert('Collect Point has been created.');

        history.push('/');
    };

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>
                <Link to="/">
                    <FiArrowLeft /> 
                    Back to Home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Register a <br/> Collect Point</h1>

                <Dropzone onFileUpload={setSelectedFile} />

                <fieldset>
                    <legend>
                        <h2>Information</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Organization Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
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
                        <h2>Address</h2>
                        <span>Select the address in map</span>
                    </legend>

                    <Map center={initialPosition} zoom={4.89} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition}/>
                    </Map>

                    <div className="field">
                        <label htmlFor="apartmentNumber">Apartment Number</label>
                        <input 
                            type="text" 
                            name="apartmentNumber" 
                            id="apartmentNumber"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="countryCode">Country Code</label>
                            <select 
                                name="countryCode" 
                                id="countryCode" 
                                value={selectedCC}
                                onChange={handleSelectCC}
                                >
                                <option value="0">Select a Country Code</option>
                                {countryCode.map(countryCode => (
                                    <option key={countryCode} value={countryCode}>{countryCode}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">City</label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Select a City</option>
                                {cityList.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Collection Items</h2>
                        <span>Select one or more items bellow</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectItem(item.id)}
                                className={selectedItems.includes(item.id) ? 'selected': ''}
                            >
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                        
                    </ul>
                </fieldset>

                <button type="submit">
                    Register Collect Point
                </button>
            </form>
        </div>
    )
}

export default RegisterPoint;