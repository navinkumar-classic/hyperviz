"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconButton, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function Navbar() {
  const [selectedModel, setSelectedModel] = useState("");
  const router = useRouter();

  const handleModelChange = (event: any) => {
    const value = event.target.value;
    setSelectedModel(value);

    // Redirect based on selected value
    router.push(`/${value}`)
  };

  return (
    <nav className="text-black md:pr-9 pr-3 md:pl-9 pl-3 md:py-6 py-4 border-b-2 border-b-[#D5D7DA]">
      <div className="container mx-auto flex text-xl justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold flex items-center justify-center">
          <Image src={"/graph.svg"} width={60} height={60} alt="logo" />
          <div className="mx-4 font-blackOps font-light md:flex hidden">HyperViz</div>
        </Link>

        <div className={'md:w-[50%] w-[70%] flex'}>
          <FormControl variant="filled" className={`grow`}>
            <InputLabel id="model-select-label">Choose a Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <MenuItem value="">
                <em>Home</em>
              </MenuItem>
              <MenuItem value="kmeans">K Means</MenuItem>
              <MenuItem value="linear">Linear and Polynomial Regression</MenuItem>
              <MenuItem value="DBSCAN">DBSCAN</MenuItem>
              <MenuItem value="NaiveBayes">Naive Bayes</MenuItem>
              <MenuItem value="Qlearning">Reinforcement Learning</MenuItem>
              <MenuItem value="PCA">PCA</MenuItem>
              <MenuItem value="SOM">SOM</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={() => console.log("hi")} color="default" sx={{ color: "black", ml: 0.5 }}>
            <GitHub fontSize="large" />
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
