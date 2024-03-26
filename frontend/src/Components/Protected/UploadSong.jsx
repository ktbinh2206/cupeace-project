import { useEffect, useReducer, useRef, useState } from "react";
import StickyNavbar from "../Public/NavBar/NavBar";
import axiosClient from "../../axios";
import { actions, useStore } from "../../store";
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/solid'
import defaultImage from "../../assets/song_icon.png"

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import router from "../../router";


const initArg = {
  songFile: null,
  imageFile: null,
  song: '',
  image: null,
  name: '',
  lyrics: '',
  description: '',
  artistsID: [],
  artists: null,
  inputValue: "",
  selected: [],
  open: false,
  duration: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'setSong':
      return {
        ...state,
        song: action.payload
      }
    case 'setSongFile':
      return {
        ...state,
        songFile: action.payload
      }
    case 'setImage':
      return {
        ...state,
        image: action.payload
      }
    case 'setImageFile':
      return {
        ...state,
        imageFile: action.payload
      }
    case 'setName': // Add this case
      return {
        ...state,
        name: action.payload
      };
    case 'setLyrics': // Add this case
      return {
        ...state,
        lyrics: action.payload
      };
    case 'setDescription': // Add this case
      return {
        ...state,
        description: action.payload
      };
    case 'setArtists':
      return {
        ...state,
        artists: action.payload
      };
    case 'setInputValue':
      return {
        ...state,
        inputValue: action.payload
      };
    case 'setSelected':
      return {
        ...state,
        selected: [...state.selected, action.payload],
        artistsID: [...state.artistsID, action.payload.id]
      };
    case 'setCurrentArtistID':
      return {
        ...state,
        artistsID: [action.payload]
      };
    case 'removeSelected':
      return {
        ...state,
        selected: state.selected.filter(artist => artist.id !== action.payload),
        artistsID: state.artistsID.filter(id => id !== action.payload),
      };
    case 'setOpen':
      return {
        ...state,
        open: !state.open
      };
    case 'setDuration':
      return {
        ...state,
        duration: action.payload
      };

    default:
      return state;
  }
}

function SelectedCard({ dispatch, artist }) {
  return (
    <>
      <div className="border flex items-center rounded-md p-1 gap-1 font-bold">
        {artist?.name}
        <XMarkIcon className="h-4 w-4 hover:cursor-pointer hover:scale-105"
          onClick={() => {
            dispatch({
              type: 'removeSelected',
              payload: artist.id
            })
          }} />
      </div>
    </>
  )
}
export default function UploadSong() {
  const input = useRef()
  const labelRef = useRef()
  const audioRef = useRef()

  const [step, setStep] = useState(0);


  const [stateContext, dispatchContext] = useStore();

  const [state, dispatch] = useReducer(reducer, initArg);

  const handleDrop = (e) => {
    const files = e.dataTransfer.files;
    input.current.files = files;
    labelRef.current.className = " flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"

    e.preventDefault()
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    labelRef.current.className = " bg-gray-600 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    labelRef.current.className = " flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
  };

  const handleChangeSong = (e) => {
    const files = e.target.files[0];
    let song = URL.createObjectURL(files);
    dispatch({
      type: 'setSong',
      payload: song,
    })
    dispatch({
      type: 'setSongFile',
      payload: files
    })
  };


  const handleChangeImage = (e) => {
    const files = e.target.files[0];

    let image = URL.createObjectURL(files);
    dispatch({
      type: 'setImage',
      payload: image
    })
    dispatch({
      type: 'setImageFile',
      payload: files
    })
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient
      .post('/song/upload', {
        name: state.name,
        lyrics: state.lyrics,
        imageFile: state.imageFile,
        description: state.description,
        songFile: state.songFile,
        uploadBy: stateContext.currentUserID,
        artistsID: state.artistsID,
        duration: state.duration,
      },
        {
          headers: {
            "Content-Type": 'multipart/form-data',
          },
        })
      .then((data) => {
        dispatchContext(actions.setNotificationPopup([{
          type: 'success',
          emphasize: 'UPLOAD SUCCESSFULLY',
          content: 'Your song has been uploaded'
        }]))
        // router.navigate('/')
      })
      .catch((err) => {
        dispatchContext(actions.setNotificationPopup([{
          type: 'danger',
          emphasize: 'UPLOAD FAIL',
          content: 'Upload process fail, try later'
        }]))
      })
  }

  useEffect(() => {

    const controller = new AbortController();

    axiosClient
      .get('/user/artist', { signal: controller.signal })
      .then(({ data }) => {
        dispatch({
          type: 'setCurrentArtistID',
          payload: data.id
        })
      })
      .catch(() => {
      })

    axiosClient
      .get('/artists', { signal: controller.signal })
      .then(({ data }) => {
        dispatch({
          type: 'setArtists',
          payload: data
        })
      })
      .catch((err) => {
      })

    return () => controller.abort();

  }, [])

  const imageRef = useRef()

  return (
    <div className=" h-[90vh] w-screen min-w-[817px] flex justify-center py-5 overflow-hidden">
      <div className="w-2/3 min-w-[544.6px] bg-[#1b1b1b6b] rounded-xl overflow-auto">
        <div className="text-center py-4 text-4xl font-bold text-white">Upload your Musics</div>
        <div className="flex items-center justify-center w-full mt-6 px-10">
          <form onSubmit={handleSubmit} encType="multipart/form-data" method="post" className="flex flex-col items-start justify-center gap-3 w-full">
            <input type="text" name="id" id="id" hidden value={stateContext.currentUserID} readOnly />
            {step === 0 && (
              <>
                <div className="w-full flex gap-5">
                  <div>
                    <div className="flex-grow">
                      <div className="relative">
                        <img src={state.image || defaultImage}
                          className={`h-36 w-36 object-cover rounded-xl duration-200`} />
                        <label
                          className="absolute w-10 aspect-square -right-2 -bottom-1 text-white bg-gray-600 rounded-full p-1
                                hover:cursor-pointer hover:scale-105"
                          htmlFor='image-song'
                        >
                          <PencilSquareIcon className="w-full h-full" />
                        </label>
                      </div>
                      <div className="w-1/2">
                        <label htmlFor="image" className=" text-[25px] font-mono font-bold text-white">Image</label>
                        <input type="file" name="image" accept="image/*" className="hidden"
                          ref={imageRef}
                          id='image-song'
                          onChange={handleChangeImage}
                          autoComplete='off'
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <label htmlFor="name" className="text-[25px] font-mono font-bold text-white">Name: </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Name your song"
                      className="pl-4 w-full bg-[white] rounded-lg p-1 text-slate-900"
                      onChange={(e) => {
                        dispatch({
                          type: 'setName',
                          payload: e.target.value
                        })
                      }}
                      autoComplete='off'
                    />
                  </div>

                </div>
                <div className="w-full">
                  <label htmlFor="lyrics" className="text-[25px] font-mono font-bold text-white">Lyrics: </label>
                  <div className="rounded-xl">
                    <SunEditor
                      height="200px"
                      setDefaultStyle="font-family: cursive; font-size: 20px; border-radius:20px;"
                      value={state.lyrics}
                      onChange={(e) => {
                        dispatch({
                          type: 'setLyrics',
                          payload: e
                        })
                      }}
                    />
                  </div>
                </div>
                <div className="w-full">
                  <label htmlFor="description" className="text-[25px] font-mono font-bold text-white">Description: </label>
                  <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="Description"
                    className="pl-4 w-full bg-white rounded-lg p-1 text-white"
                    onChange={(e) => {
                      dispatch({
                        type: 'setDescription',
                        payload: e.target.value
                      })
                    }}
                    autoComplete='off'
                  />
                </div>
                {/* Song file */}
                <div className="w-full">
                  <label htmlFor="description" className="text-[25px] font-mono font-bold text-white">Song File: </label>
                  <label
                    ref={labelRef}
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Audio File</p>
                    </div>
                  </label>
                  <input
                    autoComplete='off'
                    id="dropzone-file"
                    ref={input}
                    type="file"
                    hidden
                    onChange={handleChangeSong}
                    accept="audio/*" />
                  {
                    state.song && (
                      <audio
                        ref={audioRef}
                        className="w-full"
                        src={state.song} controls
                        onLoadedMetadata={() => dispatch({
                          type: 'setDuration',
                          payload: audioRef?.current?.duration
                        })} />)
                  }
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <div className="w-full">
                  <label className="text-[25px] font-mono font-bold text-white">Artist Name:<span className="text-[20px]">(Optional)</span></label>
                  <div
                    className=" flex justify-between gap-2 items-center pl-4 w-full bg-gray-600 rounded-lg p-1 text-white ">

                    {state?.selected.length > 0
                      ?
                      <div className="flex gap-1 flex-wrap">
                        {
                          state?.selected.map((artist) => (
                            <SelectedCard key={artist?.id} dispatch={dispatch} artist={artist} />
                          ))
                        }
                      </div>
                      : <>Select your featured artist</>
                    }
                    <ChevronDownIcon
                      className={`h-7 w-7 font-bold mr-2 ${state.open && 'rotate-180 transform duration-150'} ${!state.open && 'transform duration-150'} hover:cursor-pointer`}
                      onClick={() => dispatch({
                        type: 'setOpen'
                      })} />
                  </div>
                  <ul className={`bg-gray-500 mt-2 rounded-lg  overflow-y-auto ${state.open
                    ? 'max-h-60'
                    : 'max-h-0'}`}>
                    <div className="flex sticky top-0  bg-gray-500">
                      <MagnifyingGlassIcon className="text-white w-6 h-6 m-2 " />
                      <input
                        type="text"
                        placeholder="Enter your artist ..."
                        className="text-white bg-gray-500 p-2 outline-none placeholder:text-white w-full"
                        value={state.inputValue}
                        onChange={e => {
                          dispatch({
                            type: 'setInputValue',
                            payload: e.target.value
                          })
                        }}
                      />
                    </div>
                    {state.artists?.map((artist) => (

                      <li
                        key={artist.id}
                        className={`p-2 pl-5 font-bold text-sm hover:bg-slate-400 hover:text-white
                      ${state.selected.some(selectedArtist => selectedArtist.id === artist.id) && 'hidden'}
                      ${(artist?.name?.toLowerCase().startsWith(state.inputValue.toLowerCase()))
                            ? "block"
                            : "hidden"
                          }`}
                        onClick={() => {
                          dispatch({
                            type: 'setSelected',
                            payload: artist,
                          })
                          dispatch({
                            type: 'setInputValue',
                            payload: ""
                          })
                        }}
                      >
                        {artist.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <div className="w-full flex justify-between pl-4 pr-4">
              {step === 1 && (
                <button onClick={() => setStep(step - 1)} className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 p-3 rounded-lg">
                  Previous
                </button>
              )}

              {step === 0 && (
                <button onClick={() => setStep(step + 1)} className="bg-[#5449DE] hover:bg-[#413bbb] active:bg-[#36309b] p-3 rounded-lg">
                  Next
                </button>
              )}

              {step === 1 && (
                <button type="submit" className="bg-[#5449DE] hover:bg-[#413bbb] active:bg-[#36309b] p-3 rounded-lg">
                  Upload
                </button>
              )}
            </div>
          </form>
        </div>

      </div>

    </div>
  )
}
