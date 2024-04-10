import { MagnifyingGlassIcon, PlayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useContext, useEffect, useState } from "react";
import axiosClient from "../../../../CommonAction/axios";
import { actions, useStore } from "../../../../store"
import { Tooltip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { PlaylistsContext } from "./Playlists";


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

const SongItem = ({ song, index, playlist, setPlayList }) => {
    const [globalState, globalDispatch] = useStore()
    const { setPlaylists } = useContext(PlaylistsContext)

    const [hover, setHover] = useState(false)

    const handleAddClick = () => {
        console.log(playlist);
        axiosClient
            .post('/song-lists/' + playlist?.id + '/song/' + song?.id)
            .then(({ data }) => {
                setPlayList(data)
                setPlaylists(prevPlaylists => {
                    const newList = prevPlaylists?.map(item => {
                        // Check if playlist needs replacement
                        if (item.id === playlist.id) {
                            // Replace playlist with new data (modify existing properties or create new object)
                            return data
                        } else {
                            // Keep playlist unchanged
                            return item
                        }
                    });

                    return newList
                })
                console.log(data);
            })
            .catch(console.error)
    }

    return (
        <tr
            className="items-center hover:bg-[#ffffff15] rounded-md max-w-full"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <td className="text-center py-1 text-slate-200 font-semibold rounded-l-xl">
                {index}
            </td>
            <td className="py-1">
                <div className="flex items-center ">
                    <div className="mr-2 flex-shrink-0 sm:mr-3 w-14 h-14">
                        <img className=" object-cover rounded-xl w-14 h-14" src={`${import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`} />
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
                <div className="text-center text-[#bfbfbf]">{formatTime(song?.duration)}</div>
            </td>
            <td className=" w-[71px] whitespace-nowrap ml-2 px-2 py-3 rounded-r-xl">
                <div
                    className="w-[71px] text-white font-bold border border-slate-400 px-2 py-1 text-center rounded-lg bg-[#5449de]
                        hover:cursor-pointer hover:scale-105 hover:bg-[#5349de75]"
                    onClick={handleAddClick}>
                    Add
                </div>
            </td>
        </tr>
    )
}
export default function SearchField({ playlist, setPlayList }) {
    const [searchValue, setSearchValue] = useState('')
    const [data, setData] = useState(null)

    useEffect(() => {
        if (searchValue) {
            const search = setTimeout(() => {
                axiosClient
                    .get('/search?q=' + searchValue.trim())
                    .then(({ data }) => {
                        setData(data.songs)
                        console.log(data);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }, 500);
            return () => {
                clearTimeout(search)
            }
        } else {
            setData(null)
        }
    }, [searchValue])

    useEffect(() => {
        setSearchValue('')
    }, [playlist.id])

    return (
        <div className="min-h-96 px-10 ">
            <div className="flex justify-between items-center">
                <div className="flex flex-col gap-3">
                    <div className="text-white font-semibold text-2xl">
                        Add songs for your playlist
                    </div>
                    <div className="flex h-[40px] w-[511px] bg-[#2e2e2e] rounded-md px-2 gap-3 ">
                        <MagnifyingGlassIcon className="w-6 aspect-square text-[#bfbfbf]" />
                        <input
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            type="text"
                            className="outline-none flex-grow bg-[#2e2e2e] text-[#bfbfbf] placeholder:text-[#bfbfbf] placeholder:font-semibold"
                            placeholder="Find songs "
                        />
                    </div>
                </div>
                <div>
                    <XMarkIcon className="w-8 text-[#bfbfbf]" />
                </div>
            </div>
            <table className="w-full">
                <tbody>
                    {data &&
                        data?.map(song => (
                            <SongItem
                                key={song.id}
                                song={song}
                                playlist={playlist}
                                setPlayList={setPlayList}
                            />
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
};
