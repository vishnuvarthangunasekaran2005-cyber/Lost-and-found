// backend/src/main/java/com/lostandfound/repository/MatchRepository.java
package com.lostandfound.repository;

import com.lostandfound.model.Match;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MatchRepository extends MongoRepository<Match, String> {
    List<Match> findByLostItemIdOrderByScoreDesc(String lostItemId);
    List<Match> findByFoundItemIdOrderByScoreDesc(String foundItemId);
    boolean existsByLostItemIdAndFoundItemId(String lostItemId, String foundItemId);
    long count();
}
