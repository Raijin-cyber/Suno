import Notification from "../Notification";
import NotificationSnippet from "../NotificationSnippet";

const NotificationPane = ({isNotifiOpen=false, setIsNotifiOpen, notifications=[]}) => {
    return (
        <div id="notification pane" className={`${isNotifiOpen ? "translate-x-0" : "-translate-x-full"} z-20 absolute left-0 top-0 p-3 flex flex-col gap-y-5 ease-in-out max-md:bottom-0 overflow-hidden md:left-0 md:top-0 transition-all duration-500 bg-[#fc94Af] h-full w-full max-w-screen`}>
            <div className="flex items-center justify-center">
                <p className="font-sans text-center text-2xl font-medium w-full">Notification</p>
                <button onClick={() => setIsNotifiOpen(prev => false)} className="absolute right-3 top-3 w-9 active:scale-90 transition-all duration-200 border border-black/20 bg-black/50 rounded-full"><img src="/assets/icons/cross.png" alt="cross" /></button>
            </div>
            
            {/* notifications area */}
            <div className="flex flex-col gap-y-2 h-full w-full py-5 px-4 rounded-3xl shadow-[inset_6px_6px_5px_#de829a,inset_-6px_-6px_5px_#ffa6c4]">
                {
                    notifications?.map((notifi) => {
                        if(notifi.type === "request") return <NotificationSnippet key={notifi._id} notificationContent={notifi} requestNotification={true} />
                        if(notifi.type === "message") return <NotificationSnippet key={notifi._id} notificationContent={notifi}  messageNotification={true} />
                        if(notifi.type === "reminder") return <NotificationSnippet key={notifi._id} notificationContent={notifi} reminderNotification={true} />
                        if(notifi.type === "status") return <NotificationSnippet key={notifi._id} notificationContent={notifi} statusNotification={true} />
                        if(notifi.type === "receipt") return <NotificationSnippet key={notifi._id} notificationContent={notifi} receiptNotication={true} />
                        if(notifi.type === "system") return <NotificationSnippet key={notifi._id} notificationContent={notifi} systemNotification={true} />
                        if(notifi.type === "call") return <NotificationSnippet key={notifi._id} notificationContent={notifi} callNotifcation={true} />
                        if(notifi.type === "security") return <NotificationSnippet key={notifi._id} notificationContent={notifi} securityNotification={true} />
                        if(notifi.type === "general") return <NotificationSnippet key={notifi._id} notificationContent={notifi} generalNotification={true} />
                    })
                }
                {
                    notifications.length === 0 &&
                    <div    
                        className="
                            flex flex-col 
                            items-center gap-y-5
                            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        ">
                        <img className="w-80" src="/assets/illustrations/Chilling-cuate.svg" alt="Chilling-cuate" />
                        <p 
                            className="
                                text-xl font-normal italic
                            "
                        >
                            No notification
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}

export default NotificationPane;