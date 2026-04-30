# Supabase 데이터베이스 스키마

## notes 테이블

메모 데이터를 저장하는 테이블입니다.

### SQL

```sql
-- notes 테이블 생성
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- RLS 정책: 사용자는 자신의 메모만 조회, 수정, 삭제 가능
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notes" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes" ON notes
  FOR DELETE USING (auth.uid() = user_id);

-- 인덱스
CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);
```

### 설정 방법

1. Supabase 대시보드에서 SQL 편집기를 엽니다
2. 위 SQL 코드를 복사하여 실행합니다
3. notes 테이블이 생성되었는지 확인합니다
