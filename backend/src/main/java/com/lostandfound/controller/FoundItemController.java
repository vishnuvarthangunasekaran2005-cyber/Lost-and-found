// backend/src/main/java/com/lostandfound/controller/FoundItemController.java
package com.lostandfound.controller;

import com.lostandfound.dto.request.FoundItemRequest;
import com.lostandfound.dto.response.ApiResponse;
import com.lostandfound.dto.response.FoundItemResponse;
import com.lostandfound.security.UserPrincipal;
import com.lostandfound.service.FoundItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/found-items")
@RequiredArgsConstructor
public class FoundItemController {

    private final FoundItemService foundItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<FoundItemResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "reportedDate") String sort) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sort));
        return ResponseEntity.ok(ApiResponse.ok(foundItemService.search(keyword, category, location, status, pageable)));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<FoundItemResponse>> create(
            @RequestPart("item") FoundItemRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserPrincipal user) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(foundItemService.create(req, image, user)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundItemResponse>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(foundItemService.getById(id)));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<FoundItemResponse>> update(
            @PathVariable String id,
            @RequestPart("item") FoundItemRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @AuthenticationPrincipal UserPrincipal user) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(foundItemService.update(id, req, image, user)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<FoundItemResponse>>> myItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @AuthenticationPrincipal UserPrincipal user) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "reportedDate"));
        return ResponseEntity.ok(ApiResponse.ok(foundItemService.getMyItems(user.getId(), pageable)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id,
                                                      @AuthenticationPrincipal UserPrincipal user) {
        foundItemService.delete(id, user);
        return ResponseEntity.ok(ApiResponse.ok("Deleted", null));
    }
}
