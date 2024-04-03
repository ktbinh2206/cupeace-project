import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default function DeleteConfirmModal({
    isShowing,
    toggle,
    playlist,
    handleDelete,
    loading
}) {
    return (
        isShowing ?
            <>
                <div
                    onClick={toggle}
                    className="fixed inset-0 z-40 bg-black bg-opacity-50
                              flex justify-center items-center">
                    <div className="flex flex-col gap-3
                               bg-[#282828] w-[420px] h-[255px] p-9 rounded-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-white text-3xl font-bold">
                            Remove from Library ?
                        </h2>
                        <p className="text-white">
                            This action will permantly delete <span className="font-semibold">{playlist?.name}</span> from <span className="font-semibold">Your Library</span>
                        </p>
                        <div className="flex flex-grow justify-end items-end gap-4">
                            <div
                                onClick={toggle}
                                className="text-white font-semibold hover:scale-105  px-3 py-2 hover:cursor-pointer">
                                Cancle
                            </div>
                            <div onClick={handleDelete}
                                className={`
                                bg-[#5449DE] flex gap-2 items-center rounded-xl font-bold px-3 py-2 ${loading ? 'bg-[#5349de81]' : 'hover:cursor-pointer hover:scale-105'}  `}>
                                <ArrowPathIcon className={`w-4 h-4 animate-spin ${loading || 'hidden'}`} />
                                <button>

                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            :
            null
    );
}
