import { useState } from "react";
import { useStore } from "../../../../store";
import { Tooltip } from "@material-tailwind/react";
import { PlayIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";

function formatViews(view) {
    if (view) {
        return view.toString().replace(/\B(?=((\d{3})*(\d{3}))+(?!\d))/g, '.');
    }
    return 0;
}

function formatTime(time) {
    if (time) {
        const [hh, mm, ss] = time.split(':');
        return `${hh !== '00' ? hh : ''}${mm}:${ss}`;
    }
}


const SongItem = ({ song, index }) => {
    const [globalState, globalDispatch] = useStore()

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [hover, setHover] = useState(false)

    return (
        <Dropdown
            open={dropdownVisible}
            onOpenChange={(visible) => setDropdownVisible(visible)}
            dropdownRender={() => (
                <div className=' bg-[#313131] p-1 rounded-lg'>

                    <div
                        onClick={() => {
                            handleItemClick()
                            toggle()
                        }}

                        className='hover:bg-[#50505077]
                            rounded-md hover:cursor-pointer
                            w-full grid grid-cols-[15px_1fr] items-center gap-3 p-1'>
                        <div></div>
                        <div className='text-white font-semibold'>
                            Detele playlist
                        </div>
                    </div>
                </div>
            )}
            trigger={['contextMenu']}
        >
            <tr
                className="items-center hover:bg-[#ffffff15] rounded-md max-w-full"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <td className="text-center py-1 text-slate-200 font-semibold rounded-l-xl w-2 pr-4">
                    {index}
                </td>
                <td className="py-1">
                    <div className="flex items-center ">
                        <div className="mr-2 flex-shrink-0 sm:mr-3 w-12 h-12">
                            <img className=" object-cover rounded-xl w-12 h-12" src={`${import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`} />
                            <Tooltip
                                className="bg-[#000000d0]"
                                content="Play Song"
                                placement="top"
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }}>
                                <PlayIcon
                                    className={`${hover ? 'cursor-pointer' : 'hidden'} active:scale-95 relative w-10 h-10 -top-12 left-2 text-white`}
                                    onClick={() => {
                                        globalDispatch(actions.setCurrentSong(song));
                                    }}
                                />
                            </Tooltip>
                        </div>
                        <div>
                            <Link to={'/song/' + song?.id} className="pl-3 text-slate-100 font-[500] hover:underline hover:cursor-pointer truncate">
                                {song?.name}
                            </Link>
                        </div>
                    </div>
                </td>
                <td className="whitespace-nowrap ml-2 px-2 py-3">
                    <div className="text-center text-[#bfbfbf]">{formatViews(song?.views)}</div>
                </td>
                <td className="whitespace-nowrap ml-2 px-2 py-3">
                    <div className="text-center text-[#bfbfbf]">{formatTime(song.duration)}</div>
                </td>
                <td className="whitespace-nowrap ml-2 px-2 py-3 w-7">
                    <EllipsisHorizontalIcon className="w-7 text-white" />
                </td>
            </tr>
        </Dropdown>
    )
}
export default function SongField({ songs }) {
    console.log(songs);
    const [globalState, globalDispatch] = useStore()

    const [hover, setHover] = useState(false)

    return (
        <div className="w-full px-10 my-3">
            <table className="w-full">
                <tbody>
                    {songs &&
                        songs.map((song, index) => (
                            <SongItem
                                key={index}
                                index={index}
                                song={song} />
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
