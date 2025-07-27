package com.spring.restful;

import java.util.List;

public interface BookService {
    List<Book> findAll();
    Book findById(String id);
    Book save(Book book);
    Book update(Book book);
    void delete(String id);
}
