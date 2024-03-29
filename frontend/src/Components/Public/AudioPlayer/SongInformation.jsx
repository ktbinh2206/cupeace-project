import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


function OutlineHeart() {
    return (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>

    )
}
function SolidHeart() {
    return (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 hover:scale-105 hover:cursor-pointer active:scale-100">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
    )
}
function FollowButton({ currentSong, handleFollow, handleUnfollow }) {

    return (
        <div>{
            currentSong?.id ?
                currentSong?.is_followed == true
                    ? <div onClick={handleUnfollow}
                        className="text-blue-50">
                        <SolidHeart />
                    </div>
                    :
                    <div onClick={handleFollow}
                        className="text-blue-50">
                        <OutlineHeart />
                    </div>
                :
                <></>
        }
        </div>
    )
}
export default function SongInformation({
    currentSong = null,
    image,
    handleFollow,
    handleUnfollow,
}) {

    //reference of marquee
    const marqueeRef = useRef(null)

    //Stop animation when user is interacting with it and start
    const handleMouseEnter = () => {
        // Pause the animation on hover
        marqueeRef.current.querySelector('.marquee-content').style.animationPlayState = 'paused';
    }
    // Resumeanimation once the user has finished interacting
    const handleMouseLeave = () => {
        // Resume the animation when mouse leaves
        marqueeRef.current.querySelector('.marquee-content').style.animationPlayState = 'running';
    }

    //Set window size
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    //use for animation in name of song in audio player
    useLayoutEffect(() => {
        if (marqueeRef.current) {
            let containerWidth = marqueeRef.current.offsetWidth;
            let contentElement = marqueeRef.current.querySelector('.marquee-content');

            if (contentElement) {
                let contentWidth = contentElement.offsetWidth;
                if (contentWidth > containerWidth - 8) {
                    let translateValue = ((1 - (containerWidth / contentWidth)) * 100) + 7;
                    let duration = translateValue * 0.5;

                    // Apply animation properties
                    contentElement.style.animationDuration = duration + 's';
                    contentElement.style.setProperty('--translateValue', `-${translateValue}%`);
                    contentElement.style.animationPlayState = 'running'; // Play animation

                    // Add event listeners to pause and resume animation on hover
                    marqueeRef.current.addEventListener('mouseenter', handleMouseEnter);
                    marqueeRef.current.addEventListener('mouseleave', handleMouseLeave);
                } else {
                    // Remove animation properties
                    contentElement.style.animationDuration = 'initial';
                    contentElement.style.removeProperty('--translateValue');
                    contentElement.style.animationPlayState = 'paused'; // Pause animation
                }
            }
        }

        // Cleanup event listeners
        return () => {
            marqueeRef.current.removeEventListener('mouseenter', handleMouseEnter);
            marqueeRef.current.removeEventListener('mouseleave', handleMouseLeave);
        };

    }, [windowSize])

    //Create Event listener window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [])

    return (
        <div className="item-left flex-shrink-0 basis-[33.33%] h-full max-w-1/3 py-2 pl-5">
            <div className="h-full w-full flex items-center p">
                <img src={image || ``}
                    alt="" className="h-[80%] aspect-square object-cover rounded-md  duration-200" />
                {/* Song and Artist */}
                <div className="h-full px-2 flex gap-1 flex-col  song-name-width justify-center">
                    {/* Song Name */}
                    <div className="font-bold text-white w-full overflow-hidden">
                        <div className="marquee w-full mx-2"
                            ref={marqueeRef}>
                            <Link to={'/song/' + currentSong?.id}>
                                <span className="marquee-content hover:underline hover:cursor-pointer">
                                    {currentSong?.name}
                                </span>
                            </Link>
                        </div>
                    </div>
                    <div className="text-slate-400 text-sm mx-2">
                        {currentSong?.artists &&
                            currentSong?.artists.map((artist, index) => {
                                return (
                                    <Link to={'/artist/' + artist?.id} key={index} className="hover:underline">{artist.name}{
                                        currentSong?.artists.length - 1 === index ? `` : `, `}</Link>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="">
                    <FollowButton
                        currentSong={currentSong}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                    />
                </div>
            </div>
        </div>
    )
};
