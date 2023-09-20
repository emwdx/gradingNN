//TrainAndTest.js

import React from 'react';
import * as tf from '@tensorflow/tfjs';
import { trainModel } from './MLModel';

function TrainAndTest({ model, setModel, preprocessData, trainingProgress, setTrainingProgress, inputScores, setInputScores, predictedGrade, setPredictedGrade }) {

    const predictGrades = (scores) => {
      if (!model) {
        console.error("No trained model available for prediction.");
        return;
      }
      const featureTensor = tf.tensor2d(scores);
      const predictions = model.predict(featureTensor);
      const predictedLabels = predictions.dataSync();
      return predictedLabels;
    };
  const handleTrainModel = async () => {
    // Dispose of the old model if it exists
    if (model) {
      model.dispose();
    }
  
    const { featureTensor, labelTensor } = preprocessData();
    const inputShape = featureTensor.shape[1];
    
    // Create a new model
    const newModel = tf.sequential();
    newModel.add(tf.layers.dense({ inputShape: [inputShape], units: 128, activation: 'relu' }));
    newModel.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    newModel.add(tf.layers.dense({ units: 1 }));
    newModel.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  
    await trainModel(newModel, featureTensor, labelTensor, (epoch, totalEpochs) => {
        const progress = ((epoch + 1) / totalEpochs) * 100;
        setTrainingProgress(progress);
      }, setTrainingProgress);  // pass setTrainingProgress here
    
    
    setModel(newModel);
    setTrainingProgress(100)
  };

  const handleInputChange = (e, index) => {
    const newScores = [...inputScores];
    newScores[index] = Number(e.target.value);
    setInputScores(newScores);
  
    const prediction = predictGrades([newScores]);
    setPredictedGrade(Math.round(prediction[0]));
  };

  return (
    <div>
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
      {Array.from({ length: inputScores.length }, (_, i) => (
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

export default TrainAndTest;
