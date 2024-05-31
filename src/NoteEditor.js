import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';

// ���� API ���� URL
const API_URL = 'https://wowgu.com/api';

// �ʼǱ༭�����
const NoteEditor = ({ note }) => {
  const [title, setTitle] = useState(note.title); // ����״̬
  const [content, setContent] = useState(note.content); // ����״̬

  // ����ʼǸ���
  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/notes/${note.id}`, { title, content }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      alert('�ʼ��Ѹ���');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div>
      <TextField
        label="����"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="����"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        multiline
        rows={10}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        ���±ʼ�
      </Button>
    </div>
  );
};

export default NoteEditor;
