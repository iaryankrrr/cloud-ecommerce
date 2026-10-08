package com.ecommerce.backend;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(length = 1000)
    private String description;
    private Double price; // stored in INR
    private String category;
    @Column(length = 500)
    private String imageUrl;
    private String stockStatus = "IN_STOCK";
}