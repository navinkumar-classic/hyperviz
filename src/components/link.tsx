import { GitHub, Person } from '@mui/icons-material';

export default function Link({ model, onExplainClick }: {model:string, onExplainClick:Function}){
    const display_properties=(model:string)=>{
        console.log(model)
        onExplainClick(true)
    }
    return(
        <div className="mt-auto flex flex-col w-full max-w-sm px-2 mb-4 sm:mb-6 font-inter">
            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-2 sm:p-3 cursor-pointer'>
                <Person fontSize='medium' className="sm:text-4xl" sx={{color: "white"}}/>
                <div className='text-sm sm:text-md ml-2 sm:ml-4 font-semibold text-white' onClick={()=>display_properties(model)}>
                    Model Explanation
                </div>
            </div>

            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-2 sm:p-3 cursor-pointer'>
                <GitHub fontSize='medium' className="sm:text-4xl" sx={{color: "white"}}/>
                <div className='text-sm sm:text-md ml-2 sm:ml-4 font-semibold text-white'>
                    Check Out Our GitHub
                </div>
            </div>
            
        </div>
    );
}