import { Stairs, Person } from '@mui/icons-material';

export default function Link({ model, onExplainClick }: {model:string, onExplainClick:Function}){
    const display_properties=(model:string)=>{
        console.log(model)
        onExplainClick(true)
    }
    return(
        <div className="flex flex-col w-[80%] mb-6 md:mt-auto mt-6 font-mont">
            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-3 cursor-pointer' onClick={()=>display_properties(model)}>
                <Stairs fontSize='large' sx={{color: "white"}}/>
                <div className='text-md ml-4 font-bold text-white font-mont'>
                    STEP BY STEP
                </div>
            </div>
            
        </div>
    );
}