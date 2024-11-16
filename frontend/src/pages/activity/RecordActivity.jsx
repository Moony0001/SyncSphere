import React, { useEffect, useRef, useState } from 'react';
import Map1 from './Map1';
import Map2 from './Map2';
import Map3 from './Map3';
import Form from './Form';
import Map from '../../components/common/Map';
export default function RecordActivity() {
    const [page, setPage] = useState({
        first: true,
        second: false,
        third: false,
        fourth: false,
    });

    const [isRecording, setIsRecording] = useState(false);
    const [selectedSport, setSelectedSport] = useState(null);
    const [timer, setTimer] = useState(0); // Timer in seconds
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [distance, setDistance] = useState(0);

    const timerRef = useRef(null);

    // Start the timer
    const startTimer = () => {
        if (!isTimerRunning) {
            setIsTimerRunning(true);
            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000); // Increment timer every second
        }
    };

    // Pause the timer
    const pauseTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
    };

    // Reset the timer
    const resetTimer = () => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setTimer(0);
    };

    // Cleanup interval on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);
    
    return (
        <>   
            <Map isRecording={isRecording} distance={distance} setDistance={setDistance} />
            {page.first && (
                <Map1 
                setPage={setPage} 
                page={page} 
                setIsRecording={setIsRecording}
                setSelectedSport={setSelectedSport}
                startTimer={startTimer}
                />
            )}
            {page.second && (
                <Map2 
                setPage={setPage} 
                page={page} 
                startTimer={startTimer}
                pauseTimer={pauseTimer}
                setIsRecording={setIsRecording}
                distance={distance} 
                setDistance={setDistance}
                timer={timer}
                />
            )}
            {page.third && (
                <Map3 
                setPage={setPage} 
                page={page}
                startTimer={startTimer}
                pauseTimer={pauseTimer}
                setIsRecording={setIsRecording}
                distance={distance} 
                timer={timer}
                />
            )}
            {
               page.fourth &&
                (<div className='top-level'>
                 <Form selectedSport={selectedSport} finalTime={timer} finalDistance={distance.toFixed(2)}/>
                </div>)
            } 
        </>
    );
}
