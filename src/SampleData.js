import React from 'react';

function SampleData({ sampleData, setSampleData, parsedData, setParsedData, parseError, setParseError, questionCount }) {
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

  return (
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
    </div>
  );
}

export default SampleData;
