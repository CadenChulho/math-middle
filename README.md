# 중1 수학 주간 퀴즈

중학교 1학년 수학 주간 퀴즈 사이트입니다.

## 기능
- 3개 단원 × 30문제씩 문제 뱅크
- 매주 금~목 기준으로 5문제 자동 선정 (하2 + 중2 + 상1)
- 시험 모드 (풀이 중 정오 표시 없음)
- 결과 화면에서 정답 확인 (토글)
- Supabase로 제출 기록 저장
- 관리자 페이지 `/admin`

## 배포 방법

### 1. GitHub 업로드
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-repo>
git push -u origin main
```

### 2. Supabase 테이블 생성
Supabase SQL Editor에서 실행:
```sql
CREATE TABLE quiz_results_middle1 (
  id bigserial primary key,
  student_name text,
  unit_id text,
  unit_name text,
  week_start text,
  week_end text,
  score int,
  total int,
  answers text,
  submitted_at timestamptz
);
```

### 3. Vercel 환경 변수 설정
| 변수명 | 값 |
|--------|-----|
| NEXT_PUBLIC_SUPABASE_URL | Supabase 프로젝트 URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon key |
| ADMIN_PW | 관리자 비밀번호 (기본: math1234!) |

### 4. Vercel 배포
Vercel에서 GitHub 레포 연결 후 자동 배포됩니다.

## 주간 로테이션 방식
- 기준: 매주 금요일 00:00 (KST) ~ 목요일 23:59 (KST)
- 각 단원 30문제에서 난이도별 순환 선택
- 같은 주에 같은 문제가 나오며, 다음 주엔 다른 문제 세트

## 단원 구성
1. 수와 연산 (소인수분해, 정수와 유리수) — 30문제
2. 문자와 식 (문자의 사용, 일차방정식) — 30문제
3. 좌표평면과 그래프 (정비례와 반비례) — 30문제
