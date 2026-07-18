/**
 * ===============================================================
 *  VSEPR 가상 교과서 웹앱 — 백엔드 뼈대
 *  파일: Code.gs
 *  역할: 웹앱 진입점(doGet), HTML 파셜 include, 학생 정보 임시 검증
 *  ※ 3D 모델링 / 시트 저장 로직은 이후 단계에서 이 파일에 추가합니다.
 * ===============================================================
 */

/** 앱 전역 설정값 (이후 단계에서 시트 ID 등을 여기에 추가) */
const APP_CONFIG = {
  TITLE: '전자쌍 반발 이론 가상 교과서',
  VERSION: '0.1.0-skeleton',
  // SPREADSHEET_ID: '여기에 스프레드시트 ID',   // 2·3단계 저장 기능 붙일 때 사용
  // TEACHER_PASSCODE: '0000'                   // 교사 모드 인증 붙일 때 사용
};

/**
 * 웹앱 진입점.
 * @param {Object} e 쿼리 파라미터 등이 담긴 이벤트 객체
 * @return {HtmlOutput} 렌더링된 메인 페이지
 */
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');

  // 템플릿에서 <?= ?> 로 꺼내 쓸 수 있는 값들
  template.appTitle = APP_CONFIG.TITLE;
  template.appVersion = APP_CONFIG.VERSION;
  template.startStep = (e && e.parameter && e.parameter.step) ? String(e.parameter.step) : '1';

  return template
    .evaluate()
    .setTitle(APP_CONFIG.TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * HTML 파일 조각을 끼워 넣는 헬퍼.
 * Index.html 안에서 <?!= include('Step1'); ?> 형태로 호출합니다.
 * 1~3단계와 교사 페이지를 별도 파일로 분리할 때 이 함수를 사용하세요.
 * @param {string} filename 확장자를 뺀 HTML 파일명
 * @return {string} 해당 파일의 HTML 문자열
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * 학생 정보 형식 확인 (뼈대 버전 — 저장은 하지 않음).
 * 프런트엔드에서 google.script.run 으로 호출합니다.
 * @param {{studentId: string, studentName: string}} payload
 * @return {{ok: boolean, message: string, student: Object}}
 */
function verifyStudent(payload) {
  const id = (payload && payload.studentId ? String(payload.studentId) : '').trim();
  const name = (payload && payload.studentName ? String(payload.studentName) : '').trim();

  if (!/^\d{4,5}$/.test(id)) {
    return { ok: false, message: '학번은 숫자 4~5자리로 입력하세요. 예) 10203', student: null };
  }
  if (name.length < 2) {
    return { ok: false, message: '이름을 두 글자 이상 입력하세요.', student: null };
  }

  return {
    ok: true,
    message: name + ' 학생, 확인되었습니다.',
    student: { studentId: id, studentName: name, verifiedAt: new Date().toISOString() }
  };
}

/**
 * 서버 연결 확인용 핑. 프런트엔드 부팅 시 상태 표시등에 사용합니다.
 * @return {{status: string, version: string, serverTime: string}}
 */
function ping() {
  return {
    status: 'ok',
    version: APP_CONFIG.VERSION,
    serverTime: Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss')
  };
}

/* ---------------------------------------------------------------
 *  이후 단계에서 추가할 함수 자리
 *  function saveMolecule(payload) { ... }        // 1단계 결과 저장
 *  function saveExplanation(payload) { ... }     // 2단계 서술 저장
 *  function submitTextbookPage(payload) { ... }  // 3단계 제출
 *  function getSubmissions(passcode) { ... }     // 교사 모드 조회
 * --------------------------------------------------------------- */
