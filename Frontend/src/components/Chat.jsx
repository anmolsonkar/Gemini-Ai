import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { useTheme } from '../context/ThemeContext';

function Chat({ messages, live, loading }) {
    const { darkMode} = useTheme();
    return (

        <div className='w-full'>
            {messages && messages.map(message => (
                <div className='p-[2px] pl-4 pr-4 lg:last:pb-4 last:pb-16 first:pt-3 space-y-2' key={message._id} id={message._id}>
                    {message.user === 'User' && (
                        <div className={`p-2 ${darkMode ? 'bg-[#121212]' : 'bg-white'} min-w-[90vw] lg:min-w-[70vw]  items-center space-x-3 mt-2 rounded-md flex `}>
                            <img className='w-8 h-8' src="https://i.imgur.com/nAll32z.png" alt="Profile" />
                            <p> {message.message}</p>
                        </div>
                    )}
                    {message.user === 'Ai' && (
                        <div className="pl-2 space-x-3 mt-2 flex">
                            <img className='w-7 h-7' src="https://i.imgur.com/HLysXTu.gif" alt="Logo" />
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(message.message)) }} />
                        </div>
                    )}
                </div>
            ))
            }

            {loading && (
                <div className='p-[2px] pl-4 pr-4 pb-4 '>
                    <div className="pl-2 space-x-3 mt-2 flex w-full animate-pulse">
                        <img className='w-7 h-7 zoom' src="https://i.imgur.com/HLysXTu.gif" alt="Logo" />
                        <div className="flex-1 space-y-6 py-2">
                            <div className="h-2 bg-slate-200 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                                </div>
                                <div className="h-2 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {
                live && (
                    <div className='p-[2px] pl-4 pr-4 lg:last:pb-4 last:pb-20 first:pt-4 space-y-2  '>
                        <div className="pl-2 space-x-3 mt-2 flex">
                            <img className='w-7 h-7 zoom' src="https://i.imgur.com/HLysXTu.gif" alt="Logo" />
                            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(live)) }} />
                        </div>

                    </div>
                )
            }


        </div >
    );
}

export default Chat;



