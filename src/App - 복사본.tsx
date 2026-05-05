import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Code2, Store, Lightbulb, X, ShoppingBag, Trophy, BookOpen, Star, Info } from 'lucide-react';
import { runPython } from './skulpt-runner';
import './App.css';

interface StageData {
  id: number;
  title: string;
  type: 'info' | 'coding' | 'quiz';
  description: string | React.ReactNode;
  missionGuide?: string;
  initialCode?: string;
  hint?: string;
  validation?: (vars: any) => { success: boolean; message?: string };
  quizOptions?: string[];
  answer?: string;
}

const stage1Data: StageData[] = [
  { id: 1, title: "파이썬 스마트 스토어 오픈!", type: 'info', description: (<div><p>반갑습니다! 오늘 우리는 파이썬을 활용해 나만의 스마트 스토어를 운영해보는 첫걸음을 뗄 거예요.</p><p style={{ marginTop: '1.5rem' }}>상품 정보를 컴퓨터가 이해할 수 있는 형태로 저장하는 방법, 함께 배워볼까요?</p></div>) },
  { id: 2, title: "학습 목표", type: 'info', description: (<div className="goal-box"><div className="goal-item"><CheckCircle2 color="#2ec4b6" size={24}/><p><strong>자료형의 종류와 특성</strong>을 이해하고 설명할 수 있습니다.</p></div><div className="goal-item"><CheckCircle2 color="#2ec4b6" size={24}/><p><strong>자료형의 특징</strong>을 활용하여 프로그램을 작성할 수 있습니다.</p></div></div>) },
  { id: 3, title: "데이터의 분리배출", type: 'info', description: (<div><p>파이썬도 데이터의 성격에 따라 <strong>종류(자료형)</strong>를 구분해요.</p><div className="recycling-visual"><div className="bin"><div className="bin-icon bin-str">"문자"</div><p>문자열(str)</p></div><div className="bin"><div className="bin-icon bin-int">123</div><p>정수형(int)</p></div><div className="bin"><div className="bin-icon bin-bool">True</div><p>불린형(bool)</p></div></div></div>) },
  { id: 4, title: "데이터를 담는 상자, 변수", type: 'info', description: (<div><p>데이터를 저장하기 위해 이름을 붙인 공간을 <strong>변수</strong>라고 해요.</p><div style={{marginTop: '2rem', textAlign: 'center', padding: '2.5rem', border: '2px dashed #cbd5e0', borderRadius: '24px'}}><div style={{fontSize: '3.5rem'}}>📦</div><p style={{fontWeight: 800, marginTop: '1rem', fontSize: '1.4rem'}}>데이터를 담는 '이름표 붙은 상자'</p></div></div>) },
  { id: 5, title: "연습 1: 상품 이름 등록", type: 'coding', description: "상품의 이름을 문자열(str)로 저장해봅시다.", missionGuide: "변수 product_name에 '딸기우유'를 저장하세요.", initialCode: "product_name = ", hint: "문자열은 반드시 큰따옴표(\" \")로 감싸야 합니다.", validation: (vars) => {
    if (typeof vars.product_name !== 'string') return { success: false, message: "상품명은 따옴표 안에 문자로 입력해야 합니다." };
    return { success: (vars.product_name || "").trim().length > 0 };
  }},
  { id: 6, title: "연습 2: 상품 가격 등록", type: 'coding', description: "계산이 필요한 데이터는 정수형(int)으로 저장해요.", missionGuide: "product_price에 1500을 저장하세요.", initialCode: "product_name = \"딸기우유\"\nproduct_price = ", hint: "숫자 데이터는 따옴표를 쓰지 않습니다.", validation: (vars) => {
    if (typeof vars.product_price !== 'number' || !Number.isInteger(vars.product_price)) return { success: false, message: "가격을 따옴표 없이 정수로 입력했나요?" };
    return { success: true };
  }},
  { id: 7, title: "연습 3: 판매 여부 설정", type: 'coding', description: "상태를 나타낼 때는 True 또는 False만 가지는 불린형(bool)을 사용합니다.", missionGuide: "is_sale 변수에 True를 저장하세요.", initialCode: "product_name = \"딸기우유\"\nproduct_price = 1500\nis_sale = ", hint: "True 또는 False를 입력하세요. (첫 글자는 대문자!)", validation: (vars) => {
    if (typeof vars.is_sale !== 'boolean') return { success: false, message: "True 또는 False를 입력해야 합니다. (따옴표를 빼주세요!)" };
    return { success: vars.is_sale === true };
  }},
  { id: 8, title: "품절 처리 해보기", type: 'coding', description: "is_sale을 False로 바꾸면 진열대에 어떻게 표시될까요?", missionGuide: "is_sale의 값을 False로 수정해보세요.", initialCode: "product_name = \"딸기우유\"\nproduct_price = 1500\nis_sale = False", validation: (vars) => {
    if (typeof vars.is_sale !== 'boolean') return { success: false, message: "불린형(False)을 입력해야 합니다." };
    return { success: vars.is_sale === false };
  }},
  { id: 9, title: "변수 이름 짓는 규칙", type: 'info', description: (<div style={{lineHeight: 2.2, fontSize: '1.2rem'}}>1. 숫자로 시작 불가 (예: 1st ❌)<br/>2. 공백 불가 (예: item name ❌)<br/>3. 특수문자는 언더바(_)만 가능 (예: item_price ✅)<br/>4. 파이썬 예약어(if, for 등) 불가</div>) },
  { id: 10, title: "형성평가 1", type: 'quiz', description: "다음 중 파이썬이 문자열(str)로 인식하는 데이터는?", quizOptions: ["1500", "True", "\"2500\"", "False"], answer: "\"2500\"" },
  { id: 11, title: "형성평가 2", type: 'quiz', description: "다음 중 변수 이름으로 가장 올바른 것은?", quizOptions: ["1st_item", "item-price", "item_price", "item name"], answer: "item_price" },
  { id: 13, title: "형성평가 3", type: 'quiz', description: "파이썬에서 '맞다' 또는 '틀리다'를 나타내는 자료형은?", quizOptions: ["문자열(str)", "정수형(int)", "불린형(bool)", "변수(var)"], answer: "불린형(bool)" },
  { id: 15, title: "Stage 1 최종 미션", type: 'coding', description: "배운 것을 활용해 상품 하나를 완벽히 등록하세요.", missionGuide: "상품명, 가격, 판매여부 변수를 모두 작성하세요.", initialCode: "product_name = \"\"\nproduct_price = \nis_sale = ", validation: (vars) => ({ 
    success: typeof vars.product_name === 'string' && 
             typeof vars.product_price === 'number' && Number.isInteger(vars.product_price) &&
             typeof vars.is_sale === 'boolean' 
  }) }
];

export default function App() {
  const [stepIdx, setStepIdx] = useState(0);
  const [code, setCode] = useState('');
  const [shelfState, setShelfState] = useState<any[] | null>(null);
  const [isCleared, setIsCleared] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // 퀴즈 피드백용 상태
  const [selectedQuizOpt, setSelectedQuizOpt] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  
  // 최종 단계 완료 상태
  const [isFinalStepCleared, setIsFinalStepCleared] = useState(false);

  const currentStep = stage1Data[stepIdx];
  const isWideLayout = (currentStep.id >= 5 && currentStep.id <= 8) || currentStep.id === 15;

  useEffect(() => {
    setCode(currentStep.initialCode || '');
    setIsCleared(currentStep.type === 'info');
    setShelfState(null);
    setError(null);
    setShowHint(false);
    setSelectedQuizOpt(null);
    setQuizFeedback(null);
  }, [stepIdx, currentStep.initialCode, currentStep.type]);

  const handleQuizSelect = (opt: string) => {
    setSelectedQuizOpt(opt);
    const correct = opt === currentStep.answer;
    if (correct) {
      setQuizFeedback({ isCorrect: true, message: "정답입니다! 🎉" });
      setIsCleared(true);
    } else {
      setQuizFeedback({ isCorrect: false, message: "아쉽네요. 다시 한번 생각해보세요! 🤔" });
      setIsCleared(false);
    }
  };

  const handleRun = useCallback(() => {
    setError("");
    setIsCleared(false);
    setShelfState(null);

    if (!code.trim()) { setError("코드를 입력해주세요."); return; }

    try {
      runPython(code, (vars) => {
        const check = currentStep.validation ? currentStep.validation(vars) : { success: true };
        
        if (check.success) {
          setIsCleared(true);
          setShelfState([{
            name: String(vars.product_name || "상품명"),
            price: (currentStep.id === 5) ? null : Number(vars.product_price || 0),
            is_sale: vars.is_sale !== undefined ? vars.is_sale : true
          }]);
          
          // 최종 미션 성공 시 요약창 활성화
          if (currentStep.id === 15) {
            setTimeout(() => setIsFinalStepCleared(true), 1000);
          }
        } else {
          setIsCleared(false);
          setShelfState(null);
          if (check.message) setError(check.message);
        }
      }, (err) => {
        setIsCleared(false);
        setShelfState(null);
        let friendlyMsg = "코드를 확인해 주세요.";
        if (err.includes("NameError: name 'true' is not defined") || err.includes("NameError: name 'false' is not defined")) {
          friendlyMsg = "파이썬의 불린형은 대문자로 시작하는 True, False를 사용해야 합니다.";
        } else if (err.includes("SyntaxError")) {
          friendlyMsg = "문법 오류가 발생했습니다. 코드를 다시 확인해 주세요.";
        }
        setError(friendlyMsg);
      });
    } catch (e) {
      setIsCleared(false);
      setShelfState(null);
      setError("실행 중 오류가 발생했습니다.");
    }
  }, [code, currentStep]);

  return (
    <div className="app-shell">
      <header className="header-area">
        <div className="header-top">
          <span className="title-brand">Python Smart Store</span>
          <span className="stage-badge">Stage 1: 자료형</span>
        </div>
        <div className="progress-track"><div className="progress-thumb" style={{ width: `${((stepIdx + 1) / stage1Data.length) * 100}%` }} /></div>
      </header>
      
      <main className="main-stage">
        <div className="content-card">
          <div className="scrollable-body">
            {currentStep.type === 'info' ? (
              <section className="full-panel">
                <h2 className="step-title">{currentStep.title}</h2>
                <div className="step-description">{currentStep.description}</div>
                <div className="info-next-guide">위 설명을 읽고 학습을 완료했다면 아래의 '다음' 버튼을 누르세요.</div>
              </section>
            ) : currentStep.type === 'quiz' ? (
              <section className="full-panel">
                <h2 className="step-title">{currentStep.title}</h2>
                <div className="step-description" style={{textAlign: 'center', fontSize: '1.4rem', marginBottom: '2rem'}}>{currentStep.description}</div>
                
                <div style={{
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '20px', 
                  padding: '20px',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}>
                  {currentStep.quizOptions?.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleQuizSelect(opt)}
                      style={{
                        minHeight: '80px',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        borderRadius: '16px',
                        border: selectedQuizOpt === opt 
                          ? (opt === currentStep.answer ? '4px solid #10b981' : '4px solid #ef4444') 
                          : '2px solid #e2e8f0',
                        backgroundColor: selectedQuizOpt === opt 
                          ? (opt === currentStep.answer ? '#f0fdf4' : '#fef2f2') 
                          : 'white',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                {quizFeedback && (
                  <div style={{
                    marginTop: '2rem', 
                    textAlign: 'center', 
                    fontSize: '1.2rem', 
                    fontWeight: 800,
                    color: quizFeedback.isCorrect ? '#10b981' : '#ef4444'
                  }}>
                    {quizFeedback.message}
                  </div>
                )}
              </section>
            ) : (
              <>
                <section className={`desc-panel ${isWideLayout ? 'narrow' : ''}`}>
                  <h2 className="step-title">{currentStep.title}</h2>
                  <div className="step-description">{currentStep.description}</div>
                </section>
                <section className={`practice-panel ${isWideLayout ? 'wide' : ''}`}>
                  <div className="mission-panel"><Lightbulb size={20} style={{marginTop: '3px'}} /><span>{currentStep.missionGuide}</span></div>
                  <div className="practice-grid">
                    <div className="editor-box">
                      <div className="area-header"><Code2 size={16}/> 파이썬 코드</div>
                      <textarea className="code-textarea" value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} />
                      <div className="action-bar">
                        <button onClick={() => setShowHint(true)} className="btn-hint">힌트</button>
                        <button onClick={handleRun} className="btn-run"><Play size={14} fill="currentColor"/> 실행</button>
                      </div>
                    </div>
                    <div className="simulator-box">
                      <div className="area-header"><Store size={16}/> 진열대 미리보기</div>
                      <div className="simulator-content">
                        <div className="shelf-unit"><div className="shelf-row">
                          {shelfState?.map((p, i) => (
                            <div key={i} className="product-token">
                              <ShoppingBag size={40} color={p.is_sale !== false ? "#2ec4b6" : "#cbd5e0"} />
                              <span style={{fontSize: '0.8rem', fontWeight: 800, marginTop: '8px', textAlign: 'center'}}>{p.name}</span>
                              {p.price !== null && <span style={{fontSize: '0.75rem', color: '#64748b'}}>{p.price.toLocaleString()}원</span>}
                              {p.is_sale === false && <div className="sold-out-overlay">품절</div>}
                            </div>
                          ))}
                        </div><div className="shelf-base" /></div>
                        {error && <div style={{color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem', fontWeight: 700, textAlign: 'center'}}>{error}</div>}
                        {isCleared && <div style={{color: '#10b981', marginTop: '1rem', fontWeight: 800}}>✅ 미션 성공! [다음]을 누르세요.</div>}
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="nav-footer">
        <button className="btn-base btn-prev" onClick={() => setStepIdx(p => p - 1)} disabled={stepIdx === 0} style={{ visibility: stepIdx > 0 ? 'visible' : 'hidden' }}>이전</button>
        <div style={{fontWeight: 800, color: '#94a3b8'}}>{stepIdx + 1} / {stage1Data.length}</div>
        <button className={`btn-base btn-next ${isCleared ? 'active' : ''}`} onClick={() => setStepIdx(p => p + 1)} disabled={!isCleared} style={{ visibility: stepIdx < stage1Data.length - 1 ? 'visible' : 'hidden' }}>
          {stepIdx === stage1Data.length - 1 ? "학습 완료" : "다음"}
        </button>
      </footer>

      {/* 최종 수료 요약 창 */}
      <AnimatePresence>
        {isFinalStepCleared && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.98)', zIndex: 1000,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <Trophy size={100} color="#f59e0b" style={{ marginBottom: '20px' }} />
            </motion.div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1e293b', marginBottom: '10px' }}>Stage 1 수료를 축하합니다! 🏆</h1>
            <p style={{ fontSize: '1.2rem', color: '#64748b', marginBottom: '30px' }}>오늘 배운 파이썬의 핵심 개념들을 정리해보세요.</p>
            
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', maxWidth: '700px', width: '100%', marginBottom: '40px'
            }}>
              {[
                { title: "문자열 (str)", desc: '" " 따옴표를 사용하여 글자를 저장해요.', icon: <BookOpen size={20}/> },
                { title: "정수형 (int)", desc: '계산이 가능한 숫자 데이터를 저장해요.', icon: <Star size={20}/> },
                { title: "불린형 (bool)", desc: 'True, False로 상태를 나타내요.', icon: <CheckCircle2 size={20}/> },
                { title: "변수 (variable)", desc: "데이터를 담는 '이름표 붙은 상자'예요.", icon: <Info size={20}/> }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '20px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', fontWeight: 800, marginBottom: '8px' }}>
                    {item.icon} {item.title}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.95rem' }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <button 
              className="btn-base btn-next active"
              onClick={() => alert("Stage 2는 준비 중입니다! 수고하셨습니다.")}
              style={{ padding: '15px 40px', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              Stage 2 준비하기
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && (
          <motion.div className="hint-overlay" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <button className="btn-close-hint" onClick={() => setShowHint(false)}><X size={18}/></button>
            <h4 style={{marginBottom: '10px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px'}}><Lightbulb size={20}/> 선생님의 힌트</h4>
            <p>{currentStep.hint}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
