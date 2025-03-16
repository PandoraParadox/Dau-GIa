package com.example.demo.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class AuctionDTO implements Serializable {
     public String email ;
     public Long bid ;
     public Long productId ;
}
