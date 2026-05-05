// backend/src/main/java/com/lostandfound/model/Notification.java
package com.lostandfound.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String userId;
    private String title;
    private String message;
    private String type;
    private String referenceId;
    private boolean read = false;

    @CreatedDate
    private Instant createdAt;
}
