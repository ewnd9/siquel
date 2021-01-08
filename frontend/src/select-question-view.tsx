import React from 'react';

export const SelectQuestionView = ({ io, state, setState }) => {
  return (
    <div>
      <div>{state.round.name}</div>
      <table>
        <tbody>
          {state.round.themes.map((theme, index) => (
            <tr key={index}>
              <td>{theme.name}</td>
              {theme.questions.map((question, index) => (
                <td
                  key={index}
                  onClick={() => {
                    io.emit(
                      'SELECT_QUESTION',
                      {
                        id: question.id,
                      },
                      (state) => {
                        setState(state);
                      }
                    );
                  }}
                >
                  {question ? question.price : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
