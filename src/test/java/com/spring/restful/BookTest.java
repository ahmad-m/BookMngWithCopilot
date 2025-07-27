package com.spring.restful;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class BookTest {

    @Test
    void testBookGettersAndSetters() {
        Book book = new Book();
        book.setId("123");
        book.setAuthor("Author");
        book.setTitle("Title");

        assertEquals("123", book.getId());
        assertEquals("Author", book.getAuthor());
        assertEquals("Title", book.getTitle());
    }

    @Test
    void testBookConstructor() {
        Book book = new Book("Author", "Title");
        assertEquals("Author", book.getAuthor());
        assertEquals("Title", book.getTitle());
        assertNull(book.getId());
    }
}

