// backend/src/main/java/com/lostandfound/repository/ClaimRepository.java
package com.lostandfound.repository;

import com.lostandfound.model.Claim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ClaimRepository extends MongoRepository<Claim, String> {
    Page<Claim> findByClaimantId(String claimantId, Pageable pageable);
    List<Claim> findByFoundItemId(String foundItemId);
    long countByStatus(Claim.Status status);
}
