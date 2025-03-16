package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("select t from Transaction t " +
            "where t.user.email like %:email%"
    )
    List<Transaction> findByEmail(@Param("email") String email);

    @Query("select t from Transaction t " +
            "where t.user.email = :email and (t.user.email like %:search% or t.content like %:search%)")
    List<Transaction> findByEmailOrContent(@Param("search") String search, @Param("email") String email);

    @Query("select t from Transaction t " +
            "where t.user.email like %:search% or t.content like %:search%")
    List<Transaction> findBySearchAdmin(@Param("search") String search);
}
