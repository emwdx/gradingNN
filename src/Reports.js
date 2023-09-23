//Reports.js 
import React, { useState} from 'react';
import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';

function ReportPage({ model}) {
  const [batchData, setBatchData] = useState('');
  const [parsedBatchData, setParsedBatchData] = useState([]);
  const [gradedBatchData, setGradedBatchData] = useState([]);

  const handleBatchDataChange = (e) => {
    setBatchData(e.target.value);
    const parsedData = Papa.parse(e.target.value, {
      delimiter: '\t',
      skipEmptyLines: true,
    });
    setParsedBatchData(parsedData.data);
  };

  const handleBatchGrading = () => {
    if (!model) {
      console.error("No trained model available for prediction.");
      return;
    }
    const hasHeader = isNaN(Number(parsedBatchData[0][0]));
    const dataToGrade = hasHeader ? parsedBatchData.slice(1) : parsedBatchData;
    const gradedData = dataToGrade.map((row) => {
      const scores = row.slice(1).map(Number);
      const featureTensor = tf.tensor2d([scores]);
      const prediction = model.predict(featureTensor);
      const grade = Math.round(prediction.dataSync()[0]);
      return [...row, grade];
    });
    if (hasHeader) {
      gradedData.unshift(parsedBatchData[0].concat("Grade"));
    }
    setGradedBatchData(gradedData);
  };

  const handleCopyToClipboard = () => {
    const tableString = gradedBatchData.map(row => row.join('\t')).join('\n');
    navigator.clipboard.writeText(tableString);
  };

  const handleDownload = () => {
    const csvContent = gradedBatchData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'graded_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
 
      <div className="bg-primary text-white p-4 mb-4 rounded">
      <h4>Reports Page</h4>
      <p>
        Use this page to batch grade multiple sets of answers. Paste the tab-separated values 
        into the textarea. Optionally include a header row for easier identification. 
        Click 'Grade Batch' to generate grades based on the model.
      </p>
    </div>
      <textarea
        className="form-control"
        rows="5"
        value={batchData}
        onChange={handleBatchDataChange}
      ></textarea>
      <button className="btn btn-primary mt-2" onClick={handleBatchGrading}>Grade Batch</button>
      <button className="btn btn-secondary mt-2 ml-2" onClick={handleCopyToClipboard}>Copy to Clipboard</button>
      <button className="btn btn-success mt-2 ml-2" onClick={handleDownload}>Download</button>


      {/* Display table */}
{(parsedBatchData.length > 0 || gradedBatchData.length > 0) && (
  <table className="table table-striped mt-4">
    <thead>
      <tr>
        {(gradedBatchData[0] || parsedBatchData[0]).map((col, idx) => (
          <th key={idx}>{col}</th>
        ))}
      </tr>
    </thead>
 
    <tbody>
      {(gradedBatchData.length > 0 ? gradedBatchData : parsedBatchData).slice(1).map((row, idx) => (
        <tr key={idx}>
          {row.map((cell, i) => (
            <td key={i}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)}

    </div>
  );
}

export default ReportPage;
