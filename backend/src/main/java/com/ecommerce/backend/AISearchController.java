package com.ecommerce.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AISearchController {

    private final ProductRepository productRepository;
    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public AISearchController(ProductRepository productRepository, WebClient.Builder webClientBuilder) {
        this.productRepository = productRepository;
        this.webClient = webClientBuilder.build();
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @GetMapping("/search")
    public ResponseEntity<?> smartSearch(@RequestParam String query) {
        try {
            String prompt = "Extract 1 concise search keyword (like lamp, chair, table, decor, blanket) from this user intent: \"" + query + "\". Return only the keyword with no markdown formatting.";
            
            Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                    "parts", List.of(Map.of("text", prompt))
                ))
            );

            Map response = webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            String keyword = query.trim().toLowerCase();

            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    String aiText = (String) parts.get(0).get("text");
                    keyword = aiText.replaceAll("```", "").replaceAll("json", "").trim().toLowerCase();
                }
            }

            List<Product> allProducts = productRepository.findAll();
            final String finalKeyword = keyword;
            List<Product> matched = allProducts.stream()
                    .filter(p -> p.getName().toLowerCase().contains(finalKeyword) || p.getDescription().toLowerCase().contains(finalKeyword) || p.getCategory().toLowerCase().contains(finalKeyword))
                    .collect(Collectors.toList());

            if (matched.isEmpty()) {
                matched = allProducts.stream()
                        .filter(p -> p.getName().toLowerCase().contains(query.toLowerCase()) || p.getDescription().toLowerCase().contains(query.toLowerCase()))
                        .collect(Collectors.toList());
            }

            return ResponseEntity.ok(matched.isEmpty() ? allProducts : matched);

        } catch (Exception e) {
            return ResponseEntity.ok(productRepository.findAll());
        }
    }
}