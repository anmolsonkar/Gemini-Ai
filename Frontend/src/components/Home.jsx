import { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react';
import io from "socket.io-client";
import Chat from './Chat';
import { Clear, Send } from "@mui/icons-material";
import Header from '../components/Header'
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';


const Home = () => {

	const { darkMode } = useTheme();

	const [hover, sethover] = useState(null)
	const [refresh, setrefresh] = useState(false);
	const [conversation, setConversation] = useState('');
	const [value, setValue] = useState('');
	const [loading, setloading] = useState(false);
	const [live, setLive] = useState('');
	const [generate, setGenerate] = useState(false);
	const [socket, setSocket] = useState(null);
	const textareaRef = useRef(null);
	const divRef = useRef(null);

	useEffect(() => {
		const newSocket = io("http://localhost:4000");
		setSocket(newSocket);

		return () => {
			newSocket.disconnect();
			setrefresh(false);
		};
	}, [refresh]);

	const memoizedConversation = useMemo(() => conversation, [conversation]);


	const sendMessage = (e) => {
		e.preventDefault();
		if (socket && value.trim()) {
			socket.emit('send', value.trim());
			setValue('');
			focusTextarea();
			setGenerate(true)
			textareaRef.current.style.height = "45px"

		}
	};

	const handleTextareaChange = (e) => {
		setValue(e.target.value);
		adjustTextareaHeight();
	};

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = '10px';
			textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
		}
	};

	const focusTextarea = () => {
		if (textareaRef.current) {
			textareaRef.current.focus();
		}
	};

	const handleTextareaKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage(e);
		}
	};


	useEffect(() => {
		if (socket) {
			socket.on("conversation", (data) => {
				setConversation(data);
				focusTextarea();
			});

			return () => {
				socket.off("conversation");
			};
		}
	}, [socket]);

	useEffect(() => {
		if (socket) {
			socket.on("loading", (res) => {
				setloading(res);
			});

			return () => {
				socket.off("loading");
			};
		}
	}, [socket]);


	useEffect(() => {
		if (socket) {
			socket.on("live", (data) => {
				setLive(data);
				focusTextarea();
			});

			return () => {
				socket.off("live");
			};
		}
	}, [socket]);

	useEffect(() => {
		if (socket) {
			socket.on("finalconversation", (data) => {
				setConversation(data);
				setLive("");
				textareaRef.current.disabled = false;
				focusTextarea();
				setGenerate(false)
			});

			return () => {
				socket.off("finalconversation");
			};
		}
	}, [socket]);

	useLayoutEffect(() => {
		const div = divRef.current;
		div.scrollTop = div.scrollHeight;
	}, [memoizedConversation, live, loading]);

	const handleDelete = async (id) => {
		try {
			const res = await axios.post(`http://localhost:4000/chat/${id}`);
			if (res.data.status === true) {
				setrefresh(true)
			}
		} catch (error) {
			console.log(error)
		}
	}


	const handleview = (id) => {
		console.log(id)
	}

	return (

		<div className={`flex flex-col min-h-screen ${darkMode ? 'bg-[#121212]' : 'bg-[#f1f3f4]'}`}>
			<Header memoizedConversation={memoizedConversation} handleDelete={handleDelete} handleview={handleview} />
			<div className={`flex flex-grow  lg:mt-[9vh] gap-4 lg:m-4 p-1  ${darkMode ? 'lg:bg-[#121212] md:bg-[#1e1e1e]' : 'lg:bg-[#f1f3f4] md:bg-white'} lg:w-[71vw] xl:w-[98vw]`}>
				<div className={`${darkMode ? 'bg-[#1e1e1e] aside-dark' : 'bg-white aside-light'} min-w-[19vw] overflow-hidden overflow-y-auto lg:h-[89.3vh] xl:h-[87.9vh] lg:min-w-[25vw] xl:min-w-[18vw] rounded-xl drop-shadow-xl lg:block hidden`}>
					{memoizedConversation && memoizedConversation.map(message => (
						message.user === 'User' &&
						<div key={message._id} onClick={() => handleview(message._id)} className={`${darkMode ? 'bg-[#121212] text-white' : 'bg-[#f1f3f4]'} active:scale-[97%] duration-100  p-2 flex justify-between items-center m-3 cursor-pointer rounded-md lg:max-w-[20rem]`} onMouseEnter={() => sethover(message._id)}
							onMouseLeave={() => sethover(null)}>
							<button className='flex' style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
								<img className='w-7 h-7' src="https://i.imgur.com/HLysXTu.gif" alt="Logo" />

								<span className='ml-2'>{message.message}</span>
							</button>
							{hover === message._id && <Clear onClick={() => handleDelete(message._id)} className='text-gray-300' />}
						</div>
					))
					}

				</div>
				<div className="flex flex-col justify-between space-y-3 w-full">
					<div ref={divRef} className={` ${darkMode ? 'bg-[#1e1e1e] container-dark text-white' : 'bg-white container-light'} lg:h-[80vh] lg:max-h-[80vh] xl:max-h-[81.5vh] 2xl:max-h-[79.5vh] lg:rounded-xl lg:drop-shadow-xl mt-[6.7vh] lg:mt-0 lg:overflow-hidden lg:overflow-y-auto`} >
						<Chat messages={memoizedConversation} live={live} loading={loading} setrefresh={setrefresh} />
					</div>
					<form onSubmit={sendMessage} className="flex items-center lg:p-0 p-4 pt-0 ">
						<textarea
							id='textarea'
							value={value}
							onChange={handleTextareaChange}
							onKeyDown={handleTextareaKeyPress}
							ref={textareaRef}
							className="flex-1 bg-white w-[90vw] md:w-[94vw] lg:w-[70vw] xl:w-[78.3vw]  input-container  outline-none resize-none p-3 rounded-xl mr-2 drop-shadow-xl h-[45px] fixed bottom-5"
							placeholder={generate ? 'Generating...' : 'Ask me anything...'}
							disabled={generate}
							required
						/>
						<button type="submit" disabled={!value}>
							{generate ? (
								<svg aria-hidden="true" className="w-7 h-7 animate-spin dark:text-[#F1F3F4] fill-indigo-500 bottom-7 right-4 md:right-6 lg:right-9 fixed" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
								</svg>
							) : (
								<Send
									className={`bottom-7 right-4 md:right-6 lg:right-9 fixed ${value || generate ? 'text-indigo-500' : 'text-indigo-200'
										}`}
									sx={{ fontSize: 27 }}
								/>
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Home;
