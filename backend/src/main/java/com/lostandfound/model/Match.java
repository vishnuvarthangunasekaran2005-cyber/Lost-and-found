// backend/src/main/java/com/lostandfound/model/Match.java
package com.lostandfound.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "matches")
public class Match {
    @Id
    private String id;

    private String lostItemId;
    private String foundItemId;
    private double score;
    private int categoryScore;
    private int locationScore;
    private int keywordScore;
    private boolean notified = false;

    @CreatedDate
    private Instant createdAt;
}
