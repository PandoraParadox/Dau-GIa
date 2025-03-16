package com.example.demo.service.impl;

import com.example.demo.dto.request.AuctionDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Auction;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.AuctionRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuctionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    public final AuctionRepository auctionRepository;
    public final UserRepository userRepository;
    public final ProductRepository productRepository;

    @Override
    public AuctionDTO placeBid(AuctionDTO auctionDTO) throws Exception {
        Auction auction = this.auctionRepository.findByProductId(auctionDTO.getProductId()).orElse(null);
        User user = this.userRepository.findByEmail(auctionDTO.getEmail()).orElseThrow(() -> new NotFoundException(("User not found with email : ") + auctionDTO.getEmail()));
        Product product = this.productRepository.findById(auctionDTO.getProductId()).orElseThrow(() -> new NotFoundException(("Product not found with id : " + auctionDTO.getProductId())));
        if (auction != null) {
            if (auctionDTO.getBid() > auction.getCurrentBid()) {
                auction.setUser(user);
                auction.setCurrentBid(auctionDTO.getBid());
                auctionRepository.save(auction);
            } else {
                throw new Exception("Your bid is not enough");
            }
        } else {
            if (product.getStartingPrice() < auctionDTO.getBid()) {
                auction = new Auction() ;
                auction.setCurrentBid(auctionDTO.getBid());
                product.addAuctions(auction);
                user.addAuctions(auction) ;
                auctionRepository.save(auction);
            }
            else {
                throw new Exception("Your bid is not enough");
            }

        }

        return AuctionDTO.builder()
                .productId(auction.getProduct().getId())
                .bid(auction.getCurrentBid())
                .email(auction.getUser().getEmail())
                .build();
    }

    @Override
    public AuctionDTO getAuctionByProductId(Long productId) throws Exception {
        Auction auction = this.auctionRepository.findByProductId(productId).orElse(null);
        if (auction != null) {
            return AuctionDTO.builder()
                    .productId(auction.getProduct().getId())
                    .bid(auction.getCurrentBid())
                    .email(auction.getUser().getEmail())
                    .build();
        }
        return null ;
    }
}
