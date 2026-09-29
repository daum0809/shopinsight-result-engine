# ShopInsight Result Engine

ShopInsight AI 팀 프로젝트 **4번 결과 출력단** 독립 MVP입니다.

## 담당 범위
- KPI 계산식을 코드에 고정
- 전월 대비 변화율 계산
- 채널/상품별 분석용 데이터 생성
- OpenAI에 전달할 구조화 데이터 생성
- 5번 대시보드가 사용할 JSON 출력

## 실행 흐름
더미 데이터 → KPI 계산 → 변화율 계산 → 분석 근거 생성 → 결과 JSON 출력

## KPI
- CTR = 클릭 / 노출
- CVR = 구매 / 방문
- ROAS = 매출 / 광고비
- CPC = 광고비 / 클릭
- CPA = 광고비 / 구매
- AOV = 매출 / 구매
- 장바구니율 = 장바구니 / 방문

## 설계 원칙
**계산은 코드, 해석은 AI.**

LLM이 매출·ROAS·CVR 등의 산술 계산을 직접 하지 않습니다. 동일한 입력은 항상 동일한 KPI를 반환합니다. AI에는 계산 완료된 결과를 전달하여 사실, 원인 후보, 다음 액션을 설명하게 합니다.

## 파일
- `result-engine.js`: KPI 계산 엔진
- `app.js`: 샘플 데이터 및 결과 렌더링
- `index.html`: 독립 테스트 화면
- `styles.css`: 테스트 UI

## 팀 연동
3번 CSV 입력 담당자는 파싱된 rows 배열을 전달합니다.

4번은 `buildResult(rows)`를 실행합니다.

5번 대시보드는 반환된 JSON의 `current`, `changes`, `channels`, `products`를 사용하면 됩니다.

## OpenAI 연결 시 보안
OpenAI API Key를 GitHub Pages나 브라우저 JavaScript에 직접 넣지 않습니다. 실제 AI 호출은 서버 또는 서버리스 함수에서 수행합니다.


## 팀 통합
팀 저장소에 직접 쓰기 권한이 없는 경우 이 저장소의 `result-engine.js`를 가져가면 됩니다. 상세 계약은 [TEAM_HANDOFF.md](TEAM_HANDOFF.md)를 참고하세요.
