CREATE DATABASE IF NOT EXISTS queue_management;
USE queue_management;

CREATE TABLE IF NOT EXISTS queue_items (
  id VARCHAR(20) PRIMARY KEY,
  number VARCHAR(10) NOT NULL,
  name VARCHAR(255) NOT NULL,
  status ENUM('waiting', 'serving', 'done', 'skipped') NOT NULL DEFAULT 'waiting',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  called_at DATETIME DEFAULT NULL,
  completed_at DATETIME DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS queue_counter (
  id INT PRIMARY KEY DEFAULT 1,
  counter INT NOT NULL DEFAULT 0,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO queue_counter (id, counter) VALUES (1, 0)
ON DUPLICATE KEY UPDATE counter = counter;

CREATE TABLE IF NOT EXISTS settings (
  key_name VARCHAR(50) PRIMARY KEY,
  value VARCHAR(255) NOT NULL
);

INSERT INTO settings (key_name, value) VALUES ('sound_enabled', 'true')
ON DUPLICATE KEY UPDATE value = value;

CREATE INDEX idx_queue_status ON queue_items(status);
CREATE INDEX idx_queue_created ON queue_items(created_at);
