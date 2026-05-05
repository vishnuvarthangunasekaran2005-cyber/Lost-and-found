// backend/src/main/java/com/lostandfound/controller/ClaimController.java
package com.lostandfound.controller;

import com.lostandfound.dto.request.ClaimRequest;
import com.lostandfound.dto.response.ApiResponse;
import com.lostandfound.dto.response.ClaimResponse;
import com.lostandfound.security.UserPrincipal;
import com.lostandfound.service.ClaimService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ClaimResponse>> create(
            @RequestPart("claim") ClaimRequest req,
            @RequestPart(value = "proof", required = false) MultipartFile proof,
            @AuthenticationPrincipal UserPrincipal user) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(claimService.create(req, proof, user)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<ClaimResponse>>> myClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok(claimService.getMyClaims(user.getId(), PageRequest.of(page, size))));
    }

    @GetMapping("/for-item/{foundItemId}")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> claimsForItem(
            @PathVariable String foundItemId,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok(claimService.getClaimsForItem(foundItemId, user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(claimService.getById(id)));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<ClaimResponse>> approve(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal user) {
        String note = body != null ? body.getOrDefault("note", "") : "";
        return ResponseEntity.ok(ApiResponse.ok(claimService.approve(id, note, user)));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<ClaimResponse>> reject(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal user) {
        String note = body != null ? body.getOrDefault("note", "") : "";
        return ResponseEntity.ok(ApiResponse.ok(claimService.reject(id, note, user)));
    }
}
