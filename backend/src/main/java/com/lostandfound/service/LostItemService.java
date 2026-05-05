// backend/src/main/java/com/lostandfound/service/LostItemService.java
package com.lostandfound.service;

import com.lostandfound.dto.request.LostItemRequest;
import com.lostandfound.dto.response.LostItemResponse;
import com.lostandfound.dto.response.MatchResponse;
import com.lostandfound.exception.ResourceNotFoundException;
import com.lostandfound.exception.UnauthorizedException;
import com.lostandfound.model.FoundItem;
import com.lostandfound.model.LostItem;
import com.lostandfound.model.Match;
import com.lostandfound.repository.FoundItemRepository;
import com.lostandfound.repository.LostItemRepository;
import com.lostandfound.repository.MatchRepository;
import com.lostandfound.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final MatchRepository matchRepository;
    private final FileStorageService fileStorageService;
    private final MatchingService matchingService;

    public Page<LostItemResponse> search(String keyword, String category, String location,
                                          String status, Pageable pageable) {
        return lostItemRepository.searchItems(
                keyword == null ? "" : keyword,
                category == null ? "" : category,
                location == null ? "" : location,
                status == null ? "" : status,
                pageable
        ).map(LostItemResponse::from);
    }

    public LostItemResponse create(LostItemRequest req, MultipartFile image, UserPrincipal user) throws IOException {
        LostItem item = new LostItem();
        item.setTitle(req.getTitle());
        item.setDescription(req.getDescription());
        item.setCategory(req.getCategory());
        item.setLocation(req.getLocation());
        item.setLostDate(req.getLostDate() != null ? Instant.parse(req.getLostDate()) : Instant.now());
        item.setReportedBy(user.getId());
        item.setReporterName(user.getName());
        item.setApproved(true);
        if (image != null && !image.isEmpty()) {
            item.setImageUrl(fileStorageService.store(image, user.getId()));
        }
        LostItem saved = lostItemRepository.save(item);
        matchingService.matchForLostItem(saved);
        return LostItemResponse.from(saved);
    }

    public LostItemResponse getById(String id) {
        LostItem item = findById(id);
        LostItemResponse response = LostItemResponse.from(item);
        List<Match> matches = matchRepository.findByLostItemIdOrderByScoreDesc(id);
        List<MatchResponse> matchResponses = matches.stream().map(m -> {
            MatchResponse mr = MatchResponse.from(m);
            foundItemRepository.findById(m.getFoundItemId())
                    .ifPresent(f -> mr.setFoundItem(com.lostandfound.dto.response.FoundItemResponse.from(f)));
            return mr;
        }).collect(Collectors.toList());
        response.setMatches(matchResponses);
        return response;
    }

    public LostItemResponse update(String id, LostItemRequest req, MultipartFile image, UserPrincipal user) throws IOException {
        LostItem item = findById(id);
        checkOwnerOrAdmin(item.getReportedBy(), user);
        item.setTitle(req.getTitle());
        item.setDescription(req.getDescription());
        item.setCategory(req.getCategory());
        item.setLocation(req.getLocation());
        if (req.getLostDate() != null) item.setLostDate(Instant.parse(req.getLostDate()));
        if (image != null && !image.isEmpty()) {
            item.setImageUrl(fileStorageService.store(image, user.getId()));
        }
        return LostItemResponse.from(lostItemRepository.save(item));
    }

    public void delete(String id, UserPrincipal user) {
        LostItem item = findById(id);
        checkOwnerOrAdmin(item.getReportedBy(), user);
        item.setDeleted(true);
        lostItemRepository.save(item);
    }

    public List<MatchResponse> getMatches(String id) {
        return matchRepository.findByLostItemIdOrderByScoreDesc(id).stream().map(m -> {
            MatchResponse mr = MatchResponse.from(m);
            foundItemRepository.findById(m.getFoundItemId())
                    .ifPresent(f -> mr.setFoundItem(com.lostandfound.dto.response.FoundItemResponse.from(f)));
            return mr;
        }).collect(Collectors.toList());
    }

    public Page<LostItemResponse> getMyItems(String userId, Pageable pageable) {
        return lostItemRepository.findByReportedByAndDeletedFalse(userId, pageable).map(LostItemResponse::from);
    }

    public LostItem findById(String id) {
        return lostItemRepository.findById(id)
                .filter(i -> !i.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Lost item not found"));
    }

    public void approve(String id) {
        LostItem item = findById(id);
        item.setApproved(true);
        LostItem saved = lostItemRepository.save(item);
        matchingService.matchForLostItem(saved);
    }

    public void reject(String id) {
        LostItem item = findById(id);
        item.setDeleted(true);
        lostItemRepository.save(item);
    }

    private void checkOwnerOrAdmin(String ownerId, UserPrincipal user) {
        boolean isAdmin = user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_STAFF"));
        if (!ownerId.equals(user.getId()) && !isAdmin) {
            throw new UnauthorizedException("Access denied");
        }
    }
}
