package com.spring.restful;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookRestControllerTest {

    @Mock
    private BookService bookService;

    @InjectMocks
    private BookRestController bookRestController;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllBooks() {
        List<Book> books = Arrays.asList(new Book("A", "T"), new Book("B", "U"));
        when(bookService.findAll()).thenReturn(books);

        List<Book> result = bookRestController.getAllBooks();

        assertEquals(2, result.size());
        verify(bookService).findAll();
    }

    @Test
    void testGetBookById_Found() {
        Book book = new Book("A", "T");
        book.setId("1");
        when(bookService.findById("1")).thenReturn(book);

        ResponseEntity<Book> response = bookRestController.getBookById("1");

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(book, response.getBody());
        verify(bookService).findById("1");
    }

    @Test
    void testGetBookById_NotFound() {
        when(bookService.findById("2")).thenReturn(null);

        ResponseEntity<Book> response = bookRestController.getBookById("2");

        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(bookService).findById("2");
    }

    @Test
    void testCreateBook() {
        Book book = new Book("A", "T");
        when(bookService.save(book)).thenReturn(book);

        ResponseEntity<Book> response = bookRestController.createBook(book);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(book, response.getBody());
        verify(bookService).save(book);
    }

    @Test
    void testUpdateBook_Found() {
        Book book = new Book("A", "T");
        book.setId("1");
        when(bookService.update(any(Book.class))).thenReturn(book);

        ResponseEntity<Book> response = bookRestController.updateBook("1", book);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(book, response.getBody());
        verify(bookService).update(book);
    }

    @Test
    void testUpdateBook_NotFound() {
        Book book = new Book("A", "T");
        book.setId("2");
        when(bookService.update(any(Book.class))).thenReturn(null);

        ResponseEntity<Book> response = bookRestController.updateBook("2", book);

        assertEquals(404, response.getStatusCodeValue());
        assertNull(response.getBody());
        verify(bookService).update(book);
    }

    @Test
    void testDeleteBook() {
        ResponseEntity<Void> response = bookRestController.deleteBook("1");

        assertEquals(200, response.getStatusCodeValue());
        verify(bookService).delete("1");
    }
}

