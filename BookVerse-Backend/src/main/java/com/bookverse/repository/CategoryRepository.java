package com.bookverse.repository;

import com.bookverse.dto.CategoryDTO;
import com.bookverse.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);
    Optional<Category> findByName(String name);

    @Query("SELECT new com.bookverse.dto.CategoryDTO(c.id, c.name, c.slug, COUNT(b.id)) " +
           "FROM Category c LEFT JOIN c.books b " +
           "GROUP BY c.id, c.name, c.slug " +
           "ORDER BY COUNT(b.id) DESC, c.name ASC")
    List<CategoryDTO> findCategoriesWithBookCount();
}
