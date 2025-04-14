package org.iaeste.szakal2.repositories;

import jakarta.persistence.Table;
import jakarta.transaction.Transactional;
import org.iaeste.szakal2.models.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
@Table(name = "comments")
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Modifying
    @Transactional
    @Query(value = "truncate comments", nativeQuery = true)
    void truncate();

    Optional<Comment> findCommentById(UUID id);
}
