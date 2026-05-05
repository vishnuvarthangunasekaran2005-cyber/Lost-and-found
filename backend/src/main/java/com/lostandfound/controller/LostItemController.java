// backend/src/main/java/com/lostandfound/controller/LostItemController.java
package com.lostandfound.controller;

import com.lostandfound.dto.request.LostItemRequest;
import com.lostandfound.dto.response.ApiResponse;
import com.lostandfound.dto.response.LostItemResponse;
import com.lostandfound.dto.response.MatchResponse;
import com.lostandfound.security.UserPrincipal;
import com.lostandfound.service.LostItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LostItemResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "reportedDate") String sort) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sort));
        return ResponseEntity.ok(ApiResponse.ok(lostItemService.search(keyword, category, location, status, pageable)));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<LostItemResponse>> create(
            @RequestPart("item") LostItemRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserPrincipal user) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(lostItemService.create(req, image, user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LostItemResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(lostItemService.getById(id)));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<LostItemResponse>> update(
            @PathVariable String id,
            @RequestPart("item") LostItemRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserPrincipal user) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(lostItemService.update(id, req, image, user)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id,
                                                     @AuthenticationPrincipal UserPrincipal user) {
        lostItemService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<ApiResponse<List<MatchResponse>>> getMatches(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(lostItemService.getMatches(id)));
    }
}
