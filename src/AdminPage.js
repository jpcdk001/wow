import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Paper, List, ListItem, ListItemText, IconButton, Drawer, Menu, MenuItem, TextField } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
import NoteEditor from './NoteEditor'; // 假设 NoteEditor 是一个用于编辑笔记的组件

// 定义 API 基础 URL
const API_URL = 'https://wowgu.com/api';

// 管理员页面组件
function AdminPage() {
  const navigate = useNavigate(); // 导航功能
  const [drawerOpen, setDrawerOpen] = useState(false); // 抽屉状态
  const [anchorEl, setAnchorEl] = useState(null); // 菜单锚点
  const [directories, setDirectories] = useState([]); // 目录列表
  const [selectedDirectory, setSelectedDirectory] = useState(null); // 选中的目录
  const [notes, setNotes] = useState([]); // 笔记列表
  const [selectedNote, setSelectedNote] = useState(null); // 选中的笔记
  const [mobileView, setMobileView] = useState(window.innerWidth <= 600); // 移动视图状态

  useEffect(() => {
    window.addEventListener('resize', () => setMobileView(window.innerWidth <= 600)); // 监听窗口大小变化
    fetchDirectories(); // 获取目录列表
  }, []);

  // 获取目录列表
  const fetchDirectories = async () => {
    try {
      const response = await axios.get(`${API_URL}/directories`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setDirectories(response.data);
    } catch (error) {
      console.error('Error fetching directories:', error);
    }
  };

  // 获取笔记列表
  const fetchNotes = async (directoryId) => {
    try {
      const response = await axios.get(`${API_URL}/notes?directoryId=${directoryId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  // 处理登出事件
  const handleLogout = () => {
    localStorage.removeItem('token'); // 移除本地存储的令牌
    navigate('/admin/login'); // 跳转到登录页面
  };

  // 处理菜单点击事件
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 处理目录选择事件
  const handleDirectorySelect = (directory) => {
    setSelectedDirectory(directory);
    fetchNotes(directory.id);
  };

  // 处理笔记选择事件
  const handleNoteSelect = (note) => {
    setSelectedNote(note);
  };

  // 新建笔记
  const handleAddNote = () => {
    // 新建笔记逻辑
  };

  // 删除笔记
  const handleDeleteNote = () => {
    // 删除笔记逻辑
  };

  // 抽屉内容
  const drawerContent = (
    <List>
      {directories.map((directory) => (
        <ListItem button key={directory.id} onClick={() => handleDirectorySelect(directory)}>
          <ListItemText primary={directory.name} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {mobileView && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {selectedDirectory ? selectedDirectory.name : '文件'}
          </Typography>
          <Button color="inherit" onClick={handleMenuClick}>
            Admin
          </Button>
          <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleLogout}>登出</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
      <Container style={{ marginTop: '2rem', display: 'flex', flexDirection: mobileView ? 'column' : 'row' }}>
        <div style={{ width: mobileView ? '100%' : '30%', marginRight: mobileView ? '0' : '1rem' }}>
          <Paper style={{ padding: '1rem' }}>
            <Typography variant="h6">目录树</Typography>
            {drawerContent}
          </Paper>
        </div>
        <div style={{ width: mobileView ? '100%' : '70%', backgroundColor: '#FFFFFF', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <IconButton color="primary" onClick={handleAddNote}>
              <AddIcon />
            </IconButton>
            <IconButton color="secondary" onClick={handleDeleteNote}>
              <DeleteIcon />
            </IconButton>
          </div>
          {selectedNote ? (
            <NoteEditor note={selectedNote} />
          ) : (
            <Typography variant="body1">选择或新建一篇笔记进行编辑。</Typography>
          )}
        </div>
      </Container>
    </div>
  );
}

export default AdminPage;
