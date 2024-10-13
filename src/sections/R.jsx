import React from 'react'
import ParticlesBackground from '../components/ParticlesBackground'

const R = () => {
  return (
    <div className = "relative min-h-screen overflow-y-hidden no-scrollbar text-white antialiased selection:bg-rose-300 selection:text-rose-800">
        <div className="fixed top-0 -z-5 h-full w-full">
            <ParticlesBackground />
        </div>
        <div className="absolute -z-10 min-h-full w-full bg-gradient-to-r from-[#f0f9fd] to-[#65c0e7]"></div>
        <div className="flex items-start justify-center">
            <h3 className="uppercase tracking-[20px] text-blue-700 text-2xl mt-[120px] ml-6">
                Reports
            </h3>
        </div>
        <div className = "flex flex-wrap mt-[100px]">
            <div className = "w-1/2">
                <div className = "flex items-center justify-center">
                    <div className = "h-[60px] w-[300px] border-[2px] border-red-500">
                        <div className = "flex flex-col justify-center items-center">
                            Bro
                        </div>
                    </div>
                </div>
            </div>
            <div className = "w-1/2">

            </div>
        </div>
    </div>
  )
}

export default R