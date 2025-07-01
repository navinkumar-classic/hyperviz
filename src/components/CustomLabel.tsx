import {IconButton, Tooltip} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import React from "react";

export default function CustomLabel({definition, label}: { definition: string, label: string}) {
    return (
        <span>
            {label} &nbsp;
            <Tooltip title={definition} arrow>
                <IconButton size="small" sx={{ padding: 0, color: 'black'}}>
                    <InfoOutlinedIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </span>
    );
}