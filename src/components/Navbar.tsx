"use client"; 

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="text-black pr-9 pl-9 py-6 border-b-2 border-b-[#D5D7DA] h-[13vh]">
      <div className="container mx-auto flex text-xl justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold flex items-center justify-center">
          <Image src={"/graph.svg"} width={60} height={60} alt="logo"/>
          <div className="mx-4 font-blackOps font-light">HyperViz</div>
        </Link>

        <div>
          <FormControl variant="filled" sx={{ minWidth: 500 }}>
            <InputLabel id="demo-simple-select-filled-label">Choose a Model</InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => console.log("hi")} color="default" sx={{color:"black",ml: 4}}>
            <GitHub fontSize="large"/>
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
