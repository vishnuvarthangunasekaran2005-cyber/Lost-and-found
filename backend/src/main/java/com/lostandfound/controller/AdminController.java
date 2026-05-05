// backend/src/main/java/com/lostandfound/controller/AdminController.java
package com.lostandfound.controller;

import com.lostandfound.dto.response.*;
import com.lostandfound.model.LostItem;
import com.lostandfound.model.User;
import com.lostandfound.repository.*;
import com.lostandfound.service.FoundItemService;
import com.lostandfound.service.LostItemService;
import com.lostandfound.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN','STAFF')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final LostItemService lostItemService;
    private final FoundItemService foundItemService;
    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRepository claimRepository;
    private final MatchRepository matchRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> stats() {
        long pendingLost = lostItemRepository.findByApprovedFalseAndDeletedFalse(PageRequest.of(0, 1)).getTotalElements();
        long pendingFound = foundItemRepository.findByApprovedFalseAndDeletedFalse(PageRequest.of(0, 1)).getTotalElements();
        AdminStatsResponse stats = new AdminStatsResponse(
                lostItemRepository.countByDeletedFalse(),
                foundItemRepository.countByDeletedFalse(),
                lostItemRepository.countByStatusAndDeletedFalse(LostItem.Status.RETURNED),
                matchRepository.count(),
                claimRepository.countByStatus(com.lostandfound.model.Claim.Status.PENDING),
                userRepository.count(),
                pendingLost + pendingFound
        );
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.ok(userService.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PutMapping("/users/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<User>> updateRole(@PathVariable String id,
                                                         @RequestBody Map<String, String> body) {
        User.Role role = User.Role.valueOf(body.get("role"));
        return ResponseEntity.ok(ApiResponse.ok(userService.updateRole(id, Set.of(role))));
    }

    @GetMapping("/items/pending")
    public ResponseEntity<ApiResponse<Map<String, Object>>> pendingItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("reportedDate").descending());
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "lostItems", lostItemRepository.findByApprovedFalseAndDeletedFalse(pageable).map(LostItemResponse::from),
                "foundItems", foundItemRepository.findByApprovedFalseAndDeletedFalse(pageable).map(FoundItemResponse::from)
        )));
    }

    @PutMapping("/items/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveItem(@PathVariable String id,
                                                          @RequestParam String type) {
        if ("lost".equalsIgnoreCase(type)) lostItemService.approve(id);
        else foundItemService.approve(id);
        return ResponseEntity.ok(ApiResponse.ok("Approved", null));
    }

    @PutMapping("/items/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectItem(@PathVariable String id,
                                                         @RequestParam String type) {
        if ("lost".equalsIgnoreCase(type)) lostItemService.reject(id);
        else foundItemService.reject(id);
        return ResponseEntity.ok(ApiResponse.ok("Rejected", null));
    }
}
