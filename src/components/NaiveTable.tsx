'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import ProbChart from './probChart';
import PriorBarChart from './Naive/priorProbChart';

type ProbTable = Record<string, Record<string, Record<string, number>>>;

export default function ProbabilityTable({priors, probabilities}:{priors: Record<string, number> | null,probabilities: ProbTable}) {

  return (
    <div className="p-6 max-w-4xl mx-auto">

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
        <div>
          
          <ProbChart probTable={probabilities} />
          {/* 
          <h3 className="font-semibold mb-2">Likelihoods</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(probabilities, null, 2)}
          </pre>
          */}

          
        </div>
        
      )}
      
    </div>
  );
}
