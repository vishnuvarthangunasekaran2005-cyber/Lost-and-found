// backend/src/main/java/com/lostandfound/model/Claim.java
package com.lostandfound.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "claims")
public class Claim {
    @Id
    private String id;

    private String foundItemId;
    private String claimantId;
    private String claimantName;
    private String claimantContact;
    private String description;
    private String proofImageUrl;
    private Status status = Status.PENDING;
    private String reviewNote;
    private String reviewedBy;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
