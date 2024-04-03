
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Dropdown, } from 'antd';
import { useState } from 'react';
import axiosClient from '../../../axios';
import { useModal } from '../../../CustomeHooks';
import DeleteConfirmModal from './DeleteConfirmModal';

const calculateDuration = (currentDate) => {

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date + ' ' + time;

    // Parse strings to Date objects
    let time1 = new Date(dateTime);
    let time2 = new Date(currentDate);

    // Calculate the difference in milliseconds
    let timeDifference = Math.abs(time2 - time1);

    // Convert milliseconds to years, months, days, hours, minutes, and seconds
    let millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Account for leap years
    let years = Math.floor(timeDifference / millisecondsInYear);
    let remainingMilliseconds = timeDifference % millisecondsInYear;

    let millisecondsInMonth = millisecondsInYear / 12; // Approximation
    let months = Math.floor(remainingMilliseconds / millisecondsInMonth);
    remainingMilliseconds %= millisecondsInMonth;

    let millisecondsInDay = 1000 * 60 * 60 * 24;
    let days = Math.floor(remainingMilliseconds / millisecondsInDay);
    remainingMilliseconds %= millisecondsInDay;

    let millisecondsInHour = 1000 * 60 * 60;
    let hours = Math.floor(remainingMilliseconds / millisecondsInHour);
    remainingMilliseconds %= millisecondsInHour;

    let millisecondsInMinute = 1000 * 60;
    let minutes = Math.floor(remainingMilliseconds / millisecondsInMinute);
    remainingMilliseconds %= millisecondsInMinute;

    let seconds = Math.floor(remainingMilliseconds / 1000);

    let result = years > 0
        ? <>{years}{years > 1 ? ' years ' : ' year '}ago</>
        : months > 0
            ? <>{months}{months > 1 ? ' months ' : ' month '}ago</>
            : days > 0
                ? <>{days}{days > 1 ? ' days ' : ' day '}ago</>
                : hours > 0
                    ? <>{hours}{hours > 1 ? ' hrs ' : ' hour '}ago</>
                    : minutes > 0
                        ? <>{minutes}{minutes > 1 ? ' mins ' : ' min '}ago</>
                        : <>Several secs ago</>
    return result
}

export default function PlayListItem({ setPlayLists, playlist, setCurrentPlaylist, currentPlaylist }) {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [isShowing, toggle] = useModal()

    const handleItemClick = () => {
        setDropdownVisible(false);
    };

    const handleDelete = () => {
        console.log(playlist?.id);

        setLoading(true)
        axiosClient
            .delete('/song-lists?id=' + playlist?.id,)
            .then(({ data }) => {
                if (currentPlaylist?.id === playlist?.id) {
                    setCurrentPlaylist(null)
                }
                setPlayLists(playlists => playlists.filter((item) => item.id !== playlist.id));
                setLoading(false);
                setOpen(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setOpen(false);
            })
    }

    return (
        <>
            <Dropdown
                onClick={() => { setCurrentPlaylist(playlist) }}
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
                            <div className='text-white'>
                                <XMarkIcon className='w-6 aspect-square' />
                            </div>
                            <div className='text-white font-semibold'>
                                Detele playlist
                            </div>
                        </div>
                    </div>
                )}
                trigger={['contextMenu']}
            >
                {
                    currentPlaylist == null
                        ?
                        <div className="grid grid-cols-[56px_1fr_1fr] items-center gap-3 hover:bg-[#ffffff0e] hover:cursor-pointer p-1 rounded-sm">
                            <div className="">
                                <img
                                    className="w-14 rounded-md"
                                    src={`${import.meta.env.VITE_GET_IMAGE_URL}/` + playlist.image} />
                            </div>
                            <div className="">
                                <div className="text-white font-semibold">
                                    {playlist?.name}
                                </div>
                                <div className="text-[#ffffff83]">
                                    Playlist • {playlist?.user?.name}
                                </div>
                            </div>
                            <div className="text-white">
                                {calculateDuration(playlist?.created_at)}
                            </div>
                        </div>
                        :

                        <div className="w-full grid grid-cols-[56px_1fr] items-center gap-3 hover:bg-[#ffffff0e] hover:cursor-pointer p-1 rounded-sm">
                            <div className="">
                                <img
                                    className="w-14 rounded-md"
                                    src={`${import.meta.env.VITE_GET_IMAGE_URL}/` + playlist.image} />
                            </div>
                            <div className="w-full">
                                <div className="text-white font-semibold truncate w-full">
                                    {playlist?.name}
                                </div>
                                <div className="text-[#ffffff83]">
                                    Playlist • {playlist?.user?.name}
                                </div>
                            </div>
                        </div>
                }

            </Dropdown>
            <DeleteConfirmModal
                isShowing={isShowing}
                toggle={toggle}
                playlist={playlist}
                handleDelete={handleDelete}
                loading={loading}
            />
        </>
    )
};
