// backend/src/main/java/com/lostandfound/dto/response/ClaimResponse.java
package com.lostandfound.dto.response;

import com.lostandfound.model.Claim;
import lombok.Data;

import java.time.Instant;

@Data
public class ClaimResponse {
    private String id;
    private String foundItemId;
    private String claimantId;
    private String claimantName;
    private String claimantContact;
    private String description;
    private String proofImageUrl;
    private Claim.Status status;
    private String reviewNote;
    private Instant createdAt;
    private String foundItemTitle;
    private String foundItemLocation;

    public static ClaimResponse from(Claim claim) {
        ClaimResponse r = new ClaimResponse();
        r.setId(claim.getId());
        r.setFoundItemId(claim.getFoundItemId());
        r.setClaimantId(claim.getClaimantId());
        r.setClaimantName(claim.getClaimantName());
        r.setClaimantContact(claim.getClaimantContact());
        r.setDescription(claim.getDescription());
        r.setProofImageUrl(claim.getProofImageUrl());
        r.setStatus(claim.getStatus());
        r.setReviewNote(claim.getReviewNote());
        r.setCreatedAt(claim.getCreatedAt());
        return r;
    }
}
