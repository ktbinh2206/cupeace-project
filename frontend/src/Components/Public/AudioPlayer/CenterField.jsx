import { PlayCircleIcon, ForwardIcon, BackwardIcon, PauseCircleIcon } from "@heroicons/react/24/solid";
import { Slider } from "@mui/material";
import { useEffect, useRef, useState } from "react";



//Format time
const calculateTime = (value) => {
    if (isNaN(value) || !isFinite(value) || value === 0) {
        return '00:00'; // Return a default value or handle the case appropriately
    }
    const minutes = Math.floor(value / 60) < 10 ? `0${Math.floor(value / 60)}` : Math.floor(value / 60)

    const seconds = Math.floor(value % 60) < 10 ? `0${Math.floor(value % 60)}` : Math.floor(value % 60)

    return `${minutes}:${seconds}`
}

const ProgressBar = ({ elapsed, handleProgressChange, duration }) => {
    return (
        <>
            <div className=" text-white text-center">
                {calculateTime(elapsed)}
            </div>
            <div className="flex-grow mb-10">
                <Slider
                    aria-label="time-indicator"
                    size="small"
                    value={isNaN(elapsed) ? 0 : elapsed}
                    max={isNaN(duration) ? 0 : duration}
                    defaultValue={0}
                    onChange={handleProgressChange}
                    sx={{
                        color: '#fff',
                        height: 4,
                        '& .MuiSlider-thumb': {
                            width: 8,
                            height: 8,
                            transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                            '&::before': {
                                boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                            },
                            '&:hover, &.Mui-focusVisible': {
                                boxShadow:
                                    'rgb(255 255 255 / 16%)'
                                ,
                            },
                            '&.Mui-active': {
                                width: 20,
                                height: 20,
                            },
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.28,
                        },
                    }}
                />
            </div>
            <div className="text-white text-center">
                {calculateTime(duration)}
            </div>
        </>
    )
}

export default function CenterField({
    src,
    mute,
    volume,
    handleNextSong,
    handlePreviousSong,
    position,
    handleStream,
}) {


    const audioPlayer = useRef();

    const [streamingTime, setStreamingTime] = useState(0)

    const [timestamp, setTimestamp] = useState(0)
    const [totalTime, setTotalTime] = useState(0)

    const [isPlaying, setIsPlaying] = useState();
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);


    const timeUpdate = (e) => {
        const elapsedTime = Math.floor(audioPlayer?.current?.currentTime)
        setElapsed(elapsedTime);
        setStreamingTime(e.target.currentTime - timestamp);
    }

    useEffect(() => {
        // Function to handle 'loadedmetadata' event
        const handleLoadedMetadata = () => {
            // Get the duration of the audio
            const duration = Math.floor(audioPlayer.current.duration);
            // Set the duration state
            setDuration(duration);
            // Play the audio
            audioPlayer.current.play().catch(error => {
                console.error('Failed to play audio:', error);
            });

            // Set the playing state to true
            setIsPlaying(true);
        };

        // Add 'loadedmetadata' event listener to the audio element
        audioPlayer.current.addEventListener('loadedmetadata', handleLoadedMetadata);
        let finalDuration = totalTime + streamingTime;
        if (finalDuration > 30) {
            handleStream(finalDuration);
        }
        setStreamingTime(0)
        setTotalTime(0)
        setTimestamp(0)
        // Cleanup function to remove the event listener
        return () => {
            audioPlayer?.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [src]);

    //Calculate duration and elapsedTime
    useEffect(() => {

        if (audioPlayer) {
            audioPlayer.current.volume = volume / 100;
        }

    }, [volume, audioPlayer])

    //Click Button Play and Stop
    const togglePlay = () => {
        if (!isPlaying) {
            audioPlayer.current.play()
        } else {
            audioPlayer.current.pause()
        }
        setIsPlaying(prev => !prev)
    }

    //Handle when use change progress bar
    const handleProgressChange = (e) => {
        let value = e.target.value
        audioPlayer.current.currentTime = value
        setTimestamp(value)
        setTotalTime(totalTime + streamingTime)

        audioPlayer.current.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
        setIsPlaying(true)

    }

    return (
        <>
            <audio src={src} ref={audioPlayer} muted={mute} onTimeUpdate={timeUpdate} onEnded={handleNextSong} />
            <div className="flex flex-col item-center py-2 h-full flex-shrink-0 basis-[33.33%]">
                <div className=" flex justify-center items-center gap-4">
                    <div className="flex flex-grow justify-end">
                        <div className="backward">
                            <button className="w-10 aspect-square text-white">
                                <BackwardIcon
                                    className={`${position == 0 ? 'opacity-40 hover:cursor-default' : 'hover:scale-105 active:scale-95 transition-all transform '} `}
                                    onClick={handlePreviousSong}
                                />
                            </button>
                        </div>
                    </div>
                    <div className="">
                        <button className="w-10 aspect-square text-white" onClick={() => isPlaying ? setIsPlaying(false) : setIsPlaying(true)}>

                            {!isPlaying
                                ? <PlayCircleIcon className="transition-all transform hover:scale-110" onClick={togglePlay} />
                                : <PauseCircleIcon className="transition-all transform hover:scale-110" onClick={togglePlay} />
                            }

                        </button>
                    </div>
                    <div className="flex flex-grow">
                        <div className="forward">
                            <button className="w-10 aspect-square text-white">
                                <ForwardIcon
                                    className="transition-all transform hover:scale-105 active:scale-95"
                                    onClick={handleNextSong}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-full flex gap-4 ">
                    <ProgressBar
                        elapsed={elapsed}
                        handleProgressChange={handleProgressChange}
                        duration={duration} />
                </div>
            </div>
        </>

    )
};
