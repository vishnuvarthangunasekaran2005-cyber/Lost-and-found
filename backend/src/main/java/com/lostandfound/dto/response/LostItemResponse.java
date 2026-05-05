// backend/src/main/java/com/lostandfound/dto/response/LostItemResponse.java
package com.lostandfound.dto.response;

import com.lostandfound.model.LostItem;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class LostItemResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String location;
    private Instant lostDate;
    private String imageUrl;
    private String reportedBy;
    private String reporterName;
    private LostItem.Status status;
    private boolean approved;
    private Instant reportedDate;
    private List<MatchResponse> matches;

    public static LostItemResponse from(LostItem item) {
        LostItemResponse r = new LostItemResponse();
        r.setId(item.getId());
        r.setTitle(item.getTitle());
        r.setDescription(item.getDescription());
        r.setCategory(item.getCategory());
        r.setLocation(item.getLocation());
        r.setLostDate(item.getLostDate());
        r.setImageUrl(item.getImageUrl());
        r.setReportedBy(item.getReportedBy());
        r.setReporterName(item.getReporterName());
        r.setStatus(item.getStatus());
        r.setApproved(item.isApproved());
        r.setReportedDate(item.getReportedDate());
        return r;
    }
}
