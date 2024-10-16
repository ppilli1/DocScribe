import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import { FaArrowUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const CE = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [incomingMessageCount, setIncomingMessageCount] = useState(0);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatbox = messagesEndRef.current.parentNode; // Get the chatbox container
      chatbox.scrollTop = chatbox.scrollHeight; // Scroll only within the chatbox
    }
  };

  const [messages1, setMessages1] = useState([
    {
      message: "Any Surgery Errors?",
      sender: "ChatGPT2",
      direction: "incoming",
    },
  ]);
  const [fetchedMessages1, setFetchedMessages1] = useState([]);

  const fetchMessages1 = useCallback(async () => {
    try {
      const response = await fetch("../../assets/OR_error_return.txt"); // Fetch from public folder
      const text1 = await response.text(); // Read the file contents as text
      const newMessages = text1.split("\n").filter(Boolean); // Split by line and filter empty lines

      // Only append messages that are new (not already in fetchedMessages)
      const newUniqueMessages = newMessages.filter(
        (msg) => !fetchedMessages1.includes(msg)
      );

      // Update the state with new unique messages
      setFetchedMessages1((prevFetchedMessages) => [
        ...prevFetchedMessages,
        ...newUniqueMessages,
      ]);

      // Map new messages to the expected format and update the state
      const formattedMessages = newUniqueMessages.map((msg) => ({
        message: msg,
        sender: "ChatGPT2",
        direction: "incoming",
      }));

      setMessages1((prevMessages) => [...prevMessages, ...formattedMessages]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [fetchedMessages1]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages1();
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, [fetchMessages1]);

  const [messages2, setMessages2] = useState([
    {
      message: "Any Questions?",
      sender: "ChatGPT3",
      direction: "incoming",
    },
  ]);
  const [fetchedMessages2, setFetchedMessages2] = useState([]);

  // Initialize the chatHistory with the first message
  const [chatHistory, setChatHistory] = useState([
    {
      message: "Send anything to start your question stream!",
      sender: "ChatGPT3",
      direction: "incoming",
    },
  ]);

  const [currentMessageIndex, setCurrentMessageIndex] = useState(1); // Start at index 1 since the first message is already in chatHistory
  // const [inputMessage, setInputMessage] = useState('');
  // const [isSending, setIsSending] = useState(false);

  // Fetch New Messages (unchanged)
  const fetchMessages2 = useCallback(async () => {
    try {
      const response = await fetch("/assets/refined_questions.txt");
      const text2 = await response.text();
      const newMessages = text2.split("\n").filter(Boolean);

      const newUniqueMessages = newMessages.filter(
        (msg) => !fetchedMessages2.includes(msg)
      );

      setFetchedMessages2((prevFetchedMessages) => [
        ...prevFetchedMessages,
        ...newUniqueMessages,
      ]);

      const formattedMessages = newUniqueMessages.map((msg) => ({
        message: msg,
        sender: "ChatGPT3",
        direction: "incoming",
      }));

      setMessages2((prevMessages) => [...prevMessages, ...formattedMessages]);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [fetchedMessages2]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages2();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchMessages2]);

  useEffect(() => {
    const newIncomingCount = chatHistory.filter(
      (msg) => msg.direction === "incoming"
    ).length;
    setIncomingMessageCount(newIncomingCount);
  }, [chatHistory]);

  // Handle Send Message
  const handleSend = () => {
    if (!inputMessage.trim()) return; // Prevent empty responses
    setIsSending(true);

    // Add user's response to the chat history
    const userMessage = {
      message: inputMessage,
      sender: "User",
      direction: "outgoing",
    };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    // Clear input
    setInputMessage("");

    // Move to the next bot message
    const nextMessage = messages2[currentMessageIndex];
    if (nextMessage) {
      setChatHistory((prevHistory) => [...prevHistory, nextMessage]);
      setCurrentMessageIndex((prevIndex) => prevIndex + 1);
    }

    setIsSending(false);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
            direction: "incoming",
          },
        ]);
        setTyping(false);
        setIsSending(false);
      });
  }

  const stopServer = async () => {
    try {
      const response = await fetch("http://localhost:5173/stp", {
        // Use the correct server URL and port
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to stop the server.");
      }

      const result = await response.text();
      console.log("Server stopped successfully:", result);
    } catch (error) {
      console.error("Error stopping the server:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-y-hidden no-scrollbar text-white antialiased selection:bg-rose-300 selection:text-rose-800">
      <div className="fixed top-0 -z-5 h-full w-full">
        <ParticlesBackground />
      </div>
      <div className="absolute -z-10 min-h-full w-full bg-gradient-to-r from-[#F0F9FD] to-[#65c0e7]"></div>
      <div className="flex items-start justify-center">
        <h3 className="uppercase tracking-[20px] text-blue-700 text-2xl mt-[120px] ml-6">
          Clinical Errors
        </h3>
      </div>
      <div className="flex flex-wrap mt-[100px]">
        <div className="w-1/2 bg-transparent">
          {" "}
          {/* Ensure background is transparent */}
          {/* Spline Embed */}
          <div className="h-2/4 z-3 relative bottom-[-10rem]">
            <button
              className="h-[33rem] w-[33rem] z-3 relative bottom-[3rem] left-[8.5rem]"
              onClick={stopServer}
            >
              <iframe
                src="https://my.spline.design/cno1bottomcta-d2852393649091d6e5ee5337aaf2ebec/"
                frameBorder="0"
                width="100%"
                height="100%"
              ></iframe>
            </button>
          </div>
          <Link
            onClick={stopServer}
            className="w-[380px] h-[380px] rounded-full bg-transparent transition duration-200 z-4 absolute left-[198px] bottom-[353px]"
          ></Link>
          {incomingMessageCount >= 6 && (
            <div className="flex items-center justify-center absolute top-[900px] left-[180px]">
              <Link
                to="/R"
                className="text-5xl my-custom-font font-[40px] tracking-tighter text-fuchsia-500 z-3 transition-colors hover:text-fuchsia-700 duration-300 ease-in-out"
              >
                Next Steps
              </Link>
            </div>
          )}
        </div>
        <div className="w-1/2">
          <div className="flex justify-center items-center mb-10 mr-[85px]">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Clarifying Questions
            </span>
          </div>
          <div className="flex justify-start">
            <div className="box-border h-[700px] w-[700px] border-[4px] border-blue-300 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500 ease-in-out duration-300 rounded-[1.25rem] bg-white/50 hover:bg-slate-100 flex flex-col mb-[40px]">
              {/* <div className = "h-1/10 flex items-center justify-center border-b-[2px]">
              <div className = "text-black text-2xl text-center">
                bro
              </div>
            </div> */}
              {/* Message List */}
              <div className="h-4/5 overflow-y-auto p-4">
                {/* Display the chat history */}
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      message.direction === "incoming"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <div
                      className={`${
                        message.direction === "incoming"
                          ? "bg-[#E5E5EA] text-black"
                          : "bg-blue-500 text-white"
                      } p-3 rounded-[1.25rem] max-w-lg shadow-lg`}
                    >
                      {message.message}
                    </div>
                  </div>
                ))}

                {/* User Input */}
              </div>
              {/* <div className="h-1/5 flex items-center justify-between px-4 py-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="w-full resize-none rounded-[1.25rem] border-[2px] border-slate-300 bg-white px-3 py-3 text-md focus:bg-white focus:text-black hover:border-slate-400 focus:outline-none transition-colors duration-300 overflow-y-scroll no-scrollbar"
                  placeholder="Type your message..."
                  rows="4"
                >
                  <text className = "flex justify-end"></text>
                </textarea>
                <button
                  className={`ml-4 flex items-center justify-center p-4 rounded-lg border-[2px] border-stone-600 bg-white text-sm font-semibold text-stone-900 hover:bg-slate-300 active:bg-slate-300/50 transition-colors duration-300 ${
                    isSending ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  onClick={handleSend}
                  disabled={isSending}
                >
                  {isSending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send <FiSend className="ml-2" />
                    </>
                  )}
                </button>
              </div> */}
              <div className="px-4 py-4 flex justify-center items-center">
                <div className="flex w-[95%] h-[100%] resize-none rounded-[1.25rem] border-[2px] border-blue-300 bg-white hover:border-blue-500 focus:outline-none transition-colors duration-300">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="w-[92%] px-3 py-3 text-md rounded-[1.25rem] focus:bg-white focus:text-black focus:outline-none overflow-y-scroll no-scrollbar resize-none"
                    placeholder="Type your response..."
                    rows="4"
                  />
                  <div className="flex py-3 items-start justify-end w-[8%] mr-3">
                    <button
                      className={`rounded-3xl bg-blue-500 p-1 hover:bg-blue-700 active:bg-blue-700/50 transition-colors duration-300 focus:outline-none ${
                        isSending ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      onClick={handleSend}
                      disabled={isSending}
                    >
                      <FaArrowUp className="text-white font-semibold text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CE;
