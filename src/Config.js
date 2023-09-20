//Config.js

import React from 'react';

function Configuration({ questionCount, setQuestionCount, questionMapping, updateQuestionMapping }) {
  return (
    <div className="bg-light p-3 rounded">
      <h2>Quiz Configuration</h2>
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
            <th scope="col">Level</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: questionCount }, (_, i) => i + 1).map((q) => (
            <tr key={q}>
              <th scope="row">{q}</th>
              <td>
                <input
                  type="number"
                  className="form-control"
                  value={questionMapping[q]?.level || ''}
                  onChange={(e) => updateQuestionMapping(q, 'level', e.target.value)}
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
    </div>
  );
}

export default Configuration;
