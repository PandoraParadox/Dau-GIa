package com.example.demo.repository;

import com.example.demo.model.Auction;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    Optional<Auction> findByUser(User user);

    Optional<Auction> findByProductId(Long productId);

    @Query("select a from Auction  a " +
            "where a.user.id = :userId and a.product.id = :productId"
    )
    Optional<Auction> findByUserAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);


}
