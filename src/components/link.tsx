import { GitHub, Person } from '@mui/icons-material';


export default function Link(){
    return(
        <div className="mt-auto flex flex-col w-[80%] mb-6 font-inter">

            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-3 cursor-pointer'>
                <Person fontSize='large' sx={{color: "white"}}/>
                <div className='text-md ml-4 font-semibold text-white'>
                    About Us
                </div>
            </div>

            <div className='flex flex-row items-center mt-2 bg-black rounded-lg p-3 cursor-pointer'>
                <GitHub fontSize='large' sx={{color: "white"}}/>
                <div className='text-md ml-4 font-semibold text-white'>
                    Check Out GitHub
                </div>
            </div>
            
        </div>
    );
}