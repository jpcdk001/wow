// eslint-disable-next-line unicode-bom
import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

const API_URL = 'https://wowgu.com/api';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/articles`);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredArticles = articles.filter((article) => {
    return article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           article.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <AppBar position="static" style={{ backgroundColor: '#3f51b5' }}>
        <Toolbar>
          <Typography variant="h6" style={{ color: '#FFFFFF', flexGrow: 1 }}>My Blog</Typography>
          <TextField
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            style={{ backgroundColor: '#FFFFFF', marginLeft: '1rem' }}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '2rem', display: 'flex' }}>
        <div style={{ width: '30%', marginRight: '1rem' }}>
          <Paper style={{ padding: '1rem', backgroundColor: '#FFFFFF' }}>
            <Typography variant="h6" style={{ color: '#69696c' }}>Articles</Typography>
            {filteredArticles.map((article) => (
              <div key={article.id} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body1"
                  style={{
                    color: '#a8a5a5',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    maxWidth: '80%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => handleArticleClick(article)}
                >
                  {article.title}
                </Typography>
              </div>
            ))}
          </Paper>
        </div>
        <div style={{ width: '70%', backgroundColor: '#FFFFFF', padding: '1rem' }}>
          {selectedArticle ? (
            <>
              <Typography variant="h5" style={{ color: '#3f51b5', textAlign: 'center' }}>{selectedArticle.title}</Typography>
              <Typography variant="caption" style={{ color: '#999999', display: 'block', textAlign: 'center' }}>{selectedArticle.created_at}</Typography>
              <Typography variant="body1" style={{ color: '#666666', marginTop: '1rem', whiteSpace: 'pre-wrap', marginLeft: '1rem' }}>
                {selectedArticle.content}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" style={{ color: '#666666' }}>Select an article to view its content.</Typography>
          )}
        </div>
      </Container>
    </div>
  );
}

function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Aqaz123...');
  const [error, setError] = useState('');
  const buttonRef = useRef(null);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/admin';
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      {error && <Typography color="error">{error}</Typography>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button ref={buttonRef} onClick={handleLogin}>Login</Button>
    </div>
  );
}

function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API_URL}/articles`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const createArticle = async () => {
    try {
      await axios.post(`${API_URL}/articles`, { title, content }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setTitle('');
      setContent('');
      fetchArticles();
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  const updateArticle = async () => {
    try {
      await axios.put(`${API_URL}/articles/${selectedArticle.id}`, { title, content }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedArticle(null);
      setTitle('');
      setContent('');
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  const deleteArticle = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this article?');
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/articles/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        fetchArticles();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setTitle(article.title);
    setContent(article.content);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Admin Panel</Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6">Articles</Typography>
              {articles.map((article) => (
                <div key={article.id} style={{ marginBottom: '1rem' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleArticleClick(article)}
                  >
                    {article.title}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => deleteArticle(article.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    Delete
                  </Button>
                </div>
              ))}
              <Button variant="contained" color="primary" onClick={createArticle}>
                New Article
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper style={{ padding: '1rem' }}>
              <Typography variant="h6">
                {selectedArticle ? 'Edit Article' : 'New Article'}
              </Typography>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                minRows={10}
                margin="normal"
              />
              {selectedArticle ? (
                <Button variant="contained" color="primary" onClick={updateArticle}>
                  Update Article
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={createArticle}>
                  Create Article
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ArticleList />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
