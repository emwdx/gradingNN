// App.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import Configuration from './Config';
import SampleData from './SampleData';
import TrainAndTest from './TrainAndTest';

function App() {
  const [questionCount, setQuestionCount] = useState(5);
  const [questionMapping, setQuestionMapping] = useState({
    1: {level: 1, points: 2},
    2: {level: 1, points: 2},
    3: {level: 1, points: 2},
    4: {level: 2, points: 5},
    5: {level: 3, points: 5},
  });
  const [sampleData, setSampleData] = useState(
    'Name\t1\t2\t3\t4\t5\tLevel\nS1\t2\t2\t2\t3\t0\t8\nS2\t2\t2\t2\t0\t0\t6\nS3\t2\t2\t2\t5\t5\t10\nS4\t2\t2\t2\t3\t5\t10'
  );
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [model, setModel] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [inputScores, setInputScores] = useState(Array(questionCount).fill(0));
  const [predictedGrade, setPredictedGrade] = useState(null);

  const preprocessData = () => {
    const numericalData = parsedData.slice(1).map(row => row.slice(1).map(Number));
    const features = numericalData.map(row => row.slice(0, -1));
    const labels = numericalData.map(row => row.slice(-1)[0]);

    if (!features || features.length === 0 || !features[0]) {
        console.error("Features array is empty or not in the expected format");
        return;
    }

    try {
        const featureTensor = tf.tensor2d(features, [features.length, features[0].length]);
        const labelTensor = tf.tensor1d(labels);  // No more one-hot encoding
        return { featureTensor, labelTensor };
    } catch (e) {
        console.error("An error occurred while creating the tensor: ", e);
    }
  };

  return (
    <div className="container">
      <h1 className="text-primary">Grading App</h1>
      <Configuration
        questionCount={questionCount}
        setQuestionCount={setQuestionCount}
        questionMapping={questionMapping}
        setQuestionMapping={setQuestionMapping}
      />
      <SampleData
        sampleData={sampleData}
        setSampleData={setSampleData}
        parsedData={parsedData}
        setParsedData={setParsedData}
        parseError={parseError}
        setParseError={setParseError}
        questionCount={questionCount}
      />
      <TrainAndTest
        model={model}
        setModel={setModel}
        preprocessData={preprocessData}
        trainingProgress={trainingProgress}
        setTrainingProgress={setTrainingProgress}
        inputScores={inputScores}
        setInputScores={setInputScores}
        predictedGrade={predictedGrade}
        setPredictedGrade={setPredictedGrade}
      />
    </div>
  );
}

export default App;
