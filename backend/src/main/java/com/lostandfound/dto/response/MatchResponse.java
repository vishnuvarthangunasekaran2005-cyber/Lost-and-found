// backend/src/main/java/com/lostandfound/dto/response/MatchResponse.java
package com.lostandfound.dto.response;

import com.lostandfound.model.Match;
import lombok.Data;

import java.time.Instant;

@Data
public class MatchResponse {
    private String id;
    private String lostItemId;
    private String foundItemId;
    private double score;
    private int categoryScore;
    private int locationScore;
    private int keywordScore;
    private Instant createdAt;
    private FoundItemResponse foundItem;
    private LostItemResponse lostItem;

    public static MatchResponse from(Match match) {
        MatchResponse r = new MatchResponse();
        r.setId(match.getId());
        r.setLostItemId(match.getLostItemId());
        r.setFoundItemId(match.getFoundItemId());
        r.setScore(match.getScore());
        r.setCategoryScore(match.getCategoryScore());
        r.setLocationScore(match.getLocationScore());
        r.setKeywordScore(match.getKeywordScore());
        r.setCreatedAt(match.getCreatedAt());
        return r;
    }
}
