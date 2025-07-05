import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { dbscan_json ,dt_json,pca_json,nn_json,nb_json,lr_json,kmeans_json,knn_json,som_json,rl_json} from "./model_explanations";
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
                    
                    {mdl === "KMeans" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={kmeans_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "KNN" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={knn_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "Linear and Polynomial Regression" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={lr_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "Naive Bayes" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={nb_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "Multi Layer Perceptron" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={nn_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "Qlearning" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={rl_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "PCA" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={pca_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "SOM" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={som_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
                    {mdl === "Decision Tree" && (
                        <div>
                        <div className="prose prose-sm text-gray-800 max-w-none"><ReactMarkdown remarkPlugins={[remarkBreaks]} children={dt_json.expl.replace(/\n/gi, "&nbsp; \n")}/></div>
                        </div>
                    )}
            </div>
            <div className={'flex justify-between items-center w-full px-4 '}>
                <div className="text-center font-bold text-2xl leading-[2] pb-2">{mdl}</div>

                <FontAwesomeIcon icon={faCircleXmark} className="fa-2xl rounded-full" style={{color:hovered?'red':'black',cursor:'pointer'}}
                                 onMouseEnter={()=>{setHovered(true)}} onMouseLeave={()=>setHovered(false)} onClick={()=> onExplainClick(false)} />

            </div>
        </div>
    )
}