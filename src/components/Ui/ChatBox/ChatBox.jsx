import { useState, useRef, useEffect } from "react";
import { FaFacebookMessenger } from "react-icons/fa";

function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { from: "bot", text: "Xin chào , bạn cần tư vấn tour gì ạ?" },
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    const handleSend = () => {
        if (!input.trim()) return;
        setMessages([...messages, { from: "user", text: input }]);
        setInput("");
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { from: "bot", text: "Cảm ơn bạn, nhân viên sẽ hỗ trợ sớm nhất 👍" },
            ]);
        }, 1000);
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div className="fixed bottom-5 right-5">
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
                >
                    <FaFacebookMessenger />
                </button>
            )}

            {isOpen && (
                <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                        <span className="font-bold">TravelTour Support</span>
                        <button onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-2 rounded-lg max-w-[70%] ${msg.from === "user"
                                            ? "bg-black text-white"
                                            : "bg-gray-200 text-black"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>

                        ))}
                    </div>

                    <div className="p-2 border-t flex text-black">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 border rounded px-2 py-1 text-sm"
                            placeholder="Nhập tin nhắn..."
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            className="ml-2 bg-blue-600 text-black px-3 rounded text-sm hover:bg-blue-700"
                        >
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatBox;