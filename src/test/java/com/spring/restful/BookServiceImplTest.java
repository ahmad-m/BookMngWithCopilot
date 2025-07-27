package com.spring.restful;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookServiceImplTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookServiceImpl bookService;

    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindAll() {
        List<Book> books = Arrays.asList(new Book("Author1", "Title1"), new Book("Author2", "Title2"));
        when(bookRepository.findAll()).thenReturn(books);

        List<Book> result = bookService.findAll();

        assertEquals(2, result.size());
        verify(bookRepository).findAll();
    }

    @Test
    void testFindById_Found() {
        Book book = new Book("Author", "Title");
        book.setId("1");
        when(bookRepository.findById("1")).thenReturn(Optional.of(book));

        Book result = bookService.findById("1");

        assertNotNull(result);
        assertEquals("1", result.getId());
        verify(bookRepository).findById("1");
    }

    @Test
    void testFindById_NotFound() {
        when(bookRepository.findById("2")).thenReturn(Optional.empty());

        Book result = bookService.findById("2");

        assertNull(result);
        verify(bookRepository).findById("2");
    }

    @Test
    void testSave() {
        Book book = new Book("Author", "Title");
        when(bookRepository.save(book)).thenReturn(book);

        Book result = bookService.save(book);

        assertEquals(book, result);
        verify(bookRepository).save(book);
    }

    @Test
    void testUpdate_Exists() {
        Book book = new Book("Author", "Title");
        book.setId("1");
        when(bookRepository.existsById("1")).thenReturn(true);
        when(bookRepository.save(book)).thenReturn(book);

        Book result = bookService.update(book);

        assertEquals(book, result);
        verify(bookRepository).existsById("1");
        verify(bookRepository).save(book);
    }

    @Test
    void testUpdate_NotExists() {
        Book book = new Book("Author", "Title");
        book.setId("2");
        when(bookRepository.existsById("2")).thenReturn(false);

        Book result = bookService.update(book);

        assertNull(result);
        verify(bookRepository).existsById("2");
        verify(bookRepository, never()).save(book);
    }

    @Test
    void testDelete() {
        bookService.delete("1");
        verify(bookRepository).deleteById("1");
    }
}

