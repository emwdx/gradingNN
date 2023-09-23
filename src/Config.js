//Config.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function Configuration({ questionCount, setQuestionCount, questionMapping, updateQuestionMapping }) {

  const navigate = useNavigate();


  

  return (
    <div className="bg-light p-3 rounded">
      <div className="bg-primary text-white p-4 mb-4 rounded">
  <h4>Configuration Page</h4>
  <p>Use this page to set the number of questions, label each one, and assign points.</p>
</div>

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
            <th scope="col">Label</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
        {Array.from({ length: questionCount }, (_, i) => i + 1).map((q) => (
          <tr key={q}>
            <th scope="row">{q}</th>
            <td>
            <input
  type="text"  // Changed from 'number' to 'text'
  className="form-control"
  value={questionMapping[q]?.label || ''}  // Changed 'level' to 'label'
  onChange={(e) => updateQuestionMapping(q, 'label', e.target.value)}  // Changed 'level' to 'label'
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
      <button className="btn btn-primary" onClick={() => navigate('/sample-data')}>
        Next
      </button>
    </div>
  );
}

export default Configuration;
