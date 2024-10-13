import React, { useState, useRef } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import axios from 'axios';
import { Link } from "react-router-dom";
import taxCutImage from "../assets/taxCut.jpg";
import ParticlesBackground from "../components/ParticlesBackground";
import MEDiator from "../assets/MED-iator.png";
import { PROJECT1, PROJECT2 } from "../constants";
import { MdArrowOutward } from "react-icons/md";
import drmario from "../assets/drmario.webp"
import { PiPrescription } from "react-icons/pi";
import { MdOutlineLocalHospital } from "react-icons/md";
import docScribe from "../assets/DocScribeImg.jpg"
import { VscErrorSmall } from "react-icons/vsc";
import { GiMedicines } from "react-icons/gi";
import medicineImg from "../assets/medicine.png";
import patientHistory from "../assets/medScribe.webp";


const Dashboard = () => {
  const [text, count] = useTypewriter({
    words: [
      "Hey there! Welcome to DocScribe!",
      "Upload your Patient History to get started!",
      "Providing medical feedback and accuracy to doctors and patients!",
      "Make sure your health is in the right hands!",
    ],
    loop: true,
    delaySpeed: 500,
  });

  const [submitDocument, setSubmitDocument] = useState(false)

  const documentToggle = async () => {

  }

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('fileInputRef is not attached to the input element');
    }
  };


  const handleRefineClick = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5173/refine', null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        console.log('Refinement process started successfully');
      } else {
        console.error('Failed to start refinement process');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    const formData = new FormData();

    // Append each file along with its relative path to the FormData object
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        formData.append('files', file);
        formData.append('paths', file.webkitRelativePath);
    }

    try {
        const response = await axios.post('http://127.0.0.1:5173/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        console.log('Files uploaded successfully:', response.data);
    } catch (error) {
        console.error('Upload error:', error.response.data);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white antialiased selection:bg-rose-300 selection:text-rose-800 hide-scrollbar">
      <div className="fixed top-0 -z-5 h-full w-full">
        <ParticlesBackground />
      </div>
      <div className="absolute -z-10 min-h-full w-full bg-gradient-to-r from-[#F0F9FD] to-[#65C0E7]"></div>
      <div className="flex flex-col items-center justify-center mt-[120px]">
        <h1 className="text-5xl lg:text-4xl font-light tracking-tight px-10 mb-4">
          <span className="text-blue-700">{text}</span>
          <Cursor cursorColor="#F7AB0A" />
        </h1>
        <img
            src = {docScribe}
            alt = "DocScribe"
            className = "rounded-full object-cover mx-auto h-24 w-24 z-10 border-[2px] border-blue-700"
        />
      </div>
      <div className="flex flex-wrap mt-[100px]">
        <div className="w-1/3">
          <div className="ml-20 flex items-center justify-center relative top-[-150px]">
            {PROJECT1.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl md:mx-auto sm:mx-20 border-[4px] border-sky-500 hover:shadow-2xl hover:shadow-sky-500 transition-shadow duration-300 ease-in-out"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className={project.imageClassName}
                />
                <GiMedicines className = "absolute inset-0 m-auto z-10 text-8xl text-white opacity-100 transition-opacity duration-300 group-hover:opacity-0 flex items-center justify-center"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 backdrop-blur-lg transition-opacity duration-300 hover:opacity-100">
                  <h3 className="2xl:text-2xl 2xl:mb-10 xl:text-md xl:mb-2 lg:text-lg lg:mb-6 md:text-[1.05rem] md:mb-4 sm:text-xl sm:mb-8 text-lg text-center font-light tracking-tight">
                    {project.name}
                  </h3>
                  <p className="p-4 2xl:text-[1.125rem] 2xl:mb-12 xl:text-sm xl:mb-4 lg:text-[1rem] lg:mb-8 md:text-[0.92rem] md:mb-6 sm:text-[1rem] sm:mb-10 text-sm mb-2 tracking-tight font-light">
                    {project.description}
                  </p>
                  <Link
                    to = "/MD"
                    className={project.buttonClassName}
                  >
                    <div className="z-10 flex items-center">
                      <span className="2xl:text-[1.125rem] xl:text-sm lg:text-[1rem] md:text-sm sm:text-[1rem] text-sm font-light tracking-tight">
                        Meds/Diagnosis
                      </span>
                      <MdArrowOutward />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className = "w-1/3">
            <div className = "flex flex-col items-center justify-center">
              <div className = "flex items-center justify-center bg-blue-500 rounded-full mx-6">
                <span className = "py-4 px-6 text-white text-center">Hey there! Please click the Patient Form below to give us your patient history before meeting with your doctor.</span>
              </div>
              <input
                type="file"
                ref={fileInputRef} // Attach the ref here
                onChange={handleFileChange}
                style={{ display: 'none' }}
                directory="false"
              />
              <button className = "hover:opacity-50 ease-in-out duration-300 hover:scale-150" onClick={handleButtonClick}>
                <img
                    src = {patientHistory}
                    alt = "Patient History Form"
                    className = "ml-8 w-[220px] h-[240px] relative top-[60px] z-10"
                />
              </button>      
            </div> 
        </div>
        <div className="w-1/3">
          <div className="flex items-center justify-center mr-20 relative top-[-150px]">
            {PROJECT2.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-3xl md:mx-auto sm:mx-20 border-[4px] border-sky-500 hover:shadow-2xl hover:shadow-sky-500 transition-shadow duration-300 ease-in-out"
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className={project.imageClassName}
                />
                <VscErrorSmall className = "absolute inset-0 m-auto z-10 text-[10rem] text-white opacity-100 transition-opacity duration-300 group-hover:opacity-0 flex items-center justify-center"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 backdrop-blur-lg transition-opacity duration-300 hover:opacity-100">
                  <h3 className="2xl:text-2xl 2xl:mb-10 xl:text-md xl:mb-2 lg:text-lg lg:mb-6 md:text-[1.05rem] md:mb-4 sm:text-xl sm:mb-8 text-lg text-center font-light tracking-tight">
                    {project.name}
                  </h3>
                  <p className="p-4 2xl:text-[1.125rem] 2xl:mb-12 xl:text-sm xl:mb-4 lg:text-[1rem] lg:mb-8 md:text-[0.92rem] md:mb-6 sm:text-[1rem] sm:mb-10 text-sm mb-2 font-light tracking-tight">
                    {project.description}
                  </p>
                  <Link
                    to = "/OR"
                    className={project.buttonClassName}
                  >
                    <div className="z-10 flex items-center">
                      <span className="2xl:text-lg xl:text-sm lg:text-[1rem] md:text-sm sm:text-[1rem] text-sm font-light tracking-tight">
                        Clinical Errors
                      </span>
                      <MdArrowOutward />
                    </div>
                  </Link>
                  <div>
                    <button
                      onClick={handleRefineClick}
                      className="text-white bg-blue-700 hover:bg-blue-800 p-2 rounded-lg mt-4"
                    >
                      Refine
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
