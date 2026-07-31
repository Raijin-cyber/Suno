import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import AvatarPreview from "../components/Profile/AvatarPreview";

const baseClass = "bg-white/50";
const hoverAndActiveEffect = "hover:scale-105 active:scale-95 transition-all duration-200";
const hoverBackgroundEffect = "hover:bg-black/20 active:bg-black/25 rounded-full transition-all duration-100";

const UserProfile = ({ isOnline, avatar }) => {
    const navigate = useNavigate();
    const profileData = useOutletContext();
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);

    const navigationHandler = useCallback(() => {
        navigate(-1);
    }, []);

    return (
        <aside className="animate-fade-in animate-duration-100 fixed inset-0 z-50 flex items-end justify-center md:static md:h-full md:shrink-0 md:items-stretch">
            <div className="relative flex h-screen w-full flex-col overflow-hidden md:h-full md:rounded-none">
                {/* Mobile drag handle */}
                <div className="absolute left-1/2 top-3 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-[#fc94af]/40 md:hidden" />

                {/* Header */}
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#fc94af]/10 px-5 pt-3 md:pt-0">
                    <button 
                        onClick={navigationHandler}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-[#fc94af]/10 hover:text-[#e87596] ${hoverBackgroundEffect}`}
                    >
                        <img src="/assets/icons/back_arrow.svg" alt="back" />
                    </button>
                    <h1 className="text-sm font-semibold tracking-wide text-slate-800">Profile info</h1>
                    <div className="flex items-center g-x-2">
                        <button className={`flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-[#fc94af]/10 hover:text-[#e87596] ${hoverBackgroundEffect}`}><img src="/assets/icons/edit.svg" alt="edit" /></button>
                        <button className={`flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-500 transition hover:bg-[#fc94af]/10 hover:text-[#e87596] ${hoverBackgroundEffect} `}><img src="/assets/icons/vertical_ellipsis.svg" alt="vertical_ellipsis" /></button>
                    </div>
                </header>

                {/* Scrollable profile content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pb-8">
                    {/* Profile section */}
                    <section className="flex flex-col items-center py-8">
                        {/* Avatar */}
                        <div
                            onClick={() => setIsAvatarOpen(true)} 
                            className="cursor-pointer relative h-28 w-28 rounded-full bg-linear-to from-[#fc94af] via-[#fca8bd] to-[#ffe1e8] p-1 shadow-[0_12px_30px_rgba(252,148,175,0.28)]">
                            <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#aa336a] bg-[#ffe8ee] text-3xl font-bold text-[#d96487]"><img className="rounded-full" src={`${profileData.avatar ? profileData.avatar : `/avatars/${profileData.username[0].toUpperCase()}.png`} `} alt="avatar" /></div>
                            <span className="animate-pulse absolute bottom-1 right-1 h-5 w-5 rounded-full border-3 border-[#fffafd] bg-emerald-600" />
                        </div>

                        {/* Avatar Preview */}
                        {isAvatarOpen && 
                            <AvatarPreview 
                                preview={`${profileData.avatar ? profileData.avatar : `/avatars/${profileData.username[0].toUpperCase()}.png`} `}
                                setIsAvatarOpen={setIsAvatarOpen} 
                            />
                        }

                        <h2 className="mt-4 text-3xl font-semibold tracking-tight">{profileData.name || <i>Set a Name</i>}</h2>
                        <p className="mt-1 text-xl text-black/70">{`@${profileData.username}` || ''}</p>
                        <p className="mt-3 max-w-80 text-center text-[1rem] leading-relaxed text-black/70">{profileData.bio || ''}</p>
                    </section>

                    {/* Quick actions */}
                    <section className="grid grid-cols-3 gap-3 place-items-stretch">
                        <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-5 ${hoverAndActiveEffect} ${baseClass}`}>
                            <span className="text-lg"><img src="/assets/icons/call.svg" alt="call" /></span>
                            <span className="text-xs font-medium text-black/80">Audio</span>
                        </button>
                        <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-5 ${hoverAndActiveEffect} ${baseClass}`}>
                            <span className="text-lg"><img src="/assets/icons/video_call.svg" alt="video_call" /></span>
                            <span className="text-xs font-medium text-black/80">Video</span>
                        </button>
                        <button className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-5 ${hoverAndActiveEffect} ${baseClass}`}>
                            <span className="text-lg"><img src="/assets/icons/search.svg" alt="search" /></span>
                            <span className="text-xs font-medium text-black/80">Search</span>
                        </button>
                    </section>

                    {/* Media, Links and Docs */}
                    <section className="mt-7">
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-black/50">Media, links and docs</h3>
                            <button className="text-xs font-semibold text-black/50 cursor-pointer active:scale-95">See all</button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto">
                            <div className="cursor-pointer active:scale-95 duration-150 transition-all flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white/50"><img src="/assets/icons/media.svg" alt="media" /></div>
                            <div className="cursor-pointer active:scale-95 duration-150 transition-all flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white/50"><img src="/assets/icons/link.svg" alt="link" /></div>
                            <div className="cursor-pointer active:scale-95 duration-150 transition-all flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-white/50"><img src="/assets/icons/docs.svg" alt="docs" /></div>
                        </div>
                    </section>

                    {/* Settings */}
                    <section className="mt-7">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-black/50">Settings</h3>
                            <div className="overflow-hidden rounded-2xl bg-white/50">
                            
                            <button className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-black/20">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fc94af]/10 text-lg text-[#e87596]"><img src="/assets/icons/notifications.svg" alt="notificaions" /></span>
                                <span className="flex-1">
                                    <span className="block text-sm font-medium text-black/80">Notifications</span>
                                    <span className="mt-0.5 block text-xs text-black/50">Custom notifications</span>
                                </span>
                                <span className="text-black/50">{'>'}</span>
                            </button>
                            
                            <button className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-black/20">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fc94af]/10 text-lg text-[#e87596]"><img src="/assets/icons/disappear_timer.svg" alt="disappear_timer" /></span>
                                <span className="flex-1">
                                    <span className="block text-sm font-medium text-black/80">Disappearing messages</span>
                                    <span className="mt-0.5 block text-xs text-black/50">Off</span>
                                </span>
                                <span className="text-black/50">{'>'}</span>
                            </button>
                        
                            <button className="flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-black/20">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fc94af]/10 text-lg text-[#e87596]"><img src="/assets/icons/encrypted.svg" alt="encrypted" /></span>
                                <span className="flex-1">
                                    <span className="block text-sm font-medium text-black/80">Encryption</span>
                                    <span className="mt-0.5 block truncate text-xs text-black/50">Messages are end-to-end encrypted</span>
                                </span>
                                <span className="text-black/50">{'>'}</span>
                            </button>
                        
                        </div>
                    </section>

                    {/* Danger zone */}
                    <section className="mt-8 rounded-2xl bg-white/30 p-4">
                        <button className="active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-x-2 text-[1rem] font-semibold text-red-800">
                            <p>Block user</p>
                            <img src="/assets/icons/block.svg" alt="block" />
                        </button>
                        <button className="active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-x-2 mt-4 text-[1rem] font-semibold text-red-800">
                            <p>Report user</p>
                            <img src="/assets/icons/report.svg" alt="report" />
                        </button>
                    </section>
                </div>
            </div>
        </aside>
    );
};

export default UserProfile;
