package com.example.demo.service;

import com.example.demo.dto.request.AuctionDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Auction;
import org.springframework.stereotype.Service;

@Service
public interface AuctionService {
    AuctionDTO placeBid (AuctionDTO auctionDTO) throws Exception;
    AuctionDTO getAuctionByProductId (Long productId) throws Exception;
}
