// backend/src/main/java/com/lostandfound/dto/request/FoundItemRequest.java
package com.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FoundItemRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotBlank private String category;
    @NotBlank private String location;
    private String foundDate;
    private String contactInfo;
}
