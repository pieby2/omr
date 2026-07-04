import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [answers, setAnswers] = useState({});
  const [rollNo, setRollNo] = useState(Array(5).fill(null));
  const [name, setName] = useState('');
  const [testName, setTestName] = useState('');
  const [date, setDate] = useState('');
  const sheetRef = useRef(null);

  const leftSquaresCol1 = [1, 6, 10, 14, 18, 23];
  const rightSquaresCol1 = [1, 6, 10, 14, 18, 23];
  const rightSquaresCol2 = [24, 28, 32, 36, 41, 45, 49, 53, 58];
  const rightSquaresCol3 = [59, 63, 67, 71, 76, 80, 84, 88, 93];
  const rightSquaresCol4 = [94, 98, 102, 106, 111, 115, 119, 123, 128];

  const handleOptionClick = (qNum, optIdx) => {
    setAnswers(prev => ({
      ...prev,
      [qNum]: optIdx
    }));
  };

  const handleRollClick = (colIdx, val) => {
    const newRoll = [...rollNo];
    newRoll[colIdx] = val;
    setRollNo(newRoll);
  };

  const handleSavePdf = async () => {
    const element = sheetRef.current;
    
    // Reset scroll position to prevent offset issues on mobile
    window.scrollTo(0, 0);
    
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
    
    const scaledWidth = imgProps.width * ratio;
    const scaledHeight = imgProps.height * ratio;
    
    // Center it horizontally
    const x = (pdfWidth - scaledWidth) / 2;
    
    pdf.addImage(imgData, 'PNG', x, 0, scaledWidth, scaledHeight);
    pdf.save('omr-sheet.pdf');
  };

  const renderQuestionBlock = (start, end, colIndex) => {
    const questions = [];
    for (let i = start; i <= end; i++) {
      const isDummy = i > 100;
      
      const hasLeftSquare = colIndex === 1 && leftSquaresCol1.includes(i);
      const hasRightSquare = 
        (colIndex === 1 && rightSquaresCol1.includes(i)) ||
        (colIndex === 2 && rightSquaresCol2.includes(i)) ||
        (colIndex === 3 && rightSquaresCol3.includes(i)) ||
        (colIndex === 4 && rightSquaresCol4.includes(i));
        
      questions.push(
        <div key={i} className="question-row" style={isDummy ? { visibility: 'hidden' } : {}}>
          {hasLeftSquare && <div className="marker-square left" style={{ visibility: 'visible' }} />}
          <div className="q-number">{isDummy ? '' : i}</div>
          <div className="options">
            {['A', 'B', 'C', 'D'].map((opt, idx) => (
              <div
                key={idx}
                className={`bubble ${answers[i] === idx ? 'selected' : ''}`}
                onClick={() => !isDummy && handleOptionClick(i, idx)}
              >
              </div>
            ))}
          </div>
          {hasRightSquare && <div className="marker-square right" style={{ visibility: 'visible' }} />}
        </div>
      );
    }
    const isDummyBlock = start > 100;
    return (
      <div className="question-block" key={`${start}-${end}`}>
        <div className="block-header" style={isDummyBlock ? { visibility: 'hidden' } : {}}>
          <span>A</span><span>B</span><span>C</span><span>D</span>
        </div>
        {questions}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="omr-sheet-wrapper" ref={sheetRef}>
        <div className="omr-sheet">
          {/* Black alignment squares at corners */}
          <div className="black-square bs-tl"></div>
          <div className="black-square bs-tr"></div>
          <div className="black-square bs-bl"></div>
          <div className="black-square bs-br"></div>

          <div className="header-section">
            <div className="instructions-box">
              <div>
                <div>Instruction for filling the sheet</div>
                <ul className="instructions-list">
                  <li>1. This sheet should not be folded or crushed</li>
                  <li>2. Use only black ball pen</li>
                  <li>3. Circle should darkened completely and properly</li>
                  <li>4.3 Marks for correct answer and -1 for wrong answers.</li>
                </ul>
              </div>
              <div className="methods-img">
                <div>WRONG METHOD</div>
                <div className="method-row" style={{marginBottom: '10px'}}>
                  <span className="method-bubble cross"></span>
                  <span className="method-bubble tick"></span>
                  <span className="method-bubble filled"></span>
                  <span className="method-bubble dot"></span>
                </div>
                <div>CORRECT METHOD</div>
                <div className="method-row">
                  <span className="method-bubble filled"></span>
                  <span className="method-bubble"></span>
                  <span className="method-bubble"></span>
                  <span className="method-bubble"></span>
                </div>
              </div>
            </div>
            
            <div className="info-fields">
              <div className="info-row">
                <div className="info-field">
                  <label>NAME :</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="info-field">
                  <label>TEST NAME :</label>
                  <input type="text" value={testName} onChange={e => setTestName(e.target.value)} />
                </div>
              </div>
              <div className="info-row">
                <div className="info-field">
                  <label>DATE :</label>
                  <input type="text" value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          <div className="main-grid">
            {/* Column 1 */}
            <div className="column">
              <div className="roll-no-section">
                <div className="roll-no-label">Roll No</div>
                <div className="roll-boxes-wrapper">
                  <div className="marker-square left"></div>
                  <div className="marker-square right"></div>
                  <div className="roll-boxes">
                    {rollNo.map((val, idx) => (
                      <div key={idx} className="roll-box">{val !== null ? val : ''}</div>
                    ))}
                  </div>
                </div>
                <div className="roll-bubbles-grid">
                  {[...Array(10).keys()].map(rowIdx => (
                    <div key={rowIdx} className="roll-row">
                      {rowIdx === 3 && <div className="marker-square left" />}
                      {rowIdx === 3 && <div className="marker-square right" />}
                      {rowIdx === 8 && <div className="marker-square left" />}
                      {rowIdx === 8 && <div className="marker-square right" />}
                      
                      <div className="roll-row-label">{rowIdx}</div>
                      <div className="roll-row-bubbles">
                        {[0, 1, 2, 3, 4].map(colIdx => (
                          <div
                            key={colIdx}
                            className={`bubble ${rollNo[colIdx] === rowIdx ? 'selected' : ''}`}
                            onClick={() => handleRollClick(colIdx, rowIdx)}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="subtext">
                <div>HEO सेक्शनल टेस्ट</div>
                <div>100 प्रश्न, 80 मिनट</div>
              </div>

              {renderQuestionBlock(1, 5, 1)}
              {renderQuestionBlock(6, 10, 1)}
              {renderQuestionBlock(11, 15, 1)}
              {renderQuestionBlock(16, 23, 1)}
            </div>

            {/* Column 2 */}
            <div className="column">
              {renderQuestionBlock(24, 30, 2)}
              {renderQuestionBlock(31, 35, 2)}
              {renderQuestionBlock(36, 40, 2)}
              {renderQuestionBlock(41, 45, 2)}
              {renderQuestionBlock(46, 50, 2)}
              {renderQuestionBlock(51, 58, 2)}
            </div>

            {/* Column 3 */}
            <div className="column">
              {renderQuestionBlock(59, 65, 3)}
              {renderQuestionBlock(66, 70, 3)}
              {renderQuestionBlock(71, 75, 3)}
              {renderQuestionBlock(76, 80, 3)}
              {renderQuestionBlock(81, 85, 3)}
              {renderQuestionBlock(86, 93, 3)}
            </div>

            {/* Column 4 */}
            <div className="column">
              {renderQuestionBlock(94, 100, 4)}
              
              {/* Dummy blocks to render the squares aligned with Col 3 */}
              {renderQuestionBlock(101, 105, 4)}
              {renderQuestionBlock(106, 110, 4)}
              {renderQuestionBlock(111, 115, 4)}
              {renderQuestionBlock(116, 120, 4)}
              {renderQuestionBlock(121, 128, 4)}
            </div>
          </div>
        </div>
      </div>
      
      <div className="actions">
        <button className="save-btn" onClick={handleSavePdf}>
          Save as PDF
        </button>
      </div>
    </div>
  );
}

export default App;
