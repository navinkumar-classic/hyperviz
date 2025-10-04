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
    <nav className="text-black px-4 sm:px-6 lg:px-9 py-4 sm:py-6 border-b-2 border-b-[#D5D7DA] h-auto sm:h-[13vh]">
      <div className="container mx-auto flex flex-col sm:flex-row text-lg sm:text-xl justify-between items-center gap-4 sm:gap-0">
        <Link href="/" className="text-2xl sm:text-3xl font-bold flex items-center justify-center">
          <Image src={"/graph.svg"} width={40} height={40} className="sm:w-[60px] sm:h-[60px]" alt="logo" />
          <div className="mx-2 sm:mx-4 font-blackOps font-light">HyperViz</div>
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-0 w-full sm:w-auto">
          <FormControl variant="filled" sx={{ minWidth: 280, width: '100%', maxWidth: 500 }}>
            <InputLabel id="model-select-label">Choose a Model</InputLabel>
            <Select
              labelId="model-select-label"
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="knn">KNN</MenuItem>
              <MenuItem value="kmeans">K Means</MenuItem>
              <MenuItem value="linear">Linear and Polynomial Regression</MenuItem>
              <MenuItem value="DBSCAN">DBSCAN</MenuItem>
              <MenuItem value="NaiveBayes">Naive Bayes</MenuItem>
              <MenuItem value="neural">Neural Network: MLP</MenuItem>
              <MenuItem value="Qlearning">Reinforcement Learning</MenuItem>
              <MenuItem value="PCA">PCA</MenuItem>
              <MenuItem value="SOM">SOM</MenuItem>
              <MenuItem value="DecisionTree">Decision Tree</MenuItem>
            </Select>
          </FormControl>

          <IconButton onClick={() => console.log("hi")} color="default" sx={{ color: "black", ml: { xs: 0, sm: 4 } }}>
            <GitHub fontSize="medium" className="sm:text-4xl" />
          </IconButton>
        </div>
      </div>
    </nav>
  );
}
