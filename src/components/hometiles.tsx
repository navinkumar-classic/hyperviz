"use client";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
export default function Tiles({modelName,name,picture}:{modelName:string,name:string,picture:Url}){
    const Router=useRouter();
    const changemodel=(modelname:string)=>{
    Router.push(`${modelname}`)
  }

  return(
    <div className="font-blackOps cursor-pointer w-full mx-9 my-2 border-[1px] border-[#CBCBCB] flex flex-col shadow-[4px_4px_10px_rgba(0,0,0,0.5)] rounded-lg hover:scale-105 active:scale-95 transition-transform duration-150" onClick={()=>changemodel(modelName)}>
      <div className="w-full h-4/5 bg-cover bg-no-repeat bg-center rounded-t-lg" style={{ backgroundImage: `url('${picture}')` }}></div>
      <div className="h-1/5 border-t-[1px] border-[#CBCBCB] text-black flex items-center justify-center rounded-b-lg"><center>{modelName}</center></div>
    </div>
  )
}