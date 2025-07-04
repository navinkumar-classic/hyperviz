import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface PredictionResult {
  predictedClass: string;
  classProbabilities: Record<string, number>;
  featureProbabilities: Record<string, Record<string, number>>;
}

interface Props {
  result: PredictionResult;
  input: string[]
}

const PredictionResultDisplay: React.FC<Props> = ({ result, input }) => {
  const { predictedClass, classProbabilities, featureProbabilities } = result;

  const classes = Object.keys(classProbabilities);
  const features = Object.keys(featureProbabilities);

  return (
    <div className="w-full flex flex-col gap-10 mt-6 md:text-lg text-sm">

      <div className='text-xl font-semibold'>
        <span className='italic'>Predicted Class -</span> {result.predictedClass.toUpperCase()}
      </div>

      {/* Class Probabilities */}
      <Card className="">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-medium">Class Probabilities</Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#333' }}>
                {classes.map((cls) => (
                  <TableCell key={cls} sx={{ color: 'white' }}>{cls.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                {classes.map((cls) => (
                  <TableCell key={cls}>
                    {(classProbabilities[cls] * 100).toFixed(2)}%
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Feature Probabilities */}
      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-medium">Feature-wise Probabilities</Typography>
          <Table>
            
            <TableHead>
              <TableRow sx={{ backgroundColor: '#333' }}>
                <TableCell sx={{ color: 'white' }}>Feature</TableCell>
                {classes.map((cls) => (
                  <TableCell key={cls} sx={{ color: 'white' }}>{cls.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {features.map((feature, index) => (
                <TableRow
                  key={feature}
                  sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e0e0e0' }}
                >
                  <TableCell className="capitalize">{feature}: {input[index]}</TableCell>
                  {classes.map((cls) => (
                    <TableCell key={cls}>
                      {(featureProbabilities[feature][cls] * 100).toFixed(2)}%
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResultDisplay;
