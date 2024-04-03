import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function SearchField() {
    const [searchValue, setSearchValue] = useState('')
    const [data, setData] = useState(null)

    // useEffect(() => {
    //     const search = setTimeout(() => {
            
    //     }, timeout);
    //     return ()=>{
    //         search.remve
    //     }
    // }, [searchValue])

    return (
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
    )
};
