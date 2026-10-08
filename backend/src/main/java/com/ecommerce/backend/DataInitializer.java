package com.ecommerce.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            productRepository.deleteAll();

            // ==========================================
            // 1. APPAREL
            // ==========================================
            addProduct(productRepository, "Men's Slim Fit Cotton Shirt", 999.0, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600", "Apparel", "IN_STOCK", "Classic formal and casual cotton shirt for men.");
            addProduct(productRepository, "Men's Casual Denim Jacket", 1799.0, "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600", "Apparel", "IN_STOCK", "Rugged blue denim jacket for everyday wear.");
            addProduct(productRepository, "Women's Floral Summer Dress", 1299.0, "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", "Apparel", "IN_STOCK", "Lightweight floral print breezy dress.");
            addProduct(productRepository, "Women's High-Rise Skinny Jeans", 1499.0, "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600", "Apparel", "IN_STOCK", "Stretchable comfort-fit denim jeans.");
            addProduct(productRepository, "Kids' Cartoon Printed T-Shirt", 399.0, "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600", "Apparel", "IN_STOCK", "Fun cotton t-shirt for children.");

            // ==========================================
            // 2. GROCERY
            // ==========================================
            addProduct(productRepository, "Fresh Organic Tomatoes (1kg)", 60.0, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600", "Grocery", "IN_STOCK", "Juicy farm-fresh red tomatoes.");
            addProduct(productRepository, "Fresh Alphonso Mangoes (1kg)", 399.0, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600", "Grocery", "IN_STOCK", "King of fruits, sweet and pulpy.");
            addProduct(productRepository, "Premium Cashews (500g)", 499.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600", "Grocery", "IN_STOCK", "Rich whole cashews.");
            addProduct(productRepository, "Premium Basmati Rice (5kg)", 599.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600", "Grocery", "IN_STOCK", "Long grain aromatic aged Indian basmati rice.");

            // ==========================================
            // 3. ELECTRONICS
            // ==========================================
            addProduct(productRepository, "Minimalist Smart Watch", 2499.0, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", "Electronics", "IN_STOCK", "Sleek fitness and notification smart watch.");
            addProduct(productRepository, "Wireless Bluetooth Headphones", 1899.0, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "Electronics", "IN_STOCK", "High fidelity over-ear noise-cancelling headphones.");
            addProduct(productRepository, "True Wireless Earbuds", 1499.0, "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", "Electronics", "IN_STOCK", "Deep bass wireless earbuds with charging case.");

            // ==========================================
            // 4. BOOKS & STATIONERY
            // ==========================================
            addProduct(productRepository, "Bestselling Fiction Novel", 399.0, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", "Books & Stationery", "IN_STOCK", "Engaging gripping modern fiction bestseller.");
            addProduct(productRepository, "Hardcover Journal & Notebook", 299.0, "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600", "Books & Stationery", "IN_STOCK", "Premium ruled notebook for daily journaling.");
            addProduct(productRepository, "Minimalist Gel Pen Set (10 pcs)", 199.0, "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600", "Books & Stationery", "IN_STOCK", "Smooth writing black and blue gel pens.");

            // ==========================================
            // 5. PET SUPPLIES
            // ==========================================
            addProduct(productRepository, "Premium Adult Dog Food (3kg)", 899.0, "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600", "Pet Supplies", "IN_STOCK", "Nutritious balanced dry food for dogs.");
            addProduct(productRepository, "Interactive Feather Cat Toy", 249.0, "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=600", "Pet Supplies", "IN_STOCK", "Engaging teaser wand toy for cats and kittens.");

            // ==========================================
            // 6. KITCHEN & DINING
            // ==========================================
            addProduct(productRepository, "Stainless Steel Insulated Bottle", 699.0, "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600", "Kitchen & Dining", "IN_STOCK", "Keeps drinks hot or cold for 24 hours.");
            addProduct(productRepository, "Non-Stick Cookware Fry Pan", 999.0, "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600", "Kitchen & Dining", "IN_STOCK", "Scratch-resistant ergonomic frying pan.");

            // ==========================================
            // 7. FOOTWEAR (New Category)
            // ==========================================
            addProduct(productRepository, "Men's Breathable Running Shoes", 1999.0, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "Footwear", "IN_STOCK", "Lightweight athletic running shoes with superior grip.");
            addProduct(productRepository, "Unisex Classic White Sneakers", 1499.0, "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600", "Footwear", "IN_STOCK", "Versatile casual sneakers matching every outfit.");
            addProduct(productRepository, "Men's Leather Formal Loafers", 2299.0, "https://images.unsplash.com/photo-1533867617858-e7d97e0afd8b?w=600", "Footwear", "IN_STOCK", "Handcrafted premium leather formal slip-on shoes.");
            addProduct(productRepository, "Women's Lightweight Walking Shoes", 1799.0, "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600", "Footwear", "IN_STOCK", "Cushioned comfort walking shoes for women.");
            addProduct(productRepository, "Comfortable Casual Flip-Flops", 699.0, "https://images.unsplash.com/photo-1603808033192-082d6939d3e1?w=600", "Footwear", "IN_STOCK", "Durable beach and home flip-flop slippers.");

            // ==========================================
            // 8. HOME DECOR & LIGHTING (New Category)
            // ==========================================
            addProduct(productRepository, "Aromatic Vanilla Scented Candle", 499.0, "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600", "Home Decor & Lighting", "IN_STOCK", "Long-burning soy wax relaxing scented candle.");
            addProduct(productRepository, "Warm LED Fairy String Lights", 299.0, "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600", "Home Decor & Lighting", "IN_STOCK", "Decorative warm white copper string lights.");
            addProduct(productRepository, "Decorative Artificial Succulent Plant", 399.0, "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600", "Home Decor & Lighting", "IN_STOCK", "Low maintenance green faux plant in ceramic pot.");
            addProduct(productRepository, "Handcrafted Brass Table Lamp", 1599.0, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", "Home Decor & Lighting", "IN_STOCK", "Vintage aesthetic bedside and desk lighting.");
            addProduct(productRepository, "Geometric Cotton Cushion Cover Set", 699.0, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600", "Home Decor & Lighting", "IN_STOCK", "Set of 2 designer sofa cushion covers.");

            // ==========================================
            // 9. FITNESS & WELLNESS (New Category)
            // ==========================================
            addProduct(productRepository, "Deep Tissue Muscle Massage Gun", 2499.0, "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600", "Fitness & Wellness", "IN_STOCK", "Percussive therapy gun for post-workout recovery.");
            addProduct(productRepository, "Pro Yoga Exercise Mat", 799.0, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600", "Fitness & Wellness", "IN_STOCK", "Anti-slip eco-friendly fitness and yoga mat.");
            addProduct(productRepository, "Whey Protein Isolate Powder (1kg)", 2199.0, "https://images.unsplash.com/photo-1579722820308-d74e571550a0?w=600", "Fitness & Wellness", "IN_STOCK", "High protein muscle building supplement powder.");
            addProduct(productRepository, "High-Density Foam Roller", 799.0, "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600", "Fitness & Wellness", "IN_STOCK", "Physical therapy muscle roller for back and legs.");
            addProduct(productRepository, "Ergonomic Skipping Jump Rope", 299.0, "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600", "Fitness & Wellness", "IN_STOCK", "Adjustable speed rope for cardio training.");
        };
    }

    private void addProduct(ProductRepository repo, String name, double price, String imageUrl, String category, String stockStatus, String desc) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        p.setStockStatus(stockStatus);
        p.setDescription(desc);
        repo.save(p);
    }
}