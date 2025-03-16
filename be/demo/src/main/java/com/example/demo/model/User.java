package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity implements UserDetails {
    @Column(name = "full_name")
    private String fullName ;

    @Column(name = "email" , nullable = false , unique = true)
    private String email ;

    @Column(name = "password")
    private String password ;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth ;

    @Column(name = "address")
    private String address ;

    @Column(name = "balance")
    private String balance ;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role ;

    @ManyToMany(fetch = FetchType.EAGER,mappedBy = "users")
    private List<Product> products ;

    @OneToMany(mappedBy = "user")
    private List<Auction> auctions ;

    @OneToMany(mappedBy = "user" ,cascade = CascadeType.REMOVE , orphanRemoval = true)
    private List<Transaction> transactions ;

    public void addAuctions (Auction auction) {
        if (this.auctions == null) {
            this.auctions = new ArrayList<>();
        }
        this.auctions.add(auction);
        auction.setUser(this);
    }


    public void addTransactions (Transaction transaction) {
        if (this.transactions == null) {
            this.transactions = new ArrayList<>();
        }
        this.transactions.add(transaction);
        transaction.setUser(this);
    }
    public void removeTransaction(Transaction transaction) {
        transactions.remove(transaction);
        transaction.setUser(null);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_"+role.getName().toUpperCase()));
        return authorities ;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
