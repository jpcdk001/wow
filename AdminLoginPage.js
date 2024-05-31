import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography } from '@material-ui/core';
import axios from 'axios';

// 定义 API 基础 URL
const API_URL = 'https://wowgu.com/api';

// 管理员登录页面组件
function AdminLoginPage() {
  const [username, setUsername] = useState('admin'); // 用户名状态
  const [password, setPassword] = useState('Aqaz123...'); // 密码状态
  const [error, setError] = useState(''); // 错误消息状态
  const buttonRef = useRef(null); // 按钮引用
  const navigate = useNavigate(); // 导航功能

  // 处理登录事件
  const handleLogin = async () => {
    try {
      // 发送登录请求
      const response = await axios.post(`${API_URL}/login`, { username, password });
      // 保存 JWT 令牌到本地存储
      localStorage.setItem('token', response.data.token);
      // 跳转到管理员页面
      navigate('/admin');
    } catch (error) {
      console.error('Error logging in:', error);
      // 设置错误消息
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="用户名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="密码"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button ref={buttonRef} onClick={handleLogin} variant="contained" color="primary" fullWidth>
        登录
      </Button>
    </div>
  );
}

export default AdminLoginPage;

