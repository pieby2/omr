import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './App.css';

function App() {
  const [answers, setAnswers] = useState({});
  const [rollNo, setRollNo] = useState(Array(6).fill(null));
  const [name, setName] = useState('');
  const [testName, setTestName] = useState('');
  const [date, setDate] = useState('');
  const sheetRef = useRef(null);

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

  const renderQuestionBlock = (start, end) => {
    const questions = [];
    for (let i = start; i <= end; i++) {
      questions.push(
        <div key={i} className="question-row">
          <div className="q-number">{i}</div>
          <div className="options">
            {['A', 'B', 'C', 'D'].map((opt, idx) => (
              <div
                key={idx}
                className={`bubble ${answers[i] === idx ? 'selected' : ''}`}
                onClick={() => handleOptionClick(i, idx)}
              >
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="question-block" key={`${start}-${end}`}>
        <div className="block-header">
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
          {/* Black alignment squares */}
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
                <div className="roll-boxes">
                  {rollNo.map((val, idx) => (
                    <div key={idx} className="roll-box">{val !== null ? val : ''}</div>
                  ))}
                </div>
                <div className="roll-bubbles-grid">
                  <div className="roll-row-label">
                    {[...Array(10).keys()].map(i => <div key={i}>{i}</div>)}
                  </div>
                  <div className="roll-cols">
                    {[0, 1, 2, 3, 4, 5].map(colIdx => (
                      <div key={colIdx} className="roll-col">
                        {[...Array(10).keys()].map(val => (
                          <div
                            key={val}
                            className={`bubble ${rollNo[colIdx] === val ? 'selected' : ''}`}
                            onClick={() => handleRollClick(colIdx, val)}
                          ></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="subtext">
                <div>HEO सेक्शनल टेस्ट</div>
                <div>100 प्रश्न, 80 मिनट</div>
              </div>

              {renderQuestionBlock(1, 5)}
              {renderQuestionBlock(6, 10)}
              {renderQuestionBlock(11, 15)}
              {renderQuestionBlock(16, 23)}
            </div>

            {/* Column 2 */}
            <div className="column">
              {renderQuestionBlock(24, 30)}
              {renderQuestionBlock(31, 35)}
              {renderQuestionBlock(36, 40)}
              {renderQuestionBlock(41, 45)}
              {renderQuestionBlock(46, 50)}
              {renderQuestionBlock(51, 58)}
            </div>

            {/* Column 3 */}
            <div className="column">
              {renderQuestionBlock(59, 65)}
              {renderQuestionBlock(66, 70)}
              {renderQuestionBlock(71, 75)}
              {renderQuestionBlock(76, 80)}
              {renderQuestionBlock(81, 85)}
              {renderQuestionBlock(86, 93)}
            </div>

            {/* Column 4 */}
            <div className="column">
              {renderQuestionBlock(94, 100)}
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
