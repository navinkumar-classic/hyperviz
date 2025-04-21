type ProbTable = Record<string, Record<string, Record<string, number>>>;

interface PredictionResult {
  predictedClass: string;
  classProbabilities: Record<string, number>;
  featureProbabilities: Record<string, Record<string, number>>; // feature -> class -> prob
}

export function predictNaiveBayesClass(
  input: Record<string, string>,  // e.g., { weather: "sunny", temp: "hot", ... }
  probabilities: ProbTable,
  priors: Record<string, number>,
  k: number = 1  // apply Laplace smoothing only for unknown values
): PredictionResult {
  const classes = Object.keys(priors);
  const logSums: Record<string, number> = {};
  const featureProbabilities: Record<string, Record<string, number>> = {};

  // Initialize logSums with log priors
  for (const cls of classes) {
    logSums[cls] = Math.log(priors[cls] ?? 1e-6);
  }

  // Go through each feature in input
  for (const feature in input) {
    const value = input[feature];
    featureProbabilities[feature] = {};

    for (const cls of classes) {
      let prob: number;

      if (probabilities[feature]?.[value]?.[cls] !== undefined) {
        // Known value: use existing probability
        prob = probabilities[feature][value][cls];
      } else {
        // Unknown value: apply Laplace smoothing
        // Assume equal distribution over all seen values + k
        const possibleValues = Object.keys(probabilities[feature] ?? {});
        const numValues = possibleValues.length || 1;
        prob = k / (k * numValues + Object.values(probabilities[feature]?.[possibleValues[0]] ?? {}).reduce((a, b) => a + b, 0));
      }

      logSums[cls] += Math.log(prob || 1e-6);
      featureProbabilities[feature][cls] = prob;
    }
  }

  // Convert logSums to softmax-like probabilities
  const maxLog = Math.max(...Object.values(logSums));
  const expSums: Record<string, number> = {};
  for (const cls of classes) {
    expSums[cls] = Math.exp(logSums[cls] - maxLog);
  }

  const total = Object.values(expSums).reduce((a, b) => a + b, 0);
  const classProbabilities: Record<string, number> = {};
  for (const cls of classes) {
    classProbabilities[cls] = expSums[cls] / total;
  }

  const predictedClass = Object.entries(classProbabilities).reduce((maxCls, [cls, prob]) =>
    prob > classProbabilities[maxCls] ? cls : maxCls, classes[0]);

  return {
    predictedClass,
    classProbabilities,
    featureProbabilities,
  };
}
