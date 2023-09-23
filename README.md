## GradingNN: A Neural Network-Based Grading System

### Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Requirements](#requirements)
4. [Installation](#installation)
5. [Usage](#usage)
    - [Configuration](#configuration)
    - [Training](#training)
    - [Testing](#testing)
    - [Reports](#reports)
6. [Technologies Used](#technologies-used)
7. [Contributing](#contributing)
8. [License](#license)

### Overview

GradingNN is a web-based application designed to assist educators in implementing a standards-based or competency-based grading system. The application leverages machine learning to automate the grading process, allowing teachers to focus more on instructional strategies. It aims to transition educators from traditional point-based grading to a more nuanced system that better reflects student comprehension.

### Features

- **Flexible Configuration**: Customize question labels and point values.
- **Data Import**: Import sample training data from a spreadsheet.
- **Trainable Model**: Train the machine learning model based on provided sample data.
- **Interactive Testing**: Test the trained model using manual or randomized inputs.
- **Batch Grading**: Grade multiple sets of answers at once.
- **Adjustable Predictions**: Add corrected scores to the training set for better future predictions.

### Requirements

- Node.js
- TensorFlow.js
- React.js
- Bootstrap

### Installation

1. Clone this repository to your local machine.
    ```bash
    git clone https://github.com/yourusername/GradingNN.git
    ```

2. Navigate into the directory.
    ```bash
    cd GradingNN
    ```

3. Install the required packages.
    ```bash
    npm install
    ```

4. Start the development server.
    ```bash
    npm start
    ```

### Usage

#### Configuration
**Page Text:** Use this page to set the number of questions, label each one, and assign points.

1. Set the number of questions for the assessment.
2. Label each question according to its corresponding standard or level.
3. Assign point values to each question.

#### Training
**Page Text:** Paste your sample of training data here from the spreadsheet. Each row should represent a set of points earned on specific questions for the assessment, and the overall level you want to assign for this set of responses.

1. Import or paste sample data in the form of tab-separated values.
2. Each row should represent a student's performance on an assessment.
3. The last column should represent the overall grade or level for that set of answers.

#### Testing
**Page Text:** Train the model using the provided sample data, and then test the model by inputting scores. If you disagree with the predicted score, use the adjust button to add the corrected score to the training set. Be sure to retrain to use this new data!

1. Click the "Train Model" button to train the machine learning model.
2. Input scores to test the trained model's predictions.
3. If you disagree with a prediction, use the "Adjust" button to correct it.

#### Reports
**Page Text:** Use this page to batch grade multiple sets of answers. Paste the tab-separated values into the textarea. Optionally include a header row for easier identification. Click 'Grade Batch' to generate grades based on the model.

1. Paste multiple sets of scores in tab-separated format.
2. Click the "Grade Batch" button to get the predicted grades.
3. The results can be copied to the clipboard or downloaded as a CSV file.

### Technologies Used

- React.js
- TensorFlow.js
- Bootstrap
- Node.js

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to the project.

### License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
