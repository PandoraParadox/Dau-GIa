package com.example.demo.model;

import com.example.demo.dto.request.AuctionDTO;
import com.example.demo.util.TypeProduct;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product extends BaseEntity {

    @Column(name = "name")
    private String name;

    @Column(name = "starting_price")
    private Long startingPrice;

    @Column(name = "auction_time")
    private LocalDateTime auctionTime;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(fetch = FetchType.EAGER , cascade = CascadeType.ALL, mappedBy = "product")
    private List<ProductImage> productImages;

    @JsonBackReference
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinTable(
            name = "cart",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"product_id"})
    )

    private List<User> users;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE ,mappedBy = "product")
    private List<Auction> auctions ;

    @OneToOne(mappedBy = "product")
    private Inventory inventory  ;

    @Enumerated(EnumType.STRING)
    private TypeProduct type ;

    public void addAuctions (Auction auction) {
        if (auctions == null) auctions = new ArrayList<>();
        this.auctions.add(auction);
        auction.setProduct(this);
    }

    public void addUser(ProductImage productImage) {
        if (productImages == null) {
            this.productImages = new ArrayList<>();
        }
        if (!this.productImages.contains(productImage)) { // Tránh thêm trùng lặp
            this.productImages.add(productImage);
            productImage.setProduct(this); // Thiết lập quan hệ hai chiều an toàn
        }
    }


}
