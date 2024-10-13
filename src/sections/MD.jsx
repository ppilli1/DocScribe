import React, { useEffect, useRef, useState, useCallback } from "react";
import ParticlesBackground from "../components/ParticlesBackground";
import { FaArrowUp } from "react-icons/fa";
import wavingHand from "../assets/wavingHand.gif";

const MD = () => {
  const [lolsies, setLolsies] = useState([
    {
      message: "N/A",
      sender: "ChatGPT89",
      direction: "incoming",
    },
  ])
  const [messages, setMessages] = useState([
    {
      message: "Any Medication Errors?",
      sender: "ChatGPT1",
      direction: "incoming",
    },
  ]);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [fetchedMessagesp, setFetchedMessagesp] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInput, setModalInput] = useState("");

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const handleModalSubmit = () => {
    // Handle the submission of the modal input
    console.log("User input:", modalInput);
    setModalInput("");
    closeModal();
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch("../../assets/MD_medication_return.txt"); // Fetch from public folder
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

    // Functions to handle empty file and new content detection
  const handleEmptyFile = useCallback(() => {
    console.log("File is empty. Triggering empty file handler...");
    closeModal();
  }, [closeModal]);

  const handleNewContent = useCallback(() => {
      console.log("New content detected. Triggering new content handler...");
      openModal();
  }, [openModal]);




  useEffect(() => {
    // Separate function for initial loading of lolsies
    const loadInitialLolsies = async () => {
        try {
            const response = await fetch("/assets/patient_question.txt");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text6 = await response.text();
            const initialMessages = text6.split("\n").filter(Boolean);

            console.log("Initial messages fetched:", initialMessages);

            if (initialMessages.length > 0) {
                const initialMessage = {
                    message: initialMessages[0],
                    sender: "ChatGPT",
                    direction: "incoming",
                };

                setLolsies([initialMessage]);
                setFetchedMessagesp(initialMessages);
                handleNewContent(); // Open modal on initial non-empty file load
            } else {
                handleEmptyFile(); // Close modal if initially empty
            }
        } catch (error) {
            console.error("Error fetching initial messages:", error);
        }
    };

    loadInitialLolsies();

    const interval = setInterval(fetchPatientQuestion, 1000);
    return () => clearInterval(interval);
}, []); // Empty dependency array to run only on mount

const fetchPatientQuestion = useCallback(async () => {
  try {
      const response = await fetch("/assets/patient_question.txt");
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text6 = await response.text();
      const newMessages = text6.split("\n").filter(Boolean);

      if (newMessages.length === 0) {
          handleEmptyFile();
          setLolsies([]);
          return;
      }

      const newFirstMessage = newMessages[0];

      // Use the updater function with setLolsies to access the latest state
      setLolsies((prevLolsies) => {
          const isDifferent = prevLolsies.length === 0 || prevLolsies[0].message !== newFirstMessage;

          if (isDifferent) {
              const initialMessage = {
                  message: newFirstMessage,
                  sender: "ChatGPT",
                  direction: "incoming",
              };

              // Call handleNewContent only when the first message changes
              handleNewContent();
              console.log("Updated lolsies with new first line:", newFirstMessage);

              return [initialMessage];
          } else {
              console.log("First line unchanged, handleNewContent not called.");
              return prevLolsies;
          }
      });

      const newUniqueMessages = newMessages.slice(1).filter(
          (msg) => !fetchedMessagesp.includes(msg)
      );

      if (newUniqueMessages.length > 0) {
          setFetchedMessagesp((prev) => [...prev, ...newUniqueMessages]);

          const formattedMessages = newUniqueMessages.map((msg) => ({
              message: msg,
              sender: "ChatGPT",
              direction: "incoming",
          }));

          setLolsies((prev) => [...prev, ...formattedMessages]);
      }
  } catch (error) {
      console.error("Error fetching messages:", error);
  }
}, [fetchedMessagesp, handleEmptyFile, handleNewContent]);










  const [messages1, setMessages1] = useState([
    {
      message: "Any Diagnosis Errors?",
      sender: "ChatGPT2",
      direction: "incoming",
    },
  ]);
  const [fetchedMessages1, setFetchedMessages1] = useState([]);

  const fetchMessages1 = useCallback(async () => {
    try {
      const response = await fetch("../../assets/MD_diagnosis_return.txt"); // Fetch from public folder
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

  // const [messages2, setMessages2] = useState([
  //   {
  //     message: "Any Questions?",
  //     sender: "ChatGPT3",
  //     direction: "incoming",
  //   },
  // ]);
  // const [fetchedMessages2, setFetchedMessages2] = useState([]);

  // const fetchMessages2 = useCallback(async () => {
  //   try {
  //     const response = await fetch('../../assets/MD_question_return.txt'); // Fetch from public folder
  //     const text2 = await response.text(); // Read the file contents as text
  //     const newMessages = text2.split('\n').filter(Boolean); // Split by line and filter empty lines

  //     // Only append messages that are new (not already in fetchedMessages)
  //     const newUniqueMessages = newMessages.filter((msg) => !fetchedMessages2.includes(msg));

  //     // Update the state with new unique messages
  //     setFetchedMessages2((prevFetchedMessages) => [
  //       ...prevFetchedMessages,
  //       ...newUniqueMessages,
  //     ]);

  //     // Map new messages to the expected format and update the state
  //     const formattedMessages = newUniqueMessages.map((msg) => ({
  //       message: msg,
  //       sender: "ChatGPT3",
  //       direction: "incoming",
  //     }));

  //     setMessages2((prevMessages) => [...prevMessages, ...formattedMessages]);
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // }, [fetchedMessages2]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchMessages2();
  //   }, 10000);

  //   return () => clearInterval(interval); // Clean up the interval on unmount
  // }, [fetchMessages2]);
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

  // const handleSend = async () => {
  //   if (!inputMessage.trim()) return;

  //   const newMessage = {
  //     message: inputMessage,
  //     sender: "user",
  //     direction: "outgoing",
  //   };

  //   const newMessages = [...messages, newMessage];

  //   // Update the state
  //   setMessages(newMessages);
  //   setInputMessage("");
  //   setIsSending(true);
  //   setTyping(true);

  //   // Send message to ChatGPT and wait for a response
  //   await processMessageToChatGPT(newMessages);
  // };

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

  return (
    <div className="relative min-h-screen overflow-hidden text-white antialiased selection:bg-rose-300 selection:text-rose-800">
      <div className="fixed top-0 -z-5 h-full w-full">
        <ParticlesBackground />
      </div>
      <div className="absolute -z-10 min-h-full w-full bg-gradient-to-r from-[#f0f9fd] to-[#65c0e7]"></div>
      <div className="flex items-start justify-center mb-10">
        <h3 className="uppercase tracking-[20px] text-blue-700 text-2xl mt-[120px] ml-6">
          Medications / Diagnosis
        </h3>
      </div>
      <div className="flex items-center justify-center">
        <button
          className="w-[140px] h-[140px] border-[2px] border-red-500 rounded-full flex items-center justify-center bg-gradient-to-r from-black to-[#0713f5] overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out active:opacity-50"
          onClick={openModal}
        >
          Click Here <br /> to Send Your <br /> Question!!
        </button>
      </div>
      <div className="flex flex-wrap mt-[-60px] pb-20">
        <div className="w-1/2">
          <div className="flex justify-center items-center mb-10 ml-[60px] my-[18px]">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Medications
            </span>
          </div>
          <div className="flex justify-center ml-10">
            <div className="box-border h-[700px] w-[700px] border-[4px] border-blue-300 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500 ease-in-out duration-300 rounded-[1.25rem] bg-white/25 hover:bg-white/75 flex">
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
                      {/* PUT MESSAGE FOR MEDICATION ERROR */}
                      {message.message}
                    </div>
                  </div>
                ))}
                {/* {typing && (
                <div className="flex justify-start mb-4">
                  <div className="bg-pink-500 text-white p-3 rounded-[1.25rem] max-w-xs shadow-lg">
                    ChatGPT is typing...
                  </div>
                </div>
              )} */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex justify-center items-center mb-10 my-[18px] no-scrollbar mr-8">
            <span className="text-2xl my-custom-font font-[10px] tracking-tighter text-blue-700">
              Diagnosis
            </span>
          </div>
          <div className="flex justify-center mr-10">
            <div className="box-border h-[700px] w-[700px] border-[4px] border-blue-300 hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500 ease-in-out duration-300 rounded-[1.25rem] bg-white/25 hover:bg-white/75 flex">
              <div className="overflow-y-auto p-4">
                {messages1.map((message, index) => (
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
                      {/* PUT MESSAGE FOR DIAGNOSIS ERROR */}
                      {message.message}
                    </div>
                  </div>
                ))}
                {/* {typing && (
                <div className="flex justify-start mb-4">
                  <div className="bg-pink-500 text-white p-3 rounded-[1.25rem] max-w-xs shadow-lg">
                    ChatGPT is typing...
                  </div>
                </div>
              )} */}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[1.25rem] p-6 w-[400px] h-[400px] flex flex-col">
            {/* <div className = "flex justify-center items-center"> */}
            <span className="text-red-500 text-center text-3xl font-bold">
              ALERT!!!{" "}
            </span>
            <h2 className="text-2xl font-bold mb-4 text-black text-center">
              A Question From Our System
            </h2>
            {/* </div> */}
            <div className="flex-col flex items-center justify-center">
              <div className="w-[80px] h-[80px]">
                <img src={wavingHand} alt="Waving Hand" />
              </div>
              <div className="mt-4 w-full h-32 p-2 border-[2px] border-gray-300 rounded-[1.25rem] text-black overflow-auto">
                {lolsies[0].message}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded-[1.25rem] mr-2 text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MD;
