/*
  # Create Forum Tables

  1. New Tables
    - `forum_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author_address` (text) - MetaMask wallet address
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `forum_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key)
      - `content` (text)
      - `author_address` (text) - MetaMask wallet address
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all posts/comments
    - Add policies for users to create posts/comments
    - Add policies for users to edit/delete their own posts/comments
*/

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create forum comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES forum_posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  author_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

-- Policies for forum posts
CREATE POLICY "Anyone can read posts"
  ON forum_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own posts"
  ON forum_posts
  FOR UPDATE
  TO authenticated
  USING (author_address = current_user)
  WITH CHECK (author_address = current_user);

CREATE POLICY "Users can delete own posts"
  ON forum_posts
  FOR DELETE
  TO authenticated
  USING (author_address = current_user);

-- Policies for forum comments
CREATE POLICY "Anyone can read comments"
  ON forum_comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create comments"
  ON forum_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own comments"
  ON forum_comments
  FOR UPDATE
  TO authenticated
  USING (author_address = current_user)
  WITH CHECK (author_address = current_user);

CREATE POLICY "Users can delete own comments"
  ON forum_comments
  FOR DELETE
  TO authenticated
  USING (author_address = current_user);
