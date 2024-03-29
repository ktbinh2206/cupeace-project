import { Slider } from "@mui/material"
import VolumeOffIcon from "@mui/icons-material/VolumeOff"
import VolumeMuteIcon from "@mui/icons-material/VolumeMute"
import VolumeDownIcon from "@mui/icons-material/VolumeDown"
import VolumeUpIcon from "@mui/icons-material/VolumeUp"

const SliderStyles = {
    width: 100,
    color: 'white',
    '& .MuiSliderThumb': {
        width: '13px',
        height: '13px'
    },
    '&:hover': {
        cursor: 'auto',
    }
}

//Style VolumeButton base on ammount of volume
function VolumeBtns({ mute, volume, setMute }) {
    return mute
        ? <VolumeOffIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
        : volume <= 20 ? <VolumeMuteIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
            : volume <= 60 ? <VolumeDownIcon style={{ height: 36, width: 30 }} xs={{ color: 'lwhiteme', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
                : <VolumeUpIcon style={{ height: 36, width: 30 }} xs={{ color: 'white', '&:hover': { color: 'white' } }} onClick={() => setMute(!mute)} />
}

export default function RightFunctionButton({ volume, setVolume, mute, setMute }) {
    return (
        <>
            <div className="flex items-center justify-center item-right flex-shrink-0 basis-[33.33%]">
                <div className="text-white">
                    <VolumeBtns
                        className="text-white"
                        mute={mute}
                        volume={volume}
                        setMute={setMute}
                    />
                </div>
                <div className="flex items-center">
                    <Slider
                        style={SliderStyles}
                        aria-label="Volume"
                        value={volume}
                        onChange={(e, v) => {
                            setVolume(v)
                            setMute(false)
                        }} />
                </div>
            </div>
        </>
    )
};
