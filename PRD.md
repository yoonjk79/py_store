프로젝트 명칭: 파이썬 스마트 스토어 매니저 (Python Smart Store Manager)

1\. 프로젝트 개요목적: 고등학생 정보 교과 프로그래밍 단원 학습을 위한 웹 기반 라이브 코딩 시뮬레이터.핵심 가치: 추상적인 파이썬 문법을 현실적인 편의점 운영 시나리오와 연결하여 시각적 피드백 제공.

연구적 차별성: Skulpt를 활용한 브라우저 내 파이썬 실행, 코드와 그래픽의 실시간 동기화(Live Mirroring), 단계별 비계 설정(Scaffolding).

2\. 사용자 시나리오 (User Story)사용자는 편의점의 '조율사'가 되어 각 스테이지의 문제를 파이썬 코드로 해결한다.

각 스테이지 진입 전, Gems로 생성된 스토리북 컷신을 통해 미션을 확인한다.

왼쪽의 지식 전달 영역에서 문법을 학습하고, 중앙 에디터에 코딩을 한다.코드를 실행하면 오른쪽 시뮬레이터가 실시간으로 반응하며 정답 여부를 판별한다.미션 클리어 시 보상 컷신을 확인하고 다음 단계로 진행한다.3. 학습 단계 및 문법 커리큘럼단계문법 요소시나리오시뮬레이션 반응Stage 1자료형, 변수상품(이름, 가격) 등록상품 진열대에 이름표 생성Stage 2표준 입출력키오스크 인사말 및 이름 입력캐릭터 대사창에 입력값 출력Stage 3제어문 (선택)성인 인증 및 증정품 판별구매 가능 여부 표시/증정품 증정Stage 4제어문 (반복 for)전체 재고 마감 할인 정산모든 가격표의 숫자 일괄 변경Stage 5제어문 (반복 while)재고 소진 시까지 판매 루프물건이 하나씩 줄어들며 0개 시 정지Stage 6다차원 리스트3x5 진열대 공간 관리특정 좌표(r, c)에 상품 배치Bonus클래스/인스턴스스토어 객체화 및 브랜드 생성나만의 편의점 간판/로고 생성4. 기술 스택 (Tech Stack)Frontend: React.js (Vite)Python Engine: Skulpt (Client-side Interpreter)Animation: Framer MotionState Management: React Hooks (useState, useEffect)Asset: Gems (Storybook Image), TTS (Clova Dubbing/Typecast)5. 핵심 기능 요구사항 (Functional Requirements)Live Mirroring: 파이썬 전역 변수값과 리액트 상태를 동기화하여 실시간 UI 반영.Step-by-Step Tracing: 현재 실행 중인 코드 라인을 하이라이트 표시.Smart Feedback: 단순 에러 대신 학습자 오개념을 짚어주는 한국어 힌트 제공.Cutscene System: 스테이지 전/후 스토리텔링 모달 창 구현.Progress Tracking: LocalStorage를 활용한 단계별 클리어 상태 저장.6. 비기능 요구사항 (Non-functional Requirements)안정성: 외부 서버 없이 브라우저 내에서 모든 코드 실행 (API 토큰 리스크 제거).성능: 저사양 학교 PC에서도 부드럽게 구동되도록 애니메이션 최적화.접근성: 큼직한 UI와 고대비 색상을 사용하여 가독성 확보.

