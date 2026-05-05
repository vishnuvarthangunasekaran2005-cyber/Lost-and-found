// backend/src/main/java/com/lostandfound/model/LostItem.java
package com.lostandfound.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@Document(collection = "lost_items")
@CompoundIndexes({
    @CompoundIndex(name = "approved_deleted_idx", def = "{'approved': 1, 'deleted': 1}"),
    @CompoundIndex(name = "cat_status_idx", def = "{'category': 1, 'status': 1}"),
    @CompoundIndex(name = "reported_idx", def = "{'reportedDate': -1}"),
    @CompoundIndex(name = "reportedBy_idx", def = "{'reportedBy': 1, 'deleted': 1}")
})
public class LostItem {
    @Id
    private String id;

    private String title;
    private String description;
    private String category;
    private String location;
    private Instant lostDate;
    private String imageUrl;
    private String reportedBy;
    private String reporterName;
    private Status status = Status.LOST;
    private boolean approved = false;
    private boolean deleted = false;
    private List<String> tags;

    @CreatedDate
    private Instant reportedDate;

    @LastModifiedDate
    private Instant updatedAt;

    public enum Status {
        LOST, MATCHED, RETURNED
    }
}
