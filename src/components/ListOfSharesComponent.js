import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import '../styles/sharesstyle.css';
import ToggleGroup  from "./BuySellComponent";
import { BuyModal } from "./BuyModal";
import { SellModal } from "./SellModal";

export default function ListOfSharesComponent() {
    const [sharesList, setSharesList] = useState([]);
    const [code, setCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [vol, setVol] = useState(0);
    const [volume, setVolume] = useState([
    ]);

    let url = 'http://localhost:3010/';

    const listShare = (() => {
        if(!(sharesList.length > 0)){
        axios.get(url + 'shares')
            .then((response) => setSharesList(response.data))
            .catch((err) => console.log(err));
        }
    })

    useEffect(() => {
        listShare();
    }, [sharesList]);

    const deleteShare = (id) => {
        console.log('post data');
        axios.delete(url + 'shares/' + id)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
        listShare();
    };

    const addShare = () => {
        console.log('post data');

        setTimeout(() => {
            axios.get(url + 'volumes')
                .then((response) => setVolume(response.data))
                .catch((err) => console.log(err));
        }, 100);

        setTimeout(() => {
            axios.post(url + 'shares', {
                "id": sharesList.length + 1,
                "code": code,
                "companyName": companyName
            })
                .then((response) => console.log(response))
                .catch((err) => console.log(err));
        }, 1000);

        setTimeout(() => {
            axios.post(url + 'volumes', {
                "id": volume.length + 1,
                "code": code,
                "volume": vol
            })
                .then((response) => console.log(response))
                .catch((err) => console.log(err));
        }, 4000);

        listShare();
        setVolume(0);
        setCode('');
        setCompanyName('');
    };

    const [volumeValue, setVolumeValue] = useState(0);

    const getAvailableVolume = (share) => {
        setCode(share.code);
        let volumeObject = [];
        axios.get(url + 'volumes')
            .then((response) => setVolume(response.data))
            .catch((err) => console.log(err));
        volumeObject = volume.filter((volume) => volume.code === share.code)
            .map((shareMap) => shareMap.volume);
        setVolumeValue(volumeObject);
    }

    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSellModal, setShowSellModal] = useState(false);

    const openModal = (type) => {
        if(type === 'Buy')
        setShowBuyModal(showBuyModal => !showBuyModal);
        if(type === 'Sell')
        setShowSellModal(showSellModal => !showSellModal);
    };

    return (
        <>
            <div className="main-grid">
                {
                    sharesList.map((share) => {
                        return (
                            <div className="grid-child">
                                <ToggleGroup openModal={openModal}/>
                                
                                <h2><a className="grid-child" href="#" onClick={(event) => getAvailableVolume(share)}>{share.code}</a></h2>
                                <p>{share.companyName}</p> <button onClick={() => deleteShare(share.id)}> delete</button>
                                {
                                    (volumeValue > 0 && share.code === code) ? <p> Number of Shares:{volumeValue}</p> : <p></p>
                                }
                            </div>
                        );
                    })

                }
                <BuyModal showModal={showBuyModal} setShowModal={setShowBuyModal} />
                <SellModal showModal={showSellModal} setShowModal={setShowSellModal} />
                <div className="grid-child"><h3>Add a new Share</h3>
                    <input type="text" name="code" onChange={((event) => setCode(event.target.value))} placeholder="Share Code.." maxLength={4} />
                    <input type="text" name="companyName" onChange={((event) => setCompanyName(event.target.value))} placeholder="Company name.." maxLength={40} />
                    <input type="text" name="volume" onChange={((event) => setVol(event.target.value))} placeholder="share volume.." maxLength={20} />
                    <button onClick={addShare}>Add</button>
                </div>
            </div>
        </>
    )
}