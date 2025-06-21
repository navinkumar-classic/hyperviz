import { GitHub, Person } from '@mui/icons-material';

export default function Link({ model, onExplainClick }: {model:string, onExplainClick:Function}){
    const display_properties=(model:string)=>{
        console.log(model)
        onExplainClick(true)
    }
    return(
        <div className="mt-auto flex flex-col w-[80%] mb-6 font-inter">
            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-3 cursor-pointer'>
                <Person fontSize='large' sx={{color: "white"}}/>
                <div className='text-md ml-4 font-semibold text-white' onClick={()=>display_properties(model)}>
                    Model Explanation
                </div>
            </div>

            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-3 cursor-pointer'>
                <GitHub fontSize='large' sx={{color: "white"}}/>
                <div className='text-md ml-4 font-semibold text-white'>
                    Check Out Our GitHub
                </div>
            </div>
            
        </div>
    );
}