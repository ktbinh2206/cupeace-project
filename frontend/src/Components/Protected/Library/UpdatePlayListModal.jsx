import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import axiosClient from "../../../axios";

export default function UpdatePlayListModal({
    isShowing,
    toggle,
    playlist,
    setCurrentPlaylist,
    setPlaylists
}) {

    const [data, setData] = useState({
        name: playlist?.name,
        description: playlist?.description || '',
        image: playlist?.image,
    })
    const [loading, setLoading] = useState(false)
    const [src, setSrc] = useState(`${import.meta.env.VITE_GET_IMAGE_URL}/` + playlist?.image)
    const [focus, setFocus] = useState({
        name: false,
        description: false
    })

    useEffect(() => {
        setData({
            name: playlist?.name,
            description: playlist?.description || '',
            image: playlist?.image,
        })
    }, [playlist])

    const handleChangeImage = (e) => {
        const files = e.target.files[0];
        let image = URL.createObjectURL(files);
        setSrc(image)
        setData({ ...data, image: files })
    }

    //memory leak
    useEffect(() => {
        return () => {
            // Revoke the object URL when the component unmounts
            if (src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [src]);

    const handleClose = () => {
        toggle()
        setSrc(`${import.meta.env.VITE_GET_IMAGE_URL}/` + playlist?.image)
        setData({
            name: playlist?.name,
            description: playlist?.description || '',
            image: playlist?.image,
        })
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        if (typeof (data.image) !== "string" || data.name !== playlist.name || data.description !== playlist.description) {
            setLoading(true)
            console.log(data);
            axiosClient
                .post('/song-lists/' + playlist.id + '?_method=PATCH',
                    {
                        'name': data.name,
                        'description': data.description,
                        'image': data.image,
                    }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then(({ data }) => {
                    setCurrentPlaylist(data?.data);
                    setSrc(`${import.meta.env.VITE_GET_IMAGE_URL}/` + data?.data?.image)
                    setPlaylists(prevPlaylists => {
                        return prevPlaylists.map(item => item.id === data.data.id ? data.data : item);
                    });
                })
                .catch((err) => { console.log(err) })
                .finally(() => {
                    setLoading(false)
                    toggle()
                })
        }
        else {
            toggle()
        }
    }

    return (
        isShowing
            ?
            <div
                onClick={handleClose}
                className="fixed inset-0 z-[99999] bg-black bg-opacity-50
                flex justify-center items-center">
                <form
                    onSubmit={handleUpdate}
                    encType="multipart/form-data"
                    method="patch"
                    onClick={e => e.stopPropagation()}
                    className="bg-[#282828] w-[524px] h-[384px] rounded-xl">
                    <div className="flex justify-between items-center p-6">
                        <div className="text-white font-bold text-2xl">
                            Change Playlist Information
                        </div>
                        <div
                            onClick={handleClose}
                            className="rounded-full cursor-pointer hover:bg-[#0000002a] p-1">
                            <XMarkIcon className="w-7 aspect-square text-[#ffffff86] " />
                        </div>
                    </div>
                    <div className="flex px-6 gap-2">
                        <label
                            htmlFor="playlist-image"
                            className="w-[180px] aspect-square hover:cursor-pointer">
                            <input
                                onChange={handleChangeImage}
                                type="file"
                                accept="image/*"
                                id="playlist-image"
                                hidden={true} />
                            <img
                                className="w-[180px] aspect-square rounded-md"
                                src={src} />
                        </label>
                        <div className="flex-grow flex flex-col gap-y-3">
                            <div className="w-full relative">
                                <div className={`${focus.name ? "" : "opacity-0"} transform duration-300 absolute left-3 z-20 -translate-y-[9px] text-white font-bold text-xs bg-gradient-to-b from-[#282828] via-[#282828] to-[transparent]`}>Name</div>
                                <input
                                    onFocus={() => setFocus({ ...focus, name: true })}
                                    onBlur={() => setFocus({ ...focus, name: false })}
                                    className="bg-[#3e3e3e] focus:bg-[#313131] focus:outline-none focus:border focus:border-[#ffffff2d] w-full h-[40px] rounded-md px-3 text-white font-semibold"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>

                            <div className="w-full relative flex-grow ">
                                <div className={`${focus.description ? "" : "opacity-0"} transform duration-300  absolute left-3 z-20 -translate-y-[9px] text-white font-bold text-xs bg-gradient-to-b from-[#282828] via-[#282828] to-[transparent]`}>Description</div>
                                <textarea
                                    onFocus={() => setFocus({ ...focus, description: true })}
                                    onBlur={() => setFocus({ ...focus, description: false })}
                                    className="bg-[#3e3e3e] w-full h-full focus:outline-none focus:bg-[#313131]  focus:border focus:border-[#ffffff2d] rounded-md px-3 py-1 text-white
                                                resize-none placeholder:text-[#ffffff4f]"
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData({ ...data, description: e.target.value })}
                                    placeholder="Add description (not require)"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end px-6 py-10">
                        <button
                            disabled={loading}
                            type="submit"
                            className={`flex items-center gap-3 text-white font-bold ${loading ? 'bg-[#776fdd]' : 'bg-[#5449DE]'} hover:scale-105 hover:cursor-pointer  px-4 py-2 rounded-2xl`}>
                            <ArrowPathIcon className={`w-4 h-4 animate-spin ${loading ? '' : 'hidden'}`} />
                            Save
                        </button>
                    </div>
                </form>
            </div>
            : null
    )
}
