import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './App.css';

function TextToSpeechComponent() {
    const [processId, setProcessId] = useState('');
    const [statusUrl, setStatusUrl] = useState('');
    const [status, setStatus] = useState('');
    const [resultUrls, setResultUrls] = useState([]);
    const [monsterapi, setMonsterapi] = useState([]);
    const [voiceUrl, setVoiceUrl] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [oudio, setOudio] = useState(false);




    let intervalId; // Declaring intervalId outside the useEffect hook



    useEffect(() => {
        if (statusUrl) {
            intervalId = setInterval(checkStatus, 5000); // Check status every 5 seconds
            return () => clearInterval(intervalId); // Cleanup on component unmount or when status is "COMPLETED"
        }
    }, [statusUrl]);

    const fetchData = () => {
        setSpinner(true);
        
        const form = new FormData();
        form.append('voice_clone', 'false');
        form.append('prompt', monsterapi);

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjZjYzkxNWQwODYxNmMwYTg1OGU2Y2Q5YTQ3NjJjNjBiIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMDdUMTg6MDM6NTYuMTIzMjI0In0.HdEuxhoVbK40qvpRoGicCs0VX42qr4iKdpjKzPPGBMQ'
            },
            body: form
        };

        fetch('https://api.monsterapi.ai/v1/generate/sunoai-bark', options)
            .then(response => response.json())
            .then(response => {
                setProcessId(response.process_id);
                setStatusUrl(response.status_url);
            })
            .catch(err => console.error(err));
    };

    const checkStatus = () => {
        fetch(statusUrl, {
            headers: {
                'authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6IjZjYzkxNWQwODYxNmMwYTg1OGU2Y2Q5YTQ3NjJjNjBiIiwiY3JlYXRlZF9hdCI6IjIwMjQtMDItMDdUMTg6MDM6NTYuMTIzMjI0In0.HdEuxhoVbK40qvpRoGicCs0VX42qr4iKdpjKzPPGBMQ',
                'accept': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                setStatus(response.status);
                console.log(response);
                if (response.status === 'COMPLETED') {
                    // Process completed successfully
                    console.log('Process completed successfully');
                    clearInterval(intervalId); // Stop checking the status
                    setSpinner(false);
                    setOudio(true);
                    fetchResultUrls(response.result.output);
                    setVoiceUrl(response.result.output);
                } else if (response.status === 'FAILED') {
                    // Process failed
                    console.log('Process failed');
                } else {
                    // Process still in progress or queued
                    console.log('Process still in progress or queued');
                }
            })
            .catch(err => console.error(err));
    };

    const fetchResultUrls = (outputUrls) => {
        setResultUrls(outputUrls);
    };

    const playSpeech = (urls) => {
        urls.forEach(url => {
            const audio = new Audio(url);
            audio.play();
        });
    };

    const stopSpeech = () => {
        // Pause all speech currently playing
        document.querySelectorAll('audio').forEach(audio => audio.pause());
    };

    ////////////////////////////////////////////////////////

    const [rate, setRate] = useState(1); // Initial speed rate

    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [textInput, setTextInput] = useState("");
    const [Btn, setBtn] = useState(false);


    useEffect(() => {
        const handleVoicesChanged = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Set a default voice (you can choose a specific one)
            setSelectedVoice(availableVoices.find(voice => voice.lang === 'en-US'));
        };

        // Add event listener for the 'voiceschanged' event
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

        // Initial fetch of voices
        handleVoicesChanged();

        // Clean up the event listener on component unmount
        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        };
    }, []);


    const handleButtonClick = () => {

        const textToConvert = textInput; // Replace with your text

        const value = new SpeechSynthesisUtterance(textToConvert);

        if (selectedVoice) {
            value.voice = selectedVoice;
        }

        value.rate = rate; // Set the speed rate
        window.speechSynthesis.speak(value);
    };
    const handlestaticBtn = (btn) => {

        const textToConvert = btn; // Replace with your text

        const value = new SpeechSynthesisUtterance(textToConvert);

        if (selectedVoice) {
            value.voice = selectedVoice;
        }

        value.rate = rate; // Set the speed rate
        window.speechSynthesis.speak(value);
    };

    const handleRateChange = (newRate) => {
        setRate(newRate);
    };

    const handleVoiceChange = (newVoice) => {
        setSelectedVoice(newVoice);
    };








    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <nav>
                        <div
                            className='banner-inner h1'
                            style={{
                                backgroundColor: '',
                                display: 'inline-block',
                                paddingTop: 0,
                                animation: 'moveLeftToRight 10s linear infinite',
                            }}
                        >
                            <div className='myname'>
                                Ahmad Cbeili tarafından geliştirilmekte
                            </div>
                        </div>
                    </nav>

                    <div className='row'>
                        <div className='col-md-6 col-12 h-line'>
                            <div style={{ paddingTop: 30 }}>

                                {/*"ssssasfsssssssssssssssssss"//////////////////////////////////////////////////////////////////////////*/}

                                <div style={{ fontSize: 30 }}>
                                    Bu kısım, metnin bir sesini MONSTER API tarafından oluşturmak içindir.
                                </div>

                                <div style={{ paddingTop: 20 }}>
                                    <label>
                                        Metni Girin:
                                        <textarea
                                            value={monsterapi}
                                            onChange={(e) => setMonsterapi(e.target.value)}
                                            style={{ width: '100%', height: '150px', resize: 'none' }}
                                            placeholder="Lütfen MONSTER API'si ile sese dönüştürmek için bir metin girin"
                                        />
                                    </label>
                                    <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                                        <button
                                            style={{ color: '', backgroundColor: 'greenyellow', borderRadius: 10 }}
                                            onClick={fetchData}>Sesi oluştur</button>
                                    </div>

                                    {spinner ? (
                                        <Spin style={{ fontSize: 40 }} indicator={<LoadingOutlined />} />
                                    ) : (
                                       ""
                                    )}

                                    {oudio ? (
                                        <div style={{ paddingTop: 20 }}>
                                        <ReactAudioPlayer
                                            src={voiceUrl}
                                            autoPlay
                                            controls
                                        />
                                    </div>
                                    ) : (
                                       ""
                                    )}

                                   

                                   


                                </div>











                                {/*"ssssasfsssssssssssssssssss"//////////////////////////////////////////////////////////////////////////*/}





                            </div>
                        </div>
                        <div className='col-md-6 col-12 v-line' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                            <div>
                                <div className='constantBtn' style={{ width: '100%' }}>
                                    <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                        <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("I am ahmad cbeılı")}>I am ahmad cbeılı</button>
                                    </div>
                                    <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                        <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("Türkçeyi daha iyi anlamak için lütfen türkçe dilini seçin")}>Türkçeyi daha iyi anlamak için lütfen türkçe dilini seçin</button>
                                    </div>
                                    <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                        <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("For more understanding of English, please select English language")}>For more understanding of English, please select English language</button>
                                    </div>
                                    <div className='col-md-12' style={{ padding: 5, borderRadius: 20 }}>
                                        <button style={{ borderRadius: 7 }} onClick={() => handlestaticBtn("Bir şeyler yazmayı deneyin, Bu butonlara da tıklayabilirsiniz")}>Bir şeyler yazmayı deneyin, bu butonlara da tıklayabilirsiniz</button>
                                    </div>
                                </div>


                                <div style={{ paddingTop: 20 }}>
                                    <label>
                                        Metni Girin:
                                        <textarea
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            style={{ width: '100%', height: '150px', resize: 'none' }}
                                            placeholder="Metninizi buraya yazın"
                                        />
                                    </label>
                                </div>


                                <div style={{ backgroundColor: '', paddingBottom: 30, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div style={{ paddingRight: 15 }}>Hız:</div>
                                    <label>

                                        <div>
                                            <input
                                                type="range"
                                                min="0.1"
                                                max="3"
                                                step="0.1"
                                                value={rate}
                                                onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                                                style={{ width: '100%' }}
                                            />

                                        </div>

                                    </label>
                                    <div>{rate.toFixed(1)}</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", width: '100%', paddingLeft: 10 }}>
                                    <div style={{ marginRight: -20 }}> Dil:</div>
                                    <div>
                                        <label>
                                            <select
                                                value={selectedVoice ? selectedVoice.name : ''}
                                                onChange={(e) => {
                                                    const selectedVoiceName = e.target.value;
                                                    const newSelectedVoice = voices.find(voice => voice.name === selectedVoiceName);
                                                    handleVoiceChange(newSelectedVoice);
                                                }}
                                                style={{ width: '85%' }}
                                            >
                                                {voices.map((voice) => (
                                                    <option key={voice.name} value={voice.name}>
                                                        {voice.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: "center", alignItems: "center", paddingTop: 50 }}>
                                    <button
                                        style={{ color: '', backgroundColor: 'greenyellow', borderRadius: 10 }}
                                        onClick={handleButtonClick}>Konuşmaya Dönüştür</button>

                                </div>


                            </div>
                        </div>
                    </div>

                </header>
            </div>

        </Router>
    );
}


export default TextToSpeechComponent;
