import React from 'react';
import { useNavigate } from 'react-router-dom';

function SampleData({ sampleData, setSampleData, parsedData, setParsedData, parseError, setParseError, questionCount, questionMapping }) {
  const navigate = useNavigate();
  const handleSampleDataChange = (e) => {
    const value = e.target.value;
    setSampleData(value);

    try {
      const lines = value.trim().split('\n');
      const data = lines.map(line => line.split('\t'));
      if (data.some(row => row.length !== parseInt(questionCount) + 1)) {

        throw new Error(`Each row must have ${parseInt(questionCount) + 1} columns: ${questionCount} for the questions, and one for the level.`);
      }
      setParsedData(data);
      setParseError(null);
    } catch (error) {
      setParseError(error.message);
    }
  };


  return (
    
    <div className="bg-light p-3 rounded mt-3">
      <div className="bg-primary text-white p-4 mb-4 rounded">
  <h4>Training Sample Page</h4>
  <p>Paste your sample of training data here from the spreadsheet. </p><p>Each row should represent a set of points earned on specific questions for the assessment, and the overall level you want to assign for this set of responses.</p>
</div>

      
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
                {i === parsedData[0].length - 1 ? 'Level' : `Q${i + 1}`}  {/* Updated */}
              </th>
            ))}
          </tr>
        </thead>
        <thead>

  <tr>
    {parsedData[0].map((_, i) => (
      <th key={i} scope="col">
        {i === parsedData[0].length - 1 ? '' : questionMapping[i + 1]?.label || ''}
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
      <button className="btn btn-primary " onClick={() => navigate('/')}>
        Back
      </button>
      <button className="btn btn-primary" onClick={() => navigate('/train')}>
        Next
      </button>
    </div>
  );
}

export default SampleData;
