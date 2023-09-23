//TrainAndTest.js

import React, { useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import { createModel, trainModel } from './MLModel';  // Import createModel
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



function TrainAndTest({ model, setModel, preprocessData, setSampleData, sampleData, trainingProgress, setTrainingProgress, inputScores, setInputScores, predictedGrade, setPredictedGrade, questionCount, setQuestionCount, questionMapping }) {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = React.useState(false);
const [correctedGrade, setCorrectedGrade] = React.useState('');
const [invalidInputs, setInvalidInputs] = React.useState([]);
const [isModelReady, setIsModelReady] = React.useState(false); 
const [needsRetrain, setNeedsRetrain] = React.useState(false);
const [buttonClass, setButtonClass] = React.useState('btn-primary');


const openModal = () => {
  setIsModalOpen(true);
};

const closeModal = () => {
  setIsModalOpen(false);
};

const handleCorrectedGrade = (e) => {
  setCorrectedGrade(e.target.value);
};

const adjustSample = () => {
  // Close the modal
  closeModal();

  // Create new sample data row with the corrected grade
  const newSampleRow = [...inputScores, correctedGrade].join('\t');

  // Update the sample data
  setSampleData(prevSampleData => {
    const updatedSampleData = `${prevSampleData}\n${newSampleRow}`;
    console.log("Updated sampleData:", updatedSampleData);  // This should log the new state
    return updatedSampleData;
  });

  setNeedsRetrain(true);  // set to retrain
};



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
      console.log('Question Count:', questionCount);
      setNeedsRetrain(false)
      setIsModelReady(false);
  
    
      const { featureTensor, labelTensor } = preprocessData();
      const inputShape = featureTensor.shape[1];
      console.log('Feature Tensor Shape:', featureTensor.shape);
  

      let newModel = model;
  if (!model) {
    newModel = createModel(inputShape);  // create a new model only if none exists
  }
  
      await trainModel(newModel, featureTensor, labelTensor, (epoch, totalEpochs) => {
        const progress = ((epoch + 1) / totalEpochs) * 100;
        setTrainingProgress(progress);
      }, setTrainingProgress);
  
      setModel(newModel);
      setIsModelReady(true);
  

      setTrainingProgress(100)
      
    };

  const randomizeInputs = () => {
    const randomScores = inputScores.map((_, i) => 
      Math.floor(Math.random() * (questionMapping[i + 1]?.points || 1))
    );
    setInputScores(randomScores);
  
    // Update prediction based on new randomized values
    const prediction = predictGrades([randomScores]);
    setPredictedGrade(Math.round(prediction[0]));
  };
  


  const handleInputChange = (e, index) => {
    const newScores = [...inputScores];
    const newInput = Number(e.target.value);
    newScores[index] = newInput;
    setInputScores(newScores);
 
    const maxPoints = questionMapping?.[index + 1]?.points || 0;

    if (newInput > maxPoints) {
      setInvalidInputs(prevInvalid => [...new Set([...prevInvalid, index])]);
    } else {
      setInvalidInputs(prevInvalid => prevInvalid.filter(i => i !== index));
    }
  
    const prediction = predictGrades([newScores]);
    setPredictedGrade(Math.round(prediction[0]));
  };
  /*
  useEffect(() => {
    console.log(inputScores.length, questionCount)
    if (inputScores.length !== questionCount) {
      setInputScores(Array(questionCount).fill(0));
    }
  }, [questionCount]);
  */
 
  useEffect(() => {
    // Toggle button class every 500 ms if it needs retraining
    let interval;
    if (needsRetrain) {
        interval = setInterval(() => {
            setButtonClass(prev => prev === 'btn-primary' ? 'btn-outline-primary' : 'btn-primary');
        }, 500);
    }
    
    // Cleanup interval when component unmounts or needsRetrain becomes false
    return () => clearInterval(interval);
}, [needsRetrain]);

useEffect(() => {
  if (model) {
    setIsModelReady(true);
    setNeedsRetrain(false);
  } else {
    setIsModelReady(false);
    setNeedsRetrain(true);
  }
}, [model]);

  return (
    <div>
   <div className="bg-primary text-white p-4 mb-4 rounded">
  <h4>Training & Testing Page</h4>
  <p>Train the model using the provided sample data, and then test the model by inputting scores.</p>
  <p>If you disagree with the predicted score, use the adjust button to add the corrected score to the training set.</p>
</div>

<button 
              className={`btn mt-2 ${buttonClass} `} 
              onClick={handleTrainModel}
            >
              Train Model
            </button>
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
      <hr></hr>
      <div className={`d-flex flex-column ${isModelReady ? '' : 'text-muted'}`} style={{ pointerEvents: isModelReady ? 'auto' : 'none', opacity: isModelReady ? 1 : 0.6 }}> {/* Add this line to conditionally disable and gray out */}
            
      <h2>Testing</h2>
      <button onClick={randomizeInputs} disabled={!isModelReady}>Randomize</button>
            
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: inputScores.length }, (_, i) => (
              <th key={i}>{`Q${i + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
  <tr>
    {Array.from({ length: inputScores.length }, (_, i) => (
      <td key={i}>
        {/* Display the small message if the input is invalid */}
        {invalidInputs.includes(i) && 
          <small className="text-danger">{`Max points is ${questionMapping[i + 1]?.points || 0}`}</small>
        }
        <input 
  type="number" 
  value={inputScores[i]} 
  onChange={(e) => handleInputChange(e, i)}
  max={questionMapping[i + 1]?.points || 0}
  className={invalidInputs.includes(i) ? "border-danger" : ""}
  style={{ display: "block" }}
/>

      </td>
    ))}
  </tr>
</tbody>


      </table>
      <div>
                    <label>Predicted Grade: </label>
                    <input type="text" readOnly value={predictedGrade} disabled={!isModelReady} /> 
                    <button className="btn btn-warning" type="button" onClick={openModal} disabled={!isModelReady}>Adjust</button>
                </div>
                </div>

      <button className="btn btn-primary" onClick={() => navigate('/sample-data')}>
        Back
      </button>
      <div className={`modal fade ${isModalOpen ? 'show' : ''}`} style={{ display: isModalOpen ? 'block' : 'none' }} tabIndex="-1">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Adjust Grade</h5>
        <button type="button" className="btn-close" onClick={closeModal}></button>
      </div>
      <div className="modal-body">
        <p>Enter Corrected Grade:</p>
        <input type="number" className="form-control" value={correctedGrade} onChange={handleCorrectedGrade} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
        <button type="button" className="btn btn-primary" onClick={adjustSample}>Submit</button>
      </div>
    </div>
  </div>
</div>


    </div>
  );
}

export default TrainAndTest;
