package com.example.demo.service.impl;

import com.example.demo.dto.request.TransactionDTO;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Transaction;
import com.example.demo.model.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;


    private static boolean isSameDate(String dateFromFE, LocalDateTime dateFromBE) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate localDateFE = LocalDate.parse(dateFromFE, formatter);

        LocalDate localDateBE = dateFromBE.toLocalDate();

        return localDateFE.equals(localDateBE);
    }


    private String generateTransactionId() {
        return String.valueOf(Instant.now().toEpochMilli());
    }


    @Override
    public List<TransactionDTO> findAll() {
        return this.transactionRepository.findAll().stream().map((t) -> {
                    return TransactionDTO.builder()
                            .id(t.getId())
                            .transactionId(t.getTransactionId())
                            .email(t.getUser().getEmail())
                            .fullName(t.getUser().getFullName())
                            .amount(t.getAmount())
                            .transactionDate(t.getTransactionDate())
                            .content(t.getContent())
                            .build();
                }

        ).toList();
    }

    @Override
    public List<TransactionDTO> findByEmail(String email) throws NotFoundException {
        return this.transactionRepository.findByEmail(email).stream().map((t) -> {
                    return TransactionDTO.builder()
                            .id(t.getId())
                            .transactionId(t.getTransactionId())
                            .email(t.getUser().getEmail())
                            .fullName(t.getUser().getFullName())
                            .amount(t.getAmount())
                            .transactionDate(t.getTransactionDate())
                            .content(t.getContent())
                            .build();
                }

        ).toList();
    }

    @Override
    public void saveTransaction(TransactionDTO transactionDTO) throws NotFoundException {
        User user = this.userRepository.findByEmail(transactionDTO.getEmail()).orElseThrow(() -> new NotFoundException("Can not find user with email : " + transactionDTO.getEmail()));
        Transaction transaction = new Transaction();
        transaction.setAmount(transactionDTO.getAmount());
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setContent(transactionDTO.getEmail() + " transfer money");
        transaction.setTransactionId(this.generateTransactionId());
        user.addTransactions(transaction);
        this.transactionRepository.save(transaction);
    }

    @Override
    public List<TransactionDTO> findBySearch(String search, String email) throws NotFoundException {
        return this.transactionRepository.findByEmailOrContent(search, email).stream().map((t) -> {
                    return TransactionDTO.builder()
                            .id(t.getId())
                            .transactionId(t.getTransactionId())
                            .email(t.getUser().getEmail())
                            .fullName(t.getUser().getFullName())
                            .amount(t.getAmount())
                            .transactionDate(t.getTransactionDate())
                            .content(t.getContent())
                            .build();
                }

        ).toList();
    }


    @Override
    public List<TransactionDTO> findByDate(String date, String email) throws NotFoundException {
        return this.transactionRepository.findByEmail(email).stream()
                .filter(t -> isSameDate(date, t.getTransactionDate())) // Lọc bằng hàm isSameDate
                .map(t -> TransactionDTO.builder()
                        .id(t.getId())
                        .transactionId(t.getTransactionId())
                        .email(t.getUser().getEmail())
                        .fullName(t.getUser().getFullName())
                        .amount(t.getAmount())
                        .transactionDate(t.getTransactionDate())
                        .content(t.getContent())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDTO> findBySearchAdmin(String date, String search) throws NotFoundException {
        return this.transactionRepository.findBySearchAdmin(search).stream()
                .filter(t -> isSameDate(date, t.getTransactionDate())) // Lọc bằng hàm isSameDate
                .map(t -> TransactionDTO.builder()
                        .id(t.getId())
                        .transactionId(t.getTransactionId())
                        .email(t.getUser().getEmail())
                        .fullName(t.getUser().getFullName())
                        .amount(t.getAmount())
                        .transactionDate(t.getTransactionDate())
                        .content(t.getContent())
                        .build())
                .collect(Collectors.toList());
    }
}