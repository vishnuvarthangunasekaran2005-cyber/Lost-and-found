// backend/src/main/java/com/lostandfound/config/DataInitializer.java
package com.lostandfound.config;

import com.lostandfound.model.*;
import com.lostandfound.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final ClaimRepository claimRepository;
    private final MatchRepository matchRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Seed data already exists, skipping initialization.");
            return;
        }
        log.info("Seeding database...");

        User admin = createUser("Admin User", "admin@findit.com", "Admin@123", "9000000001",
                Set.of(User.Role.ROLE_ADMIN, User.Role.ROLE_USER));
        User staff = createUser("Staff Member", "staff@findit.com", "Staff@123", "9000000002",
                Set.of(User.Role.ROLE_STAFF, User.Role.ROLE_USER));
        User alice = createUser("Alice Johnson", "alice@example.com", "User@123", "9000000003",
                Set.of(User.Role.ROLE_USER));
        User bob = createUser("Bob Smith", "bob@example.com", "User@123", "9000000004",
                Set.of(User.Role.ROLE_USER));
        User carol = createUser("Carol White", "carol@example.com", "User@123", "9000000005",
                Set.of(User.Role.ROLE_USER));

        LostItem l1 = createLostItem("Black Leather Wallet", "Black leather wallet with initials AJ, contains ID cards",
                "Accessories", "Central Park, New York", alice.getId(), alice.getName(), LostItem.Status.LOST, -3);
        LostItem l2 = createLostItem("iPhone 14 Pro", "Space black iPhone 14 Pro with cracked screen protector",
                "Electronics", "Times Square Station", bob.getId(), bob.getName(), LostItem.Status.MATCHED, -5);
        LostItem l3 = createLostItem("Blue Backpack", "Navy blue Jansport backpack with laptop compartment",
                "Bags", "Central Library", carol.getId(), carol.getName(), LostItem.Status.LOST, -1);
        LostItem l4 = createLostItem("Gold Necklace", "18k gold chain necklace with heart pendant",
                "Jewelry", "Riverside Mall", alice.getId(), alice.getName(), LostItem.Status.RETURNED, -10);
        LostItem l5 = createLostItem("Car Keys", "Toyota car keys with blue keychain and house key",
                "Keys", "Parking Lot B, Airport", bob.getId(), bob.getName(), LostItem.Status.LOST, -2);

        FoundItem f1 = createFoundItem("Leather Wallet Found", "Found a black leather wallet near the fountain",
                "Accessories", "Central Park, New York", staff.getId(), staff.getName(), FoundItem.Status.CLAIMED, -2);
        FoundItem f2 = createFoundItem("Smartphone Found", "Found a black iPhone near subway entrance",
                "Electronics", "Times Square Station", carol.getId(), carol.getName(), FoundItem.Status.UNCLAIMED, -4);
        FoundItem f3 = createFoundItem("Backpack Found", "Blue backpack left in reading room",
                "Bags", "Central Library", admin.getId(), admin.getName(), FoundItem.Status.UNCLAIMED, -1);
        FoundItem f4 = createFoundItem("Gold Jewelry", "Gold necklace found in mall restroom",
                "Jewelry", "Riverside Mall", staff.getId(), staff.getName(), FoundItem.Status.VERIFIED, -9);
        FoundItem f5 = createFoundItem("Key Bundle", "Set of car and house keys found in parking area",
                "Keys", "Airport Parking", carol.getId(), carol.getName(), FoundItem.Status.UNCLAIMED, -1);

        Claim claim1 = new Claim();
        claim1.setFoundItemId(f1.getId());
        claim1.setClaimantId(alice.getId());
        claim1.setClaimantName(alice.getName());
        claim1.setDescription("This is my wallet. It has my ID card with photo and a blue credit card.");
        claim1.setStatus(Claim.Status.APPROVED);
        claim1.setReviewNote("Verified by ID card match");
        claim1.setReviewedBy(staff.getId());
        claimRepository.save(claim1);

        Claim claim2 = new Claim();
        claim2.setFoundItemId(f2.getId());
        claim2.setClaimantId(bob.getId());
        claim2.setClaimantName(bob.getName());
        claim2.setDescription("I lost my iPhone 14 Pro at Times Square. IMEI: 123456789012345");
        claim2.setStatus(Claim.Status.PENDING);
        claimRepository.save(claim2);

        createMatch(l1.getId(), f1.getId(), 95, 40, 30, 25);
        createMatch(l2.getId(), f2.getId(), 88, 40, 28, 20);
        createMatch(l3.getId(), f3.getId(), 82, 40, 25, 17);
        createMatch(l4.getId(), f4.getId(), 90, 40, 30, 20);
        createMatch(l5.getId(), f5.getId(), 85, 40, 27, 18);

        log.info("Seed data inserted successfully.");
    }

    private User createUser(String name, String email, String password, String phone, Set<User.Role> roles) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRoles(roles);
        return userRepository.save(user);
    }

    private LostItem createLostItem(String title, String desc, String category, String location,
                                     String userId, String userName, LostItem.Status status, int daysAgo) {
        LostItem item = new LostItem();
        item.setTitle(title);
        item.setDescription(desc);
        item.setCategory(category);
        item.setLocation(location);
        item.setReportedBy(userId);
        item.setReporterName(userName);
        item.setStatus(status);
        item.setApproved(true);
        item.setLostDate(Instant.now().plus(daysAgo, ChronoUnit.DAYS));
        return lostItemRepository.save(item);
    }

    private FoundItem createFoundItem(String title, String desc, String category, String location,
                                       String userId, String userName, FoundItem.Status status, int daysAgo) {
        FoundItem item = new FoundItem();
        item.setTitle(title);
        item.setDescription(desc);
        item.setCategory(category);
        item.setLocation(location);
        item.setReportedBy(userId);
        item.setReporterName(userName);
        item.setStatus(status);
        item.setApproved(true);
        item.setFoundDate(Instant.now().plus(daysAgo, ChronoUnit.DAYS));
        return foundItemRepository.save(item);
    }

    private void createMatch(String lostId, String foundId, double score, int cat, int loc, int kw) {
        Match match = new Match();
        match.setLostItemId(lostId);
        match.setFoundItemId(foundId);
        match.setScore(score);
        match.setCategoryScore(cat);
        match.setLocationScore(loc);
        match.setKeywordScore(kw);
        matchRepository.save(match);
    }
}
