import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';

// 定义 API 基础 URL
const API_URL = 'https://wowgu.com/api';

// 笔记编辑器组件
const NoteEditor = ({ note }) => {
  const [title, setTitle] = useState(note.title); // 标题状态
  const [content, setContent] = useState(note.content); // 内容状态

  // 处理笔记更新
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/notes/${note.id}`, { title, content }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      alert('笔记已更新');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div>
      <TextField
        label="标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="内容"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={10}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        更新笔记
      </Button>
    </div>
  );
};

export default NoteEditor;
