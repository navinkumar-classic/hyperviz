"use client";
import { Url } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Tiles({modelName,name,picture}:{modelName:string,name:string,picture:Url}){
    const Router=useRouter();
    const changemodel=(modelname:string)=>{
    Router.push(`${modelName}`)
  }

  return(
    <motion.div 
      className="group relative aspect-[4/3] cursor-pointer w-full h-[200px] sm:h-[220px] lg:h-[240px] overflow-hidden rounded-xl bg-cover bg-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100" 
      onClick={()=>changemodel(modelName)}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${picture}')` }}></div>
      
      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 group-hover:from-black/80 transition-all duration-300" />
      
      <div className="absolute bottom-0 w-full text-white z-20 p-6">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2" style={{fontFamily:"var(--font-blackOps)"}}>
          {name}
        </h3>
        <p className="text-sm sm:text-base text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Click to explore interactive visualizations
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-5 rounded-xl" />
      
      <div className="absolute inset-0 -top-full group-hover:top-full transition-all duration-700 bg-gradient-to-b from-transparent via-white/10 to-transparent z-15 rounded-xl" />
    </motion.div>
  )
}