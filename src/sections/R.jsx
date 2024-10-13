import React from "react";
import ParticlesBackground from "../components/ParticlesBackground";
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

  const fetchRating = async () => {
    try {
        const response = await fetch("http://localhost:5173/rate", { // Adjust URL as needed
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch rating.");
        }

        const num = await response.json(); // Assuming 'num' is returned as JSON
        setDoctorEfficiency(num); // Set the received rating to the state variable
        console.log("Rating received:", num);
    } catch (error) {
        console.error("Error fetching rating:", error);
    }
  };

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
          <div className="flex justify-center items-center mt-32">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Updated Patient History
            </span>
          </div>
          <div className = "flex flex-col items-center justify-center mt-[50px] mb-[140px]">
              <div className = "flex items-center justify-center bg-blue-500 rounded-full mx-[140px]">
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
                    className = "ml-8 w-[220px] h-[240px] relative top-[50px] z-10"
                />
              </button>      
            </div> 
        </div>
        <div className="w-1/2 border-r-[2px] border-l-[2px] border-red-500 border-b-[2px]">
        <div className = "mt-[125px]">
          <div className="flex items-center justify-center mb-10">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Future Improvements
            </span>
          </div>
          <div className="flex items-center justify-center mb-10">
            <div className="box-border h-[360px] w-[600px] border-[4px] border-blue-400 hover:border-blue-600 transition-all hover:shadow-2xl hover:shadow-blue-600 ease-in-out duration-300 rounded-[1.25rem] bg-white/50 hover:bg-white flex">
              <div className="overflow-y-auto p-4">
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
                      bro
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default R;
