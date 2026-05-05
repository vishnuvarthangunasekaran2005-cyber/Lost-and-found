// backend/src/main/java/com/lostandfound/repository/UserRepository.java
package com.lostandfound.repository;

import com.lostandfound.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
