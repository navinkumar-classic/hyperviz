
export default function AttributeList({ AttributeInfo }: { AttributeInfo: { label: string, value: string, num: number, basis: string }[][] }) {

    return (
        <>
            {AttributeInfo.map((attributes, index) => (
                <div className="mb-3 flex flex-wrap w-full items-center justify-center gap-2 sm:gap-4" key={`${index}`}>

                    {attributes.map((attribue, index)=>(
                        <h1 className={`flex-1 min-w-[120px] sm:min-w-[150px] lg:min-w-[200px] border-b-2 border-b-[#E9EAEB] px-2 py-1`} key={`${index}`}>
                            <div className="text-xs sm:text-sm font-light">{attribue.label}</div>
                            <div className="text-sm sm:text-base lg:text-xl">{!isNaN(Number(attribue.value)) && attribue.value.trim() !== "" ? Number(attribue.value).toFixed(2): attribue.value}</div>
                        </h1>
                    ))}

                </div>
            ))}
        </>

    );
}
{/*
export default function AttributeList({ AttributeInfo }: { AttributeInfo: { label: string, value: string, num: number }[][] }) {
    return (
        <>
            {AttributeInfo.map((attributes, index) => (
                <div className="mb-2 flex md:flex-row flex-col w-full items-center justify-center" key={`${index}`}>

                    {attributes.map((attribue, index)=>(
                        <h1 className={`basis-1/${attribue.num} mr-4`} key={`${index}`}>
                            <span className="font-bold italic text-xl">{attribue.label}:</span>
                            <span className="text-xl">&nbsp; {attribue.value}</span>
                        </h1>
                    ))}

                </div>
            ))}
        </>

    );
}
*/}