// App.js

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import Configuration from './Config';
import SampleData from './SampleData';
import TrainAndTest from './TrainAndTest';
import ReportPage from './Reports'
import 'bootstrap/dist/js/bootstrap.bundle.min';  

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  const [questionCount, setQuestionCount] = useState(5);
  const [questionMapping, setQuestionMapping] = useState({
    1: {label: "level 1", points: 2},
    2: {label:  "level 1", points: 2},
    3: {label:  "level 1", points: 2},
    4: {label:  "level 2", points: 5},
    5: {label:  "level 3", points: 5},
  });
  const [sampleData, setSampleData] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [parseError, setParseError] = useState(null);
  const [model, setModel] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [inputScores, setInputScores] = useState(Array(questionCount).fill(0));
  const [predictedGrade, setPredictedGrade] = useState(null);

  const preprocessData = () => {
    console.log(parsedData)
    const numericalData = parsedData.slice(1).map(row => row.map(Number));

    const features = numericalData.map(row => row.slice(0, -1));
    const labels = numericalData.map(row => row.slice(-1)[0]);

    if (!features || features.length === 0 || !features[0]) {
        console.error("Features array is empty or not in the expected format");
        return;
    }

    try {
        const featureTensor = tf.tensor2d(features, [features.length, features[0].length]);
        const labelTensor = tf.tensor1d(labels);  // No more one-hot encoding
        console.log(featureTensor, labelTensor)
        return { featureTensor, labelTensor };
    } catch (e) {
        console.error("An error occurred while creating the tensor: ", e);
    }
    console.log(parsedData)
  };

  const updateQuestionMapping = (q, field, value) => {
    setQuestionMapping(prevMapping => ({
      ...prevMapping,
      [q]: {
        ...prevMapping[q],
        [field]: field === 'points' ? parseInt(value, 10) : value // Conditionally parse only for 'points'
      }
    }));
  };
  
  useEffect(() => {
    try {
      const lines = sampleData.trim().split('\n');
      const data = lines.map(line => line.split('\t'));
      if (data.some(row => row.length !== parseInt(questionCount) + 1)) {
        throw new Error(`Each row must have ${parseInt(questionCount) + 1} columns: ${questionCount} for the questions, and one for the level.`);
      }
      setParsedData(data);
      setParseError(null);
    } catch (error) {
      setParseError(error.message);
    }
  }, [sampleData, questionCount]);
  

  return (
    <Router>
      <div className="container">
        <h1 className="text-primary">GradingNN</h1>

        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Questions</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sample-data">Calibrate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/train">Training & Testing</Link>
            </li>
            <li className="nav-item">
  <Link className="nav-link" to="/reports">Reports</Link>
</li>

          </ul>
        </nav>

        <div className="slider">
          <Routes>
          <Route path="/" element={<Configuration questionCount={questionCount} setQuestionCount={setQuestionCount} questionMapping={questionMapping} updateQuestionMapping={updateQuestionMapping} />} />
    <Route path="/sample-data" element={<SampleData sampleData={sampleData} setSampleData={setSampleData} parsedData={parsedData} setParsedData={setParsedData} parseError={parseError} setParseError={setParseError} questionCount={questionCount} questionMapping = {questionMapping}/>} />
    <Route path="/train" element={<TrainAndTest model={model} setModel={setModel} preprocessData={preprocessData} setSampleData={setSampleData} sampleData={sampleData} trainingProgress={trainingProgress} setTrainingProgress={setTrainingProgress} inputScores={inputScores} setInputScores={setInputScores} predictedGrade={predictedGrade} setPredictedGrade={setPredictedGrade} setQuestionCount={setQuestionCount} questionCount={questionCount} questionMapping={questionMapping} />} />
    <Route path="/reports" element={<ReportPage model={model} />} />


                  </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;