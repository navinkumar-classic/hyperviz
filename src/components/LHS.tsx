import { JSX, ReactNode } from "react";
import React from "react";
import { Tooltip, IconButton  } from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, InputLabel, FormControl, NativeSelect, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from "@mui/material";

export default function LHS({ buttonsList, heading, parameters, description }: { buttonsList: { name: string; func: () => void; }[][], heading: string, parameters: string[], description: string[] }) {
    const actionsMap = Object.fromEntries(
        buttonsList.flat().map(button => [button.name, button.func])
    );

    const changeFunction = (event: SelectChangeEvent<string>, child: ReactNode) => {
        const selectedValue = event.target.value;
        if (actionsMap[selectedValue]) actionsMap[selectedValue](); 
    };

    return (
        <>
            <div className="w-[80%] rounded-tr-2xl rounded-bl-2xl bg-white my-4 py-4 flex flex-col items-center text-black px-4 border-t-3 border-t-[#E9EAEB] border-b-3 border-b-[#E9EAEB]">
                <div className="text-xl font-semibold text-center mb-2 pl-2">{heading}</div>
                <div className="text-md font-light italic text-center pb-2">Choose Your HyperParameter</div>
            </div>

            {buttonsList.map((buttons, btnindex) => (
            <div className="mb-5 w-[80%]" key={btnindex}>
                {/*<FormControl fullWidth>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        <span className="font-mont text-lg font-extralight" >{parameters[btnindex]}</span>
                    </InputLabel>
                    <NativeSelect
                        defaultValue={30}
                        inputProps={{
                            name: 'age',
                            id: 'uncontrolled-native',
                        }}
                        onChange={changeFunction}
                    >
                    {buttons.map((button, index) => {
                        return <option value={button.name} key={index}>{button.name}</option>
                    })}
                    </NativeSelect>
                </FormControl>*/}

                <FormControl fullWidth variant="standard">
                        <InputLabel id="demo-simple-select-standard-label">
                            {parameters[btnindex]} &nbsp;

                            <Tooltip title={description[btnindex]} arrow>
                                <IconButton size="small" sx={{ color: 'black' }}>
                                    <InfoOutlinedIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                        </InputLabel>

                    <Select
                        labelId = "demo-simple-select-standard-label"
                        id = "demo-simple-select-standard"
                        onChange = {changeFunction}
                        label = {parameters[btnindex]}
                        defaultValue = {buttons[0].name}
                        >
                        {buttons.map((button, index) => {
                            return <MenuItem value={button.name} key={index}>{button.name}</MenuItem>
                        })}
                    </Select>
                </FormControl> 
            </div>    
            ))}

            {/*buttonsList.map((buttons, btnindex) => (

                <div className="w-[80%] mb-4" key={btnindex}>
                    <h2 className="italic text-lg font-semibold text-white bg-blue-400 p-2 w-[80%] rounded-tr-xl rounded-tl-md pl-4">
                        {parameters[btnindex]}
                    </h2>

                    <ButtonGroup
                        orientation="vertical"
                        aria-label="Vertical button group"
                        variant="contained"
                        className="w-full"
                        key={btnindex}
                    >
                        {buttons.map((button, index) => {
                            return <Button key={button.name} onClick={button.func} sx={{ textTransform: "none", fontSize: "large", fontFamily: "var(--font-one);" }}>{button.name}</Button>
                        })}


                    </ButtonGroup>
                </div>

            ))*/}

        </>
    );
}