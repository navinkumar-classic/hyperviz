"use client";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import {AnimatePresence, motion} from "framer-motion";

export default function Tiles({modelName,name,picture}:{modelName:string,name:string,picture:Url}){
    const Router=useRouter();
    const changemodel=(modelname:string)=>{
    Router.push(`${modelName}`)
  }

  return(
    <div className=" relative  aspect-[4/3] cursor-pointer w-full h-[200px] mt-[4%] overflow-hidden rounded-md bg-cover bg-center hover:scale-105 active:scale-95 transition-transform duration-150" onClick={()=>changemodel(modelName)}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${picture}')` }}></div>
      <div className="absolute bottom-0 w-full text-[#000000] text-2xl flex left-3 py-1" style={{fontFamily:"var(--font-blackOps)"}}><center>{name}</center></div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-black/5 to-black/40 z-20" />
    </div>
  )
}