import React from "react";
import ParticlesBackground from "../components/ParticlesBackground";
<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
import DoctorEfficiencyBar from "../components/DoctorEfficiencyBar";
import patientHistory from "../assets/medScribe.webp"

const R = () => {
  const [doctorEfficiency, setDoctorEfficiency] = useState(70);

  const [messages, setMessages] = useState([
    {
      message: "Here are some improvements that you as the doctor can make:",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const chatbox = messagesEndRef.current.parentNode;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      message: inputMessage,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputMessage("");
    setIsSending(false);
    setTyping(true);
    // Send message to ChatGPT and wait for a response
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    // System message with personal info and instructions
    const systemMessage = {
      role: "system",
      content: `
        Explain all concepts like I am 10 years old.
      `,
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
=======
import {useState, useRef, useEffect, useCallback} from "react"

const R = () => {
    const [messages, setMessages] = useState([
        {
          message: "Here are some improvements that you as the doctor can make:",
          sender: "ChatGPT",
          direction: "incoming",
        },
      ]);
    
      const [inputMessage, setInputMessage] = useState("");
      const [typing, setTyping] = useState(false);
      const [isSending, setIsSending] = useState(false);
      const messagesEndRef = useRef(null);
      const [fetchedMessages, setFetchedMessages] = useState([]);
      // Scroll to the bottom whenever messages change
      useEffect(() => {
        scrollToBottom();
      }, [messages, typing]);
    
      const scrollToBottom = () => {
        if (messagesEndRef.current) {
          const chatbox = messagesEndRef.current.parentNode; 
          chatbox.scrollTop = chatbox.scrollHeight; 
        }
      };

      const fetchMessages = useCallback(async () => {
        try {
          const response = await fetch("/assets/improvement.txt"); // Fetch from public folder
          const text = await response.text(); // Read the file contents as text
          const newMessages = text.split("\n").filter(Boolean); // Split by line and filter empty lines
    
          // Only append messages that are new (not already in fetchedMessages)
          const newUniqueMessages = newMessages.filter(
            (msg) => !fetchedMessages.includes(msg)
          );
    
          // Update the state with new unique messages
          setFetchedMessages((prevFetchedMessages) => [
            ...prevFetchedMessages,
            ...newUniqueMessages,
          ]);
    
          // Map new messages to the expected format and update the state
          const formattedMessages = newUniqueMessages.map((msg) => ({
            message: msg,
            sender: "ChatGPT",
            direction: "incoming",
          }));
    
          setMessages((prevMessages) => [...prevMessages, ...formattedMessages]);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }, [fetchedMessages]);
    
      useEffect(() => {
        const interval = setInterval(() => {
          fetchMessages();
        }, 1000);
    
        return () => clearInterval(interval); // Clean up the interval on unmount
      }, [fetchMessages])
    
      const handleSend = async () => {
        if (!inputMessage.trim()) return;
    
        const newMessage = {
          message: inputMessage,
          sender: "user",
          direction: "outgoing",
        };
    
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInputMessage("")
        setIsSending(false);
        setTyping(true);
        // Send message to ChatGPT and wait for a response
        await processMessageToChatGPT(newMessages);
      };
    
      async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
          let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
          return { role: role, content: messageObject.message };
        });
    
        // System message with personal info and instructions
        const systemMessage = {
          role: "system",
          content: `
            Explain all concepts like I am 10 years old.
          `,
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
>>>>>>> 92f89faac66741f179608647511746293334846f
          },
        ]);
        setTyping(false);
        setIsSending(false);
      });
  }

  return (
    <div className="relative min-h-screen overflow-y-hidden no-scrollbar text-white antialiased selection:bg-rose-300 selection:text-rose-800">
      <div className="fixed top-0 -z-5 h-full w-full">
        <ParticlesBackground />
      </div>
      <div className="absolute -z-10 min-h-full w-full bg-gradient-to-r from-[#f0f9fd] to-[#65c0e7]"></div>
      <div className="flex items-start justify-center">
        <h3 className="uppercase tracking-[20px] text-blue-700 text-2xl mt-[120px] ml-6">
          Reports
        </h3>
      </div>
      <div className="flex flex-wrap mt-[100px]">
        <div className="w-1/2 border-r-[2px] border-l-[2px] border-red-500 border-b-[2px]">
          <div className="flex items-center justify-center mb-10">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Progress Bar
            </span>
          </div>
          <div className="flex items-center justify-center mb-10">
            <DoctorEfficiencyBar efficiency={doctorEfficiency} />
          </div>
        </div>
        <div className="w-1/2 border-r-[2px] border-l-[2px] border-red-500 border-b-[2px]">
          <div className="flex items-center justify-center mb-10">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Future Improvements
            </span>
          </div>
          <div className="flex items-center justify-center mb-10">
<<<<<<< HEAD
            <div className="box-border h-[360px] w-[600px] border-[4px] border-blue-400 hover:border-blue-600 transition-all hover:shadow-2xl hover:shadow-blue-600 ease-in-out duration-300 rounded-[1.25rem] bg-white/50 hover:bg-white flex">
              <div className="overflow-y-auto p-4">
=======
          <div className="box-border h-[360px] w-[600px] border-[4px] border-blue-400 hover:border-blue-600 transition-all hover:shadow-2xl hover:shadow-blue-600 ease-in-out duration-300 rounded-[1.25rem] bg-white/50 hover:bg-white flex items-center justify-center">
              <div className = "flex items-center justify-center">
                <div className="w-[25rem] h-[20rem] rounded-[1.25rem] left-[1.25rem] top-[1rem] resize-none text-black">
>>>>>>> 92f89faac66741f179608647511746293334846f
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      message.direction === "incoming"
                        ? "justify-start"
                        : "hidden"
                    }`}
                  >
                    <div
                      className={`${
                        message.direction === "incoming"
                          ? "bg-blue-500 text-white"
                          : "text-blue"
                      } p-3 rounded-[1.25rem] max-w-lg shadow-lg`}
                    >
<<<<<<< HEAD
                      bro
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
=======
                      {/* PUT MESSAGE FOR MEDICATION ERROR */}
                      {message.message}
                    </div>
                  </div>
                ))}
                  
                  
                </div>
>>>>>>> 92f89faac66741f179608647511746293334846f
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-t-[2px] border-blue-500 pb-80">
        <div className="flex justify-center items-center">
          <div className="flex justify-center items-center my-10">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Medications
            </span>
          </div>
        </div>
        <div className="flex flex-wrap">
          <div className="w-1/3">
            <div className="flex justify-center">
                <div className = "h-[33rem] w-[33rem]">
                    <iframe
                        src = "https://my.spline.design/bottlecopy-d43c86d7caf35e9a61a5d112250d0eed/"
                        width = "100%"
                        height = "100%"
                    ></iframe>
                </div>
            </div>
          </div>
          <div className = "w-1/3">
            <div className = "flex flex-col items-center justify-center mt-[60px]">
              <div className = "flex items-center justify-center bg-blue-500 rounded-full mx-6">
                <span className = "py-4 px-6 text-white text-center">Hey there! Please click the button below to receive your updated patient history information.</span>
              </div>
              {/* <input
                type="file"
                ref={fileInputRef} // Attach the ref here
                onChange={handleFileChange}
                style={{ display: 'none' }}
                directory="false"
              /> */}
              <button className = "hover:opacity-50 ease-in-out duration-300 hover:scale-150">
                <img
                    src = {patientHistory}
                    alt = "Patient History Form"
                    className = "ml-8 w-[220px] h-[240px] relative top-[60px] z-10"
                />
              </button>      
            </div> 
        </div>
          <div className="w-1/3">
            <div className="flex justify-center">
                bro
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default R;
