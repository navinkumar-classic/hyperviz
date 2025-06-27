"use client";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
export default function Tiles({modelName,name,picture}:{modelName:string,name:string,picture:Url}){
    const Router=useRouter();
    const changemodel=(modelname:string)=>{
    Router.push(`${modelname}`)
  }

  return(
    <div className=" cursor-pointer w-1/4 h-1/2 mt-[4%] border-[3px] border-black flex flex-col shadow-[4px_4px_10px_rgba(0,0,0,0.5)] rounded-lg hover:scale-105 active:scale-95 transition-transform duration-150" onClick={()=>changemodel(modelName)}>
      <div className="w-full h-4/5 border-black border-[2px] bg-contain bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `url('${picture}')` }}></div>
      <div className="h-1/5 bg-black text-[#E9EAEB] flex items-center justify-center"><center>{modelName}</center></div>
    </div>
  )
}