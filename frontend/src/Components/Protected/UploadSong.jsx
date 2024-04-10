import { useEffect, useReducer, useRef, useState } from "react";
import StickyNavbar from "../Public/NavBar/NavBar";
import axiosClient from "../../CommonAction/axios";
import { actions, useStore } from "../../store";
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, PencilSquareIcon } from '@heroicons/react/24/solid'
import defaultImage from "../../assets/song_icon.png"

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';

import router from "../../router";
import { Link } from "react-router-dom";


const initArg = {
  songFile: null,
  imageFile: null,
  song: '',
  image: null,
  name: '',
  lyrics: '',
  description: '',
  artistsID: [],
  categoriesID: [],
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
    //Set Name
    case 'setName':
      return {
        ...state,
        name: action.payload
      };
    //Set Lyrics
    case 'setLyrics':
      return {
        ...state,
        lyrics: action.payload
      };
    //Set Description
    case 'setDescription':
      return {
        ...state,
        description: action.payload
      };
    //get Total arists
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
    //set Selected Card and add to state ArtistsID
    case 'setSelected':
      return {
        ...state,
        selected: [...state.selected, action.payload],
        artistsID: [...state.artistsID, action.payload.id]
      };
    //Add category ID
    case 'setCategoriesID':
      return {
        ...state,
        categoriesID: [...state.categoriesID, action.payload.id]
      };
    //remove selected category
    case 'removeSelectedCategory':
      return {
        ...state,
        categoriesID: state.categoriesID.filter(id => id !== action.payload),
      };
    //get artist Id of user and set as default artist
    case 'setCurrentArtistID':
      return {
        ...state,
        artistsID: [action.payload]
      };
    //remove selected artist and also remove state artistsID
    case 'removeSelected':
      return {
        ...state,
        selected: state.selected.filter(artist => artist.id !== action.payload),
        artistsID: state.artistsID.filter(id => id !== action.payload),
      };
    //Open Artist field
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
        <Link to={'/artist/' + artist?.id}
          target="_blank"
          rel="noreferrer noopener"
          className="hover:underline"
        >
          {artist?.name}
        </Link>
        <XMarkIcon className="h-4 w-4 hover:cursor-pointer hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: 'removeSelected',
              payload: artist.id
            })
          }} />
      </div>
    </>
  )
}

function ArtistSelect({ dispatch, state }) {
  return (
    <div className="w-full">
      <label className="text-[25px] font-mono font-bold text-white">Artist Name</label>
      <div
        className=" flex justify-between gap-2 items-center pl-4 w-full bg-[#3c434d]  rounded-sm p-1 text-white "
        onClick={() => dispatch({
          type: 'setOpen'
        })}
      >

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
        />
      </div>
      <ul className={`bg-[#3c434d]  mt-2 rounded-lg  overflow-y-auto ${state.open
        ? 'max-h-60'
        : 'max-h-0'}`}>
        <div className="flex sticky top-0  bg-[#3c434d]  ">
          <MagnifyingGlassIcon className="text-white w-6 h-6 m-2 " />
          <input
            type="text"
            placeholder="Enter your artist ..."
            className="text-white bg-[#3c434d]  p-2 outline-none placeholder:text-white w-full"
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
            className={`p-2 pl-5 font-semibold text-sm hover:bg-slate-600 text-slate-200
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
  )
}

function CategorySelectedCard({ dispatch, setSelected, selected, category }) {
  return (
    <>
      <div className="border flex items-center rounded-md p-1 gap-1 font-bold z-10">

        {category?.name}
        <XMarkIcon className="h-4 w-4 hover:cursor-pointer hover:scale-105"
          onClick={(e) => {
            e.stopPropagation();
            setSelected(selected.filter(selected => selected.id !== category?.id),)
            dispatch({
              type: 'removeSelectedCategory',
              payload: category.id
            })
          }}
        />
      </div>
    </>
  )
}

function CategorySelect({ state, dispatch }) {
  const [open, setOpen] = useState(false)
  const [searchKey, setSearchKey] = useState('')
  const [categories, setCategories] = useState()
  const [selected, setSelected] = useState([])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {

      if (searchKey.trim()) {
        axiosClient
          .get('/categories/search?q=' + searchKey.trim())
          .then(({ data }) => {
            setCategories(data)
          })
          .catch(err => {
            console.log(err);
          })
      } else {
        setCategories(null)
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn)

  }, [searchKey])

  return (
    <>
      <div className="w-full">
        <label className="text-[25px] font-mono font-bold text-white">Song Category<span className="text-[20px]"></span></label>
        <div
          className=" flex justify-between gap-2 items-center pl-4 w-full bg-[#3c434d]  rounded-sm p-1 text-white "
          onClick={() => { setOpen(prev => !prev) }}
        >

          {selected?.length > 0
            ?
            <div className="flex gap-1 flex-wrap">
              {
                selected?.map((category) => (
                  <CategorySelectedCard key={category?.id} dispatch={dispatch} selected={selected} setSelected={setSelected} category={category} />
                ))
              }
            </div>
            : <>Let us know your song style ...</>
          }
          <ChevronDownIcon
            className={`h-7 w-7 font-bold mr-2 ${open && 'rotate-180 transform duration-150'} ${!open && 'transform duration-150'} hover:cursor-pointer`}

          />
        </div>
        <ul className={`bg-[#3c434d]  mt-2 rounded-lg  overflow-y-auto ${open
          ? 'max-h-60'
          : 'max-h-0'}`}>
          <div className="flex sticky top-0  bg-[#3c434d] ">
            <MagnifyingGlassIcon className="text-white w-6 h-6 m-2 " />
            <input
              type="text"
              placeholder="Explore your style"
              className="text-white bg-[#3c434d]  p-2 outline-none placeholder:text-white w-full"
              value={searchKey}
              onChange={e => {
                setSearchKey(e.target.value)
              }}
            />
          </div>
          {categories?.map((category) => (

            <li
              key={category.id}
              className={`p-2 pl-5 font-semibold text-sm hover:bg-slate-600 text-slate-200
                      ${selected?.some(selected => selected.id === category.id) && 'hidden'}`}
              onClick={(e) => {
                setSelected([...selected, category])
                setCategories(null)
                setSearchKey('')
                dispatch({
                  type: 'setCategoriesID',
                  payload: category,
                })
              }}
            >
              {category?.name}
            </li>
          ))}
          {categories?.length == 0 && searchKey &&
            (
              <li
                className="p-2 pl-5 font-semibold text-lg text-[#bccbdf] text-center">
                We are updating your song style...
              </li>
            )}
        </ul>
      </div>
    </>)

}

export default function UploadSong() {
  const input = useRef()
  const labelRef = useRef()
  const audioRef = useRef()

  const [step, setStep] = useState(0);

  const [errors, setErrors] = useState(
    {
      image: null,
      name: null,
      lyrics: null,
      description: null,
      songFile: null,
      categoriesID: null,
    }
  )

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

  const validateData = () => {
    if (!state.name) {

    }
  }

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
        categoriesID: state.categoriesID,
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
                        <label htmlFor="image-song">
                          <img src={state.image || defaultImage}
                            className={`h-36 w-36 object-cover rounded-xl duration-200`} />
                        </label>
                        <label
                          className="absolute w-10 aspect-square -right-2 -bottom-1 text-white bg-gray-600 rounded-full p-1
                                hover:cursor-pointer hover:scale-105"
                          htmlFor='image-song'
                        >
                          <PencilSquareIcon className="w-full h-full" />
                        </label>
                      </div>
                      <div className="w-full pl-3">
                        <label htmlFor="image-song" className=" text-[25px] font-mono font-bold text-white">Image</label>
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
                      className="pl-4 w-full bg-[#3c434d] rounded-sm p-1 text-slate-100"
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
                    className="pl-4 w-full bg-[#3c434d]  rounded-sm p-1 text-slate-100"
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
                    className="flex flex-col items-center justify-center w-full h-40 hover:border-2 hover:border-slate-700 hover:border-dashed rounded-sm cursor-pointer bg-[#3c434d]  hover:bg-gray-100 "
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
                <ArtistSelect dispatch={dispatch} state={state} />
                <CategorySelect dispatch={dispatch} state={state} />
              </>
            )}

            <div className="w-full flex justify-between pl-4 pr-4">
              {step === 1 && (
                <button onClick={() => setStep(step - 1)} className="bg-gray-400 hover:bg-gray-500 active:bg-gray-600 p-3 rounded-lg">
                  Previous
                </button>
              )}

              {step === 0 && (
                <button onClick={() => setStep(step + 1)} className=" text-white bg-[#5449DE] hover:bg-[#413bbb] active:bg-[#36309b] p-3 rounded-lg">
                  Next
                </button>
              )}

              {step === 1 && (
                <button type="submit" className="
               text-white bg-[#5449DE] hover:bg-[#413bbb] active:bg-[#36309b] p-3 rounded-lg">
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
