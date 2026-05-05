// backend/src/main/java/com/lostandfound/dto/request/LostItemRequest.java
package com.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LostItemRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotBlank private String category;
    @NotBlank private String location;
    private String lostDate;
}
