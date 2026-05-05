// backend/src/main/java/com/lostandfound/dto/response/FoundItemResponse.java
package com.lostandfound.dto.response;

import com.lostandfound.model.FoundItem;
import lombok.Data;

import java.time.Instant;

@Data
public class FoundItemResponse {
    private String id;
    private String title;
    private String description;
    private String category;
    private String location;
    private Instant foundDate;
    private String imageUrl;
    private String reportedBy;
    private String reporterName;
    private String contactInfo;
    private FoundItem.Status status;
    private boolean approved;
    private Instant reportedDate;

    public static FoundItemResponse from(FoundItem item) {
        FoundItemResponse r = new FoundItemResponse();
        r.setId(item.getId());
        r.setTitle(item.getTitle());
        r.setDescription(item.getDescription());
        r.setCategory(item.getCategory());
        r.setLocation(item.getLocation());
        r.setFoundDate(item.getFoundDate());
        r.setImageUrl(item.getImageUrl());
        r.setReportedBy(item.getReportedBy());
        r.setReporterName(item.getReporterName());
        r.setContactInfo(item.getContactInfo());
        r.setStatus(item.getStatus());
        r.setApproved(item.isApproved());
        r.setReportedDate(item.getReportedDate());
        return r;
    }
}
