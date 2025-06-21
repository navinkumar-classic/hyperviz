import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { dbscan_json } from "./model_explanations";
import ReactMarkdown from 'react-markdown';
import remarkBreaks from "remark-breaks";

export default function Explanation({model,onExplainClick}: {model:string,onExplainClick:Function}){
    const [mdl, setModel] = useState(model);
    const [hovered,setHovered]=useState(false);

    return (
        <div className="bg-[#FAFAFA]  w-full h-full p-6 pb-0 flex flex-col-reverse justify-center">
            <div className="bg-white border-gray-300 shadow-md m-4 mb-0 border-1 rounded-t-sm py-4 px-6 text-justify grow">
                    {mdl === "DBSCAN" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={dbscan_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    
                    {mdl === "KMeans" && "KMeans assigns points to k clusters by minimizing distances to centroids."}
                    {mdl === "KNN" && "KNN classifies a point based on the majority class of its k nearest neighbors."}
            </div>
            <div className={'flex justify-between items-center w-full px-4 '}>
                <div className="text-center font-bold text-2xl leading-[2] pb-2">DBSCAN</div>

                <FontAwesomeIcon icon={faCircleXmark} className="fa-2xl rounded-full" style={{color:hovered?'red':'black',cursor:'pointer'}}
                                 onMouseEnter={()=>{setHovered(true)}} onMouseLeave={()=>setHovered(false)} onClick={()=> onExplainClick()} />

            </div>
        </div>
    )
}