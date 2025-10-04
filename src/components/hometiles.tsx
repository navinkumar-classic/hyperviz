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
    <div className="relative aspect-[4/3] cursor-pointer w-full h-[150px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-md bg-cover bg-center hover:scale-105 active:scale-95 transition-transform duration-150" onClick={()=>changemodel(modelName)}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${picture}')` }}></div>
      <div className="absolute bottom-0 w-full text-white text-lg sm:text-xl md:text-2xl flex items-center justify-center left-0 py-2 px-3" style={{fontFamily:"var(--font-blackOps)"}}>
        {name}
      </div>
      <div className="absolute inset-0 rounded-md bg-gradient-to-b from-black/5 to-black/40 z-20" />
    </div>
  )
}