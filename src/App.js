//App.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as tf from '@tensorflow/tfjs';
import { createModel, trainModel } from './MLModel';


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
  const [predictedGrades, setPredictedGrades] = useState([]);
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

  
  const updateQuestionMapping = (question, field, value) => {
    setQuestionMapping({
      ...questionMapping,
      [question]: {
        ...questionMapping[question],
        [field]: value,
      },
    });
  };

  

  const handleSampleDataChange = (e) => {
    const value = e.target.value;
    setSampleData(value);

    try {
      const lines = value.trim().split('\n');
      const data = lines.map(line => line.split('\t'));
      if (data.some(row => row.length !== parseInt(questionCount) + 2)) {
        throw new Error(`Each row must have ${parseInt(questionCount) + 2} columns: One for the name, ${questionCount} for the questions, and one for the level.`);
      }
      setParsedData(data);
      setParseError(null);
    } catch (error) {
      setParseError(error.message);
    }
  };

  const handleInputChange = async (e, index) => {
    const newScores = [...inputScores];
    newScores[index] = Number(e.target.value);
    setInputScores(newScores);
  
    // Here, we assume that predictGrades expects a 2D array
    const prediction = predictGrades([newScores]);
    setPredictedGrade(Math.round(prediction[0]));
  };
  
  

  const handleTrainModel = async () => {
    // Dispose of the old model if it exists
    if (model) {
      model.dispose();
    }
  
    const { featureTensor, labelTensor } = preprocessData();
    const inputShape = featureTensor.shape[1];
    const outputShape = labelTensor.shape[1];
    
    // Create a new model
    const newModel = createModel(inputShape, outputShape);
    console.log("Training features shape:", featureTensor.shape);

    await trainModel(newModel, featureTensor, labelTensor, (epoch, totalEpochs) => {
      const progress = ((epoch + 1) / totalEpochs) * 100;
      setTrainingProgress(progress);
      
    });
    
    setModel(newModel);
  };
  
  const predictGrades = (scores) => {
    const featureTensor = tf.tensor2d(scores); // No slicing
    const predictions = model.predict(featureTensor);
    const predictedLabels = predictions.dataSync();
    return predictedLabels;
  };
  
  const handlePredict = () => {
    // Assuming `parsedData` holds the scores for which you want predictions
  const scores = parsedData.slice(1).map(row => row.slice(1, -1).map(Number)); // Exclude first and last columns if they are identifiers/labels
  console.log("Prediction scores shape:", tf.tensor2d(scores).shape);

  const grades = predictGrades(scores);
  
  setPredictedGrades(grades);
  };
  
  return (
    <div className="container">
      <h1 className="text-primary">Grading App</h1>
      <div className="bg-light p-3 rounded">
        <h2>Quiz Configuration</h2>
        <div className="mb-3">
          <label htmlFor="questionCount" className="form-label">
            Number of Questions
          </label>
          <input
            type="number"
            className="form-control"
            id="questionCount"
            value={questionCount}
            onChange={(e) => setQuestionCount(e.target.value)}
          />
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Question #</th>
              <th scope="col">Level</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: questionCount }, (_, i) => i + 1).map((q) => (
              <tr key={q}>
                <th scope="row">{q}</th>
                <td>
  <input
    type="number"
    className="form-control"
    value={questionMapping[q]?.level || ''}
    onChange={(e) => updateQuestionMapping(q, 'level', e.target.value)}
  />
</td>
<td>
  <input
    type="number"
    className="form-control"
    value={questionMapping[q]?.points || ''}
    onChange={(e) => updateQuestionMapping(q, 'points', e.target.value)}
  />
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-light p-3 rounded mt-3">
        <h2>Initial Sample Data</h2>
        <p>Paste your sample data here as TSV. Each row should represent a student's scores on the quiz.</p>
        <textarea
          className="form-control"
          rows="5"
          value={sampleData}
          onChange={handleSampleDataChange}
        ></textarea>
        {parseError && <div className="alert alert-danger mt-2">{parseError}</div>}
        {parsedData.length > 0 && !parseError && (
          <table className="table table-striped table-hover mt-2">
            <thead>
  <tr>
    {parsedData[0].map((_, i) => (
      <th key={i} scope="col">
        {i === 0 ? 'Name' : i === parsedData[0].length - 1 ? 'Level' : `Q${i}`}
      </th>
    ))}
  </tr>
</thead>

            <tbody>
              {parsedData.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
       
        <button className="btn btn-primary mt-2" onClick={handleTrainModel}>Train Model</button>
        <div className="progress mt-2">
  <div
    className="progress-bar"
    role="progressbar"
    style={{ width: `${trainingProgress}%` }}
    aria-valuenow={trainingProgress}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    {Math.round(trainingProgress)}%
  </div>
</div>

      </div>
      {Array.from({ length: questionCount }, (_, i) => (
  <div key={i}>
    <label>{`Question ${i + 1}`} </label>
    <input 
      type="number" 
      value={inputScores[i]} 
      onChange={(e) => handleInputChange(e, i)}
    />
  </div>
  
))}
<div>

<label>Predicted Grade: </label>
<input type="text" readOnly value={predictedGrade} />

</div>



    </div>
  );
}

export default App;
