//MLModel.js

import * as tf from '@tensorflow/tfjs';

export const createModel = (inputShape) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({
    inputShape: [inputShape],
    units: 40,
    activation: 'relu',
    kernel_regularizer: tf.regularizers.l2({l2: 0.01})  // Updated this line
  }));
  model.add(tf.layers.dense({
    units: 20,
    activation: 'relu',
    kernel_regularizer: tf.regularizers.l2({l2: 0.01})  // Updated this line
  }));
  model.add(tf.layers.dense({
    units: 1
  }));
  
  const adam = tf.train.adam(0.001);
  
  model.compile({
    optimizer: adam,
    loss: 'meanSquaredError'
  });

  return model;
};


export const trainModel = async (model, xTrain, yTrain, onEpochEnd, setTrainingProgress, epochs = 800) => {
  let previousLoss = null;
  let epochCount = 0;

  const history = await model.fit(xTrain, yTrain, {
    epochs,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        epochCount++;
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);

        // Calculate the rate of change of loss
        if (previousLoss !== null) {
          const lossChangeRate = Math.abs((logs.loss - previousLoss) / previousLoss);
          
          // Check for stopping conditions: either rate of loss change is low or max epochs reached
          if ((lossChangeRate < 0.0005 && epochCount > 200) || epochCount >= 800) {
            console.log("Stopping training due to small loss change rate or max epochs reached.");
            model.stopTraining = true;
            setTrainingProgress(100);  // Set progress bar to 100%
          }
        }

        // Update the previous loss for the next iteration
        previousLoss = logs.loss;

        // Update the training progress, this can be used to update a progress bar in UI
        onEpochEnd(epoch, epochs);
      },
    },
  });

  return history;
};