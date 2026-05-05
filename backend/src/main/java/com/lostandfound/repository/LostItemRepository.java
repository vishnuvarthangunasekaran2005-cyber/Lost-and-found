// backend/src/main/java/com/lostandfound/repository/LostItemRepository.java
package com.lostandfound.repository;

import com.lostandfound.model.LostItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LostItemRepository extends MongoRepository<LostItem, String> {

    List<LostItem> findByDeletedFalseAndApprovedTrue();

    @Query("{ 'deleted': false, 'approved': true, $and: [ " +
           "{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }, " +
           "{ $or: [ { 'category': { $regex: ?1, $options: 'i' } }, { $expr: { $eq: ['', ?1] } } ] }, " +
           "{ $or: [ { 'location': { $regex: ?2, $options: 'i' } }, { $expr: { $eq: ['', ?2] } } ] }, " +
           "{ $or: [ { 'status': ?3 }, { $expr: { $eq: ['', ?3] } } ] } ] }")
    Page<LostItem> searchItems(String keyword, String category, String location, String status, Pageable pageable);

    Page<LostItem> findByReportedByAndDeletedFalse(String userId, Pageable pageable);
    Page<LostItem> findByApprovedFalseAndDeletedFalse(Pageable pageable);
    long countByDeletedFalse();
    long countByStatusAndDeletedFalse(LostItem.Status status);
}
