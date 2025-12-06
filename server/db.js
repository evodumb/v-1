import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function getDb() {
  if (db) {
    return db;
  }

  db = await open({
    filename: path.join(__dirname, 'village.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS subjects(
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  totalChapters INTEGER NOT NULL,
  progress INTEGER NOT NULL
);

    CREATE TABLE IF NOT EXISTS chapters(
  id TEXT PRIMARY KEY,
  subjectId TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnail TEXT,
  isCompleted BOOLEAN DEFAULT 0,
  notes TEXT,
  videoUrl TEXT,
  FOREIGN KEY(subjectId) REFERENCES subjects(id)
);

    CREATE TABLE IF NOT EXISTS quizzes(
  id TEXT PRIMARY KEY,
  subjectId TEXT NOT NULL,
  title TEXT NOT NULL,
  level TEXT NOT NULL,
  questions TEXT NOT NULL, --JSON string
      FOREIGN KEY(subjectId) REFERENCES subjects(id)
);

    CREATE TABLE IF NOT EXISTS timetable(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  type TEXT NOT NULL
);
     
    CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  language TEXT,
  grade TEXT
);

--Mock stats table for progress
    CREATE TABLE IF NOT EXISTS progress_stats(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  totalHours REAL,
  lessonsCompleted INTEGER,
  quizzesTaken INTEGER,
  averageScore INTEGER,
  streakDays INTEGER
);

-- Project Module Tables
    CREATE TABLE IF NOT EXISTS projects(
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal TEXT,
  status TEXT DEFAULT 'Open',
  budget_needed REAL,
  professor_id INTEGER,
  creator_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(creator_id) REFERENCES users(id)
);

    CREATE TABLE IF NOT EXISTS project_members(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT,
  status TEXT DEFAULT 'pending',
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

    CREATE TABLE IF NOT EXISTS project_tasks(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  assigned_to INTEGER,
  deadline DATE,
  status TEXT DEFAULT 'Pending',
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(assigned_to) REFERENCES users(id)
);

    CREATE TABLE IF NOT EXISTS budget_requests(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  amount REAL NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'Pending',
  professor_note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id)
);

    CREATE TABLE IF NOT EXISTS discussion_posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(project_id) REFERENCES projects(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- AI Notebook Table
    CREATE TABLE IF NOT EXISTS notes(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

  return db;
}
