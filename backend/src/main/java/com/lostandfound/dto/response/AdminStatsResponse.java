// backend/src/main/java/com/lostandfound/dto/response/AdminStatsResponse.java
package com.lostandfound.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalLostItems;
    private long totalFoundItems;
    private long returnedItems;
    private long totalMatches;
    private long pendingClaims;
    private long totalUsers;
    private long pendingApprovals;
}
