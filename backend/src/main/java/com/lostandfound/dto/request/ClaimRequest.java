// backend/src/main/java/com/lostandfound/dto/request/ClaimRequest.java
package com.lostandfound.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClaimRequest {
    @NotBlank private String foundItemId;
    @NotBlank private String description;
    private String claimantContact;
}
