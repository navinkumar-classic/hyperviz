import {IconButton, Tooltip} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React from "react";

export default function AttributeList({ AttributeInfo }: { AttributeInfo: { label: string, value: string, description: string, num: number, basis: string }[][] }) {

    return (
        <>
            {AttributeInfo.map((attributes, index) => (
                <div className="mb-3 flex md:flex-row flex-wrap flex-col w-full items-center justify-center" key={`${index}`}>

                    {attributes.map((attribue, index)=>(
                        <h1 className={`${attribue.basis} mr-4 mb-2 border-b-2 border-b-[#E9EAEB] min-w-[200px]`} key={`${index}`}>
                            <div className="text-sm font-light flex">
                                {attribue.label} &nbsp;
                                <Tooltip title={attribue.description} arrow>
                                    <IconButton size="small" sx={{ padding: 0, color: 'black', fontSize: '14px' }}>
                                        <InfoOutlinedIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className="text-xl">{!isNaN(Number(attribue.value)) && attribue.value.trim() !== "" ? Number(attribue.value).toFixed(2): attribue.value}</div>
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