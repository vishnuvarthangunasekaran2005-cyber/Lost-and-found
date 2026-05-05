// backend/src/main/java/com/lostandfound/service/FoundItemService.java
package com.lostandfound.service;

import com.lostandfound.dto.request.FoundItemRequest;
import com.lostandfound.dto.response.FoundItemResponse;
import com.lostandfound.exception.ResourceNotFoundException;
import com.lostandfound.exception.UnauthorizedException;
import com.lostandfound.model.FoundItem;
import com.lostandfound.repository.FoundItemRepository;
import com.lostandfound.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class FoundItemService {

    private final FoundItemRepository foundItemRepository;
    private final FileStorageService fileStorageService;
    private final MatchingService matchingService;

    public Page<FoundItemResponse> search(String keyword, String category, String location,
                                           String status, Pageable pageable) {
        return foundItemRepository.searchItems(
                keyword == null ? "" : keyword,
                category == null ? "" : category,
                location == null ? "" : location,
                status == null ? "" : status,
                pageable
        ).map(FoundItemResponse::from);
    }

    public FoundItemResponse create(FoundItemRequest req, MultipartFile image, UserPrincipal user) throws IOException {
        FoundItem item = new FoundItem();
        item.setTitle(req.getTitle());
        item.setDescription(req.getDescription());
        item.setCategory(req.getCategory());
        item.setLocation(req.getLocation());
        item.setFoundDate(req.getFoundDate() != null ? Instant.parse(req.getFoundDate()) : Instant.now());
        item.setReportedBy(user.getId());
        item.setReporterName(user.getName());
        item.setContactInfo(req.getContactInfo());
        item.setApproved(true);
        if (image != null && !image.isEmpty()) {
            item.setImageUrl(fileStorageService.store(image, user.getId()));
        }
        FoundItem saved = foundItemRepository.save(item);
        matchingService.matchForFoundItem(saved);
        return FoundItemResponse.from(saved);
    }

    public FoundItemResponse getById(String id) {
        return FoundItemResponse.from(findById(id));
    }

    public FoundItemResponse update(String id, FoundItemRequest req, MultipartFile image, UserPrincipal user) throws IOException {
        FoundItem item = findById(id);
        checkOwnerOrAdmin(item.getReportedBy(), user);
        item.setTitle(req.getTitle());
        item.setDescription(req.getDescription());
        item.setCategory(req.getCategory());
        item.setLocation(req.getLocation());
        if (req.getFoundDate() != null) item.setFoundDate(Instant.parse(req.getFoundDate()));
        if (req.getContactInfo() != null) item.setContactInfo(req.getContactInfo());
        if (image != null && !image.isEmpty()) {
            item.setImageUrl(fileStorageService.store(image, user.getId()));
        }
        return FoundItemResponse.from(foundItemRepository.save(item));
    }

    public void delete(String id, UserPrincipal user) {
        FoundItem item = findById(id);
        checkOwnerOrAdmin(item.getReportedBy(), user);
        item.setDeleted(true);
        foundItemRepository.save(item);
    }

    public Page<FoundItemResponse> getMyItems(String userId, Pageable pageable) {
        return foundItemRepository.findByReportedByAndDeletedFalse(userId, pageable).map(FoundItemResponse::from);
    }

    public FoundItem findById(String id) {
        return foundItemRepository.findById(id)
                .filter(i -> !i.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Found item not found"));
    }

    public void approve(String id) {
        FoundItem item = findById(id);
        item.setApproved(true);
        FoundItem saved = foundItemRepository.save(item);
        matchingService.matchForFoundItem(saved);
    }

    public void reject(String id) {
        FoundItem item = findById(id);
        item.setDeleted(true);
        foundItemRepository.save(item);
    }

    private void checkOwnerOrAdmin(String ownerId, UserPrincipal user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));
        if (!ownerId.equals(user.getId()) && !isAdmin) {
            throw new UnauthorizedException("Access denied");
        }
    }
}
