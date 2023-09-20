//MLModel.js

import * as tf from '@tensorflow/tfjs';

export const createModel = (inputShape) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [inputShape], units: 128, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));  // No activation function

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',  // Regression loss function
  });

  return model;
};


export const trainModel = async (model, xTrain, yTrain, onEpochEnd, epochs = 100) => {
  const history = await model.fit(xTrain, yTrain, {
    epochs,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        onEpochEnd(epoch, epochs);
      },
    },
  });
  return history;
};
