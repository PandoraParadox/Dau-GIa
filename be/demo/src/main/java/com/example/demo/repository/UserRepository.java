package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("select u from User u " +
            "where u.role.name = :role "
    )
    List<User> getAllByRole (@Param("role") String role) ;

    @Query("select u from User u " +
            "where u.fullName like %:search% or u.email like %:search% "
    )
    List<User> findByUsernameOrEmail(@Param("search") String search);
}
