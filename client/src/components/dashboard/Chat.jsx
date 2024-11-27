import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineMessage, AiOutlinePlus } from 'react-icons/ai';
import { GrEmoji } from 'react-icons/gr';
import { IoSend } from 'react-icons/io5';
import { BsFillChatLeftTextFill, BsXSquare } from "react-icons/bs";
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { add_friend, send_message, updateMessage, messageClear } from '../../store/reducers/chatReducer';
import toast from 'react-hot-toast';

const socket = io('http://localhost:5000');

const Chat = () => {
    const scrollRef = useRef();
    const dispatch = useDispatch();
    const { sellerId } = useParams();
    const [text, setText] = useState('');
    const [receverMessage, setReceverMessage] = useState('');
    const [activeSeller, setActiveSeller] = useState([]);
    const [show, setShow] = useState(false); // Toggle chat sidebar visibility
    const [showSidebarImage, setShowSidebarImage] = useState(true); // Toggle specific sidebar image visibility

    const { userInfo } = useSelector(state => state.auth);
    const { fd_messages, currentFd, my_friends, successMessage } = useSelector(state => state.chat);

    useEffect(() => {
        socket.emit('add_user', userInfo.id, userInfo);
    }, []);

    useEffect(() => {
        dispatch(add_friend({
            sellerId: sellerId || "",
            userId: userInfo.id
        }));
    }, [sellerId]);

    const send = () => {
        if (text) {
            dispatch(send_message({
                userId: userInfo.id,
                text,
                sellerId,
                name: userInfo.name
            }));
            setText('');
        }
    };

    useEffect(() => {
        socket.on('seller_message', msg => {
            setReceverMessage(msg);
        });
        socket.on('activeSeller', sellers => {
            setActiveSeller(sellers);
        });
    }, []);

    useEffect(() => {
        if (successMessage) {
            socket.emit('send_customer_message', fd_messages[fd_messages.length - 1]);
            dispatch(messageClear());
        }
    }, [successMessage]);

    useEffect(() => {
        if (receverMessage) {
            if (sellerId === receverMessage.senderId && userInfo.id === receverMessage.receverId) {
                dispatch(updateMessage(receverMessage));
            } else {
                toast.success(receverMessage.senderName + " " + "sent a message");
                dispatch(messageClear());
            }
        }
    }, [receverMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [fd_messages]);

    const toggleChatSidebar = () => {
        setShow(!show);
        setShowSidebarImage(!showSidebarImage); // Toggles the specific sidebar image
    };

    return (
        <div className='bg-white p-3 rounded-md'>
            <div className='w-full flex relative'>
                {/* Sidebar */}
                <div className={`w-[230px] md-lg:absolute bg-white transition-all md-lg:h-full ${show ? 'left-0' : '-left-[350px]'} `}>
                    <div className='flex justify-center gap-1 items-center text-slate-600 text-small h-[50px] font-bold gap-5'>
                        <AiOutlineMessage />
                        <span>Select a Seller</span>
                        <span>
                            {showSidebarImage && (
                                <img
                                    src="https://spamashop.vercel.app/images/user.png"
                                    alt="Sidebar User"
                                    className='w-[30px] h-[30px] rounded-full'
                                />
                            )}
                        </span>
                        <span><BsXSquare onClick={toggleChatSidebar} className='bg-red-500 w-[20px] h-[20px] cursor-pointer' /></span>
                    </div>
                    <div className='w-full flex flex-col text-slate-600 py-4 h-[400px] pr-3'>
                        {my_friends.map((f, i) => (
                            <Link to={`/dashboard/chat/${f.fdId}`} key={i} className='flex gap-2 justify-start items-center pl-2 py-[5px]'>
                                <div className='w-[30px] h-[30px] rounded-full relative'>
                                    {activeSeller.some(c => c.sellerId === f.fdId) && (
                                        <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>
                                    )}
                                    <img src="https://spamashop.vercel.app/images/user.png" alt="Friend Avatar" />
                                </div>
                                <span>{f.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className='w-[calc(100%-230px)] md-lg:w-full'>
                    {currentFd ? (
                        <div className='w-full h-full'>
                            <div className='flex justify-between items-center text-slate-600 text-xl h-[50px]'>
                                <div className='flex gap-2'>
                                    <div className='w-[30px] h-[30px] rounded-full relative'>
                                        {activeSeller.some(c => c.sellerId === currentFd.fdId) && (
                                            <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute right-0 bottom-0'></div>
                                        )}
                                        <img src="https://spamashop.vercel.app/images/user.png" alt="Current Friend Avatar" />
                                    </div>
                                    <span>{currentFd.name}</span>
                                </div>
                                <div onClick={toggleChatSidebar} className='w-[35px] hidden md-lg:flex cursor-pointer h-[35px] rounded-sm justify-center items-center bg-green-600 text-white'>
                                    <BsFillChatLeftTextFill />
                                </div>
                            </div>
                            <div className='h-[400px] w-full bg-slate-100 p-3 rounded-md'>
                                <div className='w-full h-full overflow-y-auto flex flex-col gap-3'>
                                    {fd_messages.map((m, i) => (
                                        <div
                                            key={i}
                                            ref={scrollRef}
                                            className={`w-full flex gap-2 ${
                                                currentFd?.fdId !== m.receverId ? 'justify-start' : 'justify-end'
                                            } items-center text-[14px]`}
                                        >
                                            <img className='w-[30px] h-[30px]' src="https://spamashop.vercel.app/images/user.png" alt="Message Avatar" />
                                            <div
                                                className={`p-2 ${
                                                    currentFd?.fdId !== m.receverId ? 'bg-yellow-500' : 'bg-green-600'
                                                } text-white rounded-md`}
                                            >
                                                <span>{m.message}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex p-2 justify-between items-center w-full'>
                                <div className='w-[40px] h-[40px] border p-2 justify-center items-center flex rounded-full'>
                                    <label className='cursor-pointer' htmlFor=""><AiOutlinePlus /></label>
                                    <input className='hidden' type="file" />
                                </div>
                                <div className='border h-[40px] p-0 ml-2 w-[calc(100%-90px)] rounded-full relative'>
                                    <input
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        type="text"
                                        placeholder='Input Message'
                                        className='w-full rounded-full h-full outline-none p-3'
                                    />
                                    <div className='text-2xl right-2 top-2 absolute cursor-auto'>
                                        <span><GrEmoji /></span>
                                    </div>
                                </div>
                                <div className='w-[40px] p-2 justify-center items-center rounded-full'>
                                    <div onClick={send} className='text-2xl cursor-pointer'>
                                        <IoSend />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div onClick={toggleChatSidebar} className='w-full flex justify-center items-center text-lg font-bold text-slate-600 h-[400px]'>
                            <span>Select </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
