const XLSX = require('xlsx');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 엑셀 파일 경로 (Movies.xlsx가 현재 작업 디렉토리에 있다고 가정)
const excelFilePath = path.join(__dirname, 'Movies.xlsx');

// SQLite 데이터베이스 경로
const dbFilePath = path.join(__dirname, 'movies.db');

// 엑셀 파일을 읽어들입니다.
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0]; // 첫 번째 시트를 사용한다고 가정
const sheet = workbook.Sheets[sheetName];

// 엑셀 데이터를 JSON 형식으로 변환
const data = XLSX.utils.sheet_to_json(sheet);

// SQLite 데이터베이스 연결
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('데이터베이스 연결 성공');
  }
});

// movies 테이블 생성 (테이블이 존재하지 않으면 생성)
db.run(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    original_title TEXT,
    overview TEXT,
    release_date TEXT,
    poster_path TEXT,
    backdrop_path TEXT,
    popularity REAL,
    vote_average REAL,
    vote_count INTEGER
  )
`, (err) => {
  if (err) {
    console.error('movies 테이블 생성 오류:', err.message);
  } else {
    console.log('movies 테이블 생성 성공');
  }
});

// comments 테이블 생성 (테이블이 존재하지 않으면 생성)
db.run(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER,
    comment TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies (id)
  )
`, (err) => {
  if (err) {
    console.error('comments 테이블 생성 오류:', err.message);
  } else {
    console.log('comments 테이블 생성 성공');
  }
});

// movies 데이터 삽입
const insertMoviesStmt = db.prepare(`
  INSERT INTO movies (title, original_title, overview, release_date, poster_path, backdrop_path, popularity, vote_average, vote_count)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

data.forEach((row) => {
  insertMoviesStmt.run(
    row['Title'] || null,
    row['Original Title'] || null,
    row['Overview'] || null,
    row['Release Date'] || null,
    row['Poster Path'] || null,
    row['Backdrop Path'] || null,
    row['Popularity'] || null,
    row['Vote Average'] || null,
    row['Vote Count'] || null
  );
});

// comments 데이터 삽입 (엑셀 파일에서 댓글 데이터를 가져오는 코드가 필요)
const commentsData = [
  { movie_id: 1, comment: '영화 너무 좋았어요!' },
  { movie_id: 2, comment: '정말 재미있습니다!' },
  // 여기에서 엑셀 데이터에 맞춰 실제 댓글 데이터를 추가하세요
];

const insertCommentsStmt = db.prepare(`
  INSERT INTO comments (movie_id, comment) 
  VALUES (?, ?)
`);

commentsData.forEach((comment) => {
  insertCommentsStmt.run(comment.movie_id, comment.comment);
});

// 데이터 삽입 후 처리
insertMoviesStmt.finalize((err) => {
  if (err) {
    console.error('영화 데이터 삽입 오류:', err.message);
  } else {
    console.log('모든 영화 데이터가 성공적으로 삽입되었습니다.');
  }

  // 댓글 삽입 후 처리
  insertCommentsStmt.finalize((err) => {
    if (err) {
      console.error('댓글 데이터 삽입 오류:', err.message);
    } else {
      console.log('모든 댓글 데이터가 성공적으로 삽입되었습니다.');
    }

    // 데이터베이스 연결 종료
    db.close((err) => {
      if (err) {
        console.error('데이터베이스 종료 오류:', err.message);
      } else {
        console.log('데이터베이스 연결 종료');
      }
    });
  });
});
