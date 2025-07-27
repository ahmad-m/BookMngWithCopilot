import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Box
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import BookDetails from './BookDetails';
import { BrowserRouter as Router } from 'react-router-dom';

const API_URL = 'http://localhost:8080/api/books'; // Updated to include /api context path

function App() {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ title: '', author: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [detailsRefreshKey, setDetailsRefreshKey] = useState(0); // Add this line
  const [sortConfig, setSortConfig] = useState({ key: 'idx', direction: 'asc' });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const fetchBooksCalled = useRef(false);

  // Expose setSelectedBookId globally for BookList
  useEffect(() => {
    window.setSelectedBookId = setSelectedBookId;
    return () => { window.setSelectedBookId = undefined; };
  }, []);

  const fetchBooks = async () => {
    if (fetchBooksCalled.current) return; // Prevent duplicate call on mount
    fetchBooksCalled.current = true;
    try {
      const res = await axios.get(API_URL);
      setBooks(res.data.books || res.data);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to fetch books', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Remove any other fetchBooks() calls from useEffect or other places that could cause double-fetching

  const handleOpen = (book = null) => {
    setEditBook(book);
    setForm(book ? { title: book.title, author: book.author } : { title: '', author: '' });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditBook(null);
    setForm({ title: '', author: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editBook) {
        await axios.put(`${API_URL}/${editBook.id}`, form);
        setSnackbar({ open: true, message: 'Book updated', severity: 'success' });
        if (selectedBookId === editBook.id) {
          setDetailsRefreshKey(prev => prev + 1);
        }
      } else {
        await axios.post(API_URL, form);
        setSnackbar({ open: true, message: 'Book added', severity: 'success' });
      }
      fetchBooksCalled.current = false; // Allow fetchBooks again after add/update
      fetchBooks();
      handleClose();
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setSnackbar({ open: true, message: 'Book deleted', severity: 'success' });
      fetchBooksCalled.current = false; // Allow fetchBooks again after delete
      fetchBooks();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  function handleIdClick(id) {
    setSelectedBookId(id);
    setDetailsOpen(true);
  }

  const handleDetailsClose = () => {
    setDetailsOpen(false);
  };

  // Sorting logic
  const sortedBooks = React.useMemo(() => {
    if (!sortConfig.key) return books;
    const sorted = [...books];
    sorted.sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === 'idx') {
        aValue = books.indexOf(a);
        bValue = books.indexOf(b);
      } else {
        aValue = a[sortConfig.key] || '';
        bValue = b[sortConfig.key] || '';
      }
      // For numbers (idx), compare as numbers
      if (sortConfig.key === 'idx') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      // For strings, compare case-insensitive
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [books, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      // Always start with ascending for any new column, including idx, title, author
      return { key, direction: 'asc' };
    });
  };

  return (
    <Router>
      <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', overflowX: 'hidden' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              CodeOnCloud Book Manager
            </Typography>
            <Button color="inherit" startIcon={<Add />} onClick={() => handleOpen()}>
              Add Book
            </Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSort('idx')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      ID
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: '0.95em',
                          fontWeight: sortConfig.key === 'idx' ? 'bold' : 'normal',
                          color: '#888'
                        }}
                      >
                        {sortConfig.key === 'idx'
                          ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                          : '▲'}
                      </span>
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('title')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      Title
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: '0.95em',
                          fontWeight: sortConfig.key === 'title' ? 'bold' : 'normal',
                          color: '#888'
                        }}
                      >
                        {sortConfig.key === 'title'
                          ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                          : '▲'}
                      </span>
                    </TableCell>
                    <TableCell
                      onClick={() => handleSort('author')}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      Author
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: '0.95em',
                          fontWeight: sortConfig.key === 'author' ? 'bold' : 'normal',
                          color: '#888'
                        }}
                      >
                        {sortConfig.key === 'author'
                          ? (sortConfig.direction === 'asc' ? '▲' : '▼')
                          : '▲'}
                      </span>
                    </TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedBooks.map((book, idx) => (
                    <TableRow
                      key={book.id}
                      hover
                      onClick={() => handleIdClick(book.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        {books.indexOf(book) + 1}
                      </TableCell>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={e => { e.stopPropagation(); handleOpen(book); }}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={e => { e.stopPropagation(); handleDelete(book.id); }}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* Details popup dialog */}
          <Dialog
            open={detailsOpen}
            onClose={handleDetailsClose}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              sx={{
                fontWeight: 500,
                fontSize: '1.2rem',
                color: '#1976d2',
                textAlign: 'center'
              }}
            >
              Book Details
            </DialogTitle>
            <DialogContent
              dividers
              sx={{
                background: '#fff',
                px: 3,
                py: 2,
                minHeight: 180
              }}
            >
              {selectedBookId && (
                <BookDetails
                  id={selectedBookId}
                  refreshKey={detailsRefreshKey}
                />
              )}
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                background: 'transparent',
                pb: 2
              }}
            >
              <Button
                onClick={handleDetailsClose}
                variant="contained"
                sx={{
                  borderRadius: 2,
                  px: 4,
                  fontWeight: 500,
                  textTransform: 'none'
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              type="text"
              fullWidth
              value={form.title}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="author"
              label="Author"
              type="text"
              fullWidth
              value={form.author}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editBook ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
      {/* Remove the <Routes> and <Route> for /books/:id, since details are now shown inline */}
    </Router>
  );
}

export default App;
