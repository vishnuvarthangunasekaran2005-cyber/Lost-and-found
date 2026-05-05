// backend/src/main/java/com/lostandfound/service/ClaimService.java
package com.lostandfound.service;

import com.lostandfound.dto.request.ClaimRequest;
import com.lostandfound.dto.response.ClaimResponse;
import com.lostandfound.exception.ResourceNotFoundException;
import com.lostandfound.exception.UnauthorizedException;
import com.lostandfound.model.Claim;
import com.lostandfound.model.FoundItem;
import com.lostandfound.repository.ClaimRepository;
import com.lostandfound.repository.FoundItemRepository;
import com.lostandfound.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final FoundItemRepository foundItemRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;

    public ClaimResponse create(ClaimRequest req, MultipartFile proof, UserPrincipal user) throws IOException {
        FoundItem foundItem = foundItemRepository.findById(req.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));

        Claim claim = new Claim();
        claim.setFoundItemId(req.getFoundItemId());
        claim.setClaimantId(user.getId());
        claim.setClaimantName(user.getName());
        claim.setClaimantContact(req.getClaimantContact());
        claim.setDescription(req.getDescription());
        if (proof != null && !proof.isEmpty()) {
            claim.setProofImageUrl(fileStorageService.store(proof, user.getId()));
        }
        Claim saved = claimRepository.save(claim);

        notificationService.send(foundItem.getReportedBy(),
                "New Claim Submitted",
                user.getName() + " submitted a claim for your found item: " + foundItem.getTitle(),
                "CLAIM", saved.getId());

        return ClaimResponse.from(saved);
    }

    public Page<ClaimResponse> getMyClaims(String userId, Pageable pageable) {
        return claimRepository.findByClaimantId(userId, pageable).map(ClaimResponse::from);
    }

    public List<ClaimResponse> getClaimsForItem(String foundItemId, String requesterId) {
        FoundItem item = foundItemRepository.findById(foundItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));
        if (!item.getReportedBy().equals(requesterId)) {
            throw new UnauthorizedException("Access denied");
        }
        return claimRepository.findByFoundItemId(foundItemId).stream()
                .map(c -> {
                    ClaimResponse r = ClaimResponse.from(c);
                    r.setFoundItemTitle(item.getTitle());
                    r.setFoundItemLocation(item.getLocation());
                    return r;
                }).collect(Collectors.toList());
    }

    public ClaimResponse getById(String id) {
        return ClaimResponse.from(claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found")));
    }

    public ClaimResponse approve(String id, String reviewNote, UserPrincipal reviewer) {
        Claim claim = findById(id);
        checkClaimAccess(claim, reviewer);
        claim.setStatus(Claim.Status.APPROVED);
        claim.setReviewNote(reviewNote);
        claim.setReviewedBy(reviewer.getId());
        Claim saved = claimRepository.save(claim);

        foundItemRepository.findById(claim.getFoundItemId()).ifPresent(f -> {
            f.setStatus(FoundItem.Status.CLAIMED);
            foundItemRepository.save(f);
        });

        notificationService.send(claim.getClaimantId(),
                "Claim Approved",
                "Your claim has been approved!",
                "CLAIM_APPROVED", id);

        return ClaimResponse.from(saved);
    }

    public ClaimResponse reject(String id, String reviewNote, UserPrincipal reviewer) {
        Claim claim = findById(id);
        checkClaimAccess(claim, reviewer);
        claim.setStatus(Claim.Status.REJECTED);
        claim.setReviewNote(reviewNote);
        claim.setReviewedBy(reviewer.getId());
        Claim saved = claimRepository.save(claim);

        notificationService.send(claim.getClaimantId(),
                "Claim Rejected",
                "Your claim has been rejected. Reason: " + reviewNote,
                "CLAIM_REJECTED", id);

        return ClaimResponse.from(saved);
    }

    private void checkClaimAccess(Claim claim, UserPrincipal user) {
        boolean isAdminOrStaff = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));
        if (isAdminOrStaff) return;
        FoundItem item = foundItemRepository.findById(claim.getFoundItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));
        if (!item.getReportedBy().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }
    }

    private Claim findById(String id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
    }
}
