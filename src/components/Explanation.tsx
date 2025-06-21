import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import { dbscan_json } from "./model_explanations";
import ReactMarkdown from 'react-markdown';

export default function Explanation({model,onExplainClick}){
    const [mdl, setModel] = useState(model);
    const [hovered,setHovered]=useState(false);

    return (
        <div className="bg-[#E9EAEB]  w-full h-full rounded-3xl p-6 flex justify-center">
            <div className=" w-[100%] h-[100%] border border-gray-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] shadow-lg m-4 border-1 rounded-3xl">
                    {mdl === "DBSCAN" && (
                        <div>
                        <div className="text-center font-bold text-lg leading-[2]">DBSCAN</div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown >{dbscan_json.expl}</ReactMarkdown></div>
                        </div>
                    
                    
                    )}
                    
                    {mdl === "KMeans" && "KMeans assigns points to k clusters by minimizing distances to centroids."}
                    {mdl === "KNN" && "KNN classifies a point based on the majority class of its k nearest neighbors."}
            </div>
            <FontAwesomeIcon icon={faWindowClose} className="fa-2xl" style={{color:hovered?'red':'black',cursor:'pointer'}} 
            onMouseEnter={()=>{setHovered(true)}} onMouseLeave={()=>setHovered(false)} onClick={()=> onExplainClick()} />
        </div>
    )
}