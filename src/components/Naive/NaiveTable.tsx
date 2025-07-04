'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ProbChart from './probChart';
import PriorBarChart from './priorProbChart';

type ProbTable = Record<string, Record<string, Record<string, number>>>;

export default function ProbabilityTable({priors, probabilities}:{priors: Record<string, number> | null,probabilities: ProbTable}) {

  return (
    <div className="md:px-16 px-2 py-4 w-full">

      {priors && (
        <div className="mb-6">
          <PriorBarChart priors={priors}/>
          {/* 
          <h3 className="font-semibold">Prior Probabilities</h3>
          <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(priors, null, 2)}</pre>
          */}
          
        </div>
        
      )}

      {probabilities && (
          <ProbChart probTable={probabilities} />
        
      )}
      
    </div>
  );
}
