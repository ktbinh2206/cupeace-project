import { useContext, useEffect, useState } from "react";
import { useStore } from "../../../../store";
import { Tooltip } from "@material-tailwind/react";
import { PlayIcon, EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import axiosClient from "~/axios";
import { PlaylistsContext } from "./Playlists";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities';



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


const SongItem = ({ song, index, setSongs }) => {
    const [globalState, globalDispatch] = useStore()


    //Just use understand later
    //from here
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: song.index,
        data: { ...song }
    })

    const dndKitCharacterStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
    }
    //to here

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [hover, setHover] = useState(false)
    const { currentPlaylist } = useContext(PlaylistsContext)


    const handleRemoveSong = () => {
        console.log(currentPlaylist);
        console.log(song);
        axiosClient
            .delete('/song-lists/' + currentPlaylist?.id + '/song/' + index)
            .then(({ data }) => {
                setSongs((prevSongs) =>
                    prevSongs.filter((song, i) => i !== index) // Filter out song at target index
                );
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (

        <tr
            ref={setNodeRef}
            style={dndKitCharacterStyles}
            {...attributes}
            {...listeners}
            className="items-center hover:bg-[#ffffff15] rounded-md max-w-full"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <td className="relative text-center py-1 text-[#a7a7a7a7] font-semibold rounded-l-xl w-2 pr-4 pl-2">

                {
                    hover
                        ? <Tooltip
                            className="bg-[#000000d0]"
                            content="Play Song"
                            placement="top"
                            animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                            }}>
                            <PlayIcon
                                className={`cursor-pointer active:scale-95 inset-0 w-5 h-5 text-white`}
                                onClick={() => {
                                    // globalDispatch(actions.setCurrentSong(song));
                                }}
                            />
                        </Tooltip>
                        :
                        <div className="w-5 h-5">
                            {index + 1}
                        </div>

                }

            </td>
            <td className="py-1">
                <div className="flex items-center ">
                    <div className="mr-2 flex-shrink-0 sm:mr-3 w-12 h-12">
                        <img className=" object-cover rounded-xl w-12 h-12" src={`${import.meta.env.VITE_GET_IMAGE_URL}/${song?.image}`} />

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
            <td className="whitespace-nowrap ml-2 px-2 py-3 w-7 rounded-r-xl">
                <Dropdown
                    open={dropdownVisible}
                    onClick={e => e.preventDefault()}
                    onOpenChange={(visible) => setDropdownVisible(visible)}
                    dropdownRender={() => (
                        <div className=' bg-[#313131] p-1 rounded-lg'>

                            <div
                                onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveSong()
                                    setDropdownVisible(false)
                                }}

                                className='hover:bg-[#50505077]
                            rounded-md hover:cursor-pointer
                            w-full grid grid-cols-[15px_1fr] items-center gap-3 p-1'>
                                <div className='text-white'>
                                    <XMarkIcon className='w-6 aspect-square' />
                                </div>
                                <div className='text-white font-semibold'>
                                    Remove Song
                                </div>
                            </div>
                        </div>
                    )}
                    trigger={['click']}
                >
                    <EllipsisHorizontalIcon className="w-7 text-[#ffffff9d] hover:cursor-pointer hover:text-[white] hover:scale-105"
                    />
                </Dropdown>
            </td>
        </tr>
    )
}

export default function SongField({ songs, setSongs }) {

    const tempSongs = songs.map((song, index) => {
        return { ...song, index: index + 1 }; // Spread existing song properties and add index
    });

    const [songData, setSongData] = useState(tempSongs);

    const { currentPlaylist } = useContext(PlaylistsContext)

    useEffect(() => {
        setSongData(tempSongs)
    }, [songs])

    const handleDragEnd = (e) => {
        const { active, over } = e;
        if (active && over && active.id !== over.id) {
            const oldIndex = songData.findIndex(c => c.index === active.id);
            const newIndex = songData.findIndex(c => c.index === over.id);
            let updatedSongs = [...songData];
            const [removed] = updatedSongs.splice(oldIndex, 1);
            updatedSongs.splice(newIndex, 0, removed);

            setSongData(updatedSongs);
            setSongs(updatedSongs)

            axiosClient
                .post('/song-lists/' + currentPlaylist.id + '/update-position?_method=patch', {
                    'songs': updatedSongs
                })
                .then(({ data }) => {
                    console.log(data);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    //Use for catch sensor/event drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    )

    return (
        /**
         * DndContext give the area to drag and drop items
         */
        <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className="w-full px-10 my-3">
                <table className="w-full">
                    <tbody>
                        {/* Sortable with unique id  
                        items must be array of string
                        */}
                        <SortableContext
                            items={songData.map(s => s.index)}
                            strategy={verticalListSortingStrategy}
                        >
                            {songData &&
                                songData.map((song, index) => (
                                    <SongItem
                                        setSongs={setSongs}
                                        key={song.index}
                                        index={index}
                                        song={song} />
                                ))
                            }

                        </SortableContext>
                    </tbody>

                </table>
            </div>
        </DndContext>
    )
}
