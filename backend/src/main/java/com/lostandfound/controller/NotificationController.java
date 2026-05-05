// backend/src/main/java/com/lostandfound/controller/NotificationController.java
package com.lostandfound.controller;

import com.lostandfound.dto.response.ApiResponse;
import com.lostandfound.model.Notification;
import com.lostandfound.security.UserPrincipal;
import com.lostandfound.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<Notification>>> myNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.ok(
                notificationService.getUserNotifications(user.getId(), PageRequest.of(page, size))));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable String id,
                                                       @AuthenticationPrincipal UserPrincipal user) {
        notificationService.markRead(id, user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Marked as read", null));
    }
}
