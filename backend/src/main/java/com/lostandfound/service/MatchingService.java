// backend/src/main/java/com/lostandfound/service/MatchingService.java
package com.lostandfound.service;

import com.lostandfound.model.FoundItem;
import com.lostandfound.model.LostItem;
import com.lostandfound.model.Match;
import com.lostandfound.repository.FoundItemRepository;
import com.lostandfound.repository.LostItemRepository;
import com.lostandfound.repository.MatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final LostItemRepository lostItemRepository;
    private final FoundItemRepository foundItemRepository;
    private final MatchRepository matchRepository;
    private final NotificationService notificationService;

    @Async
    public void matchForLostItem(LostItem lostItem) {
        for (FoundItem found : foundItemRepository.findByDeletedFalseAndApprovedTrue()) {
            processMatch(lostItem, found);
        }
    }

    @Async
    public void matchForFoundItem(FoundItem foundItem) {
        for (LostItem lost : lostItemRepository.findByDeletedFalseAndApprovedTrue()) {
            processMatch(lost, foundItem);
        }
    }

    private void processMatch(LostItem lost, FoundItem found) {
        if (matchRepository.existsByLostItemIdAndFoundItemId(lost.getId(), found.getId())) return;

        int catScore = categoryScore(lost.getCategory(), found.getCategory());
        int locScore = locationScore(lost.getLocation(), found.getLocation());
        int kwScore = keywordScore(lost.getTitle() + " " + lost.getDescription(),
                found.getTitle() + " " + found.getDescription());
        double total = catScore + locScore + kwScore;

        if (total >= 50) {
            Match match = new Match();
            match.setLostItemId(lost.getId());
            match.setFoundItemId(found.getId());
            match.setScore(total);
            match.setCategoryScore(catScore);
            match.setLocationScore(locScore);
            match.setKeywordScore(kwScore);
            matchRepository.save(match);

            notificationService.send(lost.getReportedBy(),
                    "Potential Match Found!",
                    "A found item may match your lost " + lost.getTitle(),
                    "MATCH", lost.getId());
            notificationService.send(found.getReportedBy(),
                    "Potential Match Found!",
                    "Your found item may match a lost " + found.getTitle(),
                    "MATCH", found.getId());

            log.info("Match created: lost={} found={} score={}", lost.getId(), found.getId(), total);
        }
    }

    private int categoryScore(String cat1, String cat2) {
        if (cat1 == null || cat2 == null) return 0;
        return cat1.equalsIgnoreCase(cat2) ? 40 : 0;
    }

    private int locationScore(String loc1, String loc2) {
        if (loc1 == null || loc2 == null) return 0;
        int dist = levenshtein(loc1.toLowerCase(), loc2.toLowerCase());
        int maxLen = Math.max(loc1.length(), loc2.length());
        if (maxLen == 0) return 30;
        double similarity = 1.0 - (double) dist / maxLen;
        return (int) (similarity * 30);
    }

    private int keywordScore(String text1, String text2) {
        Set<String> tokens1 = tokenize(text1);
        Set<String> tokens2 = tokenize(text2);
        double jaccard = jaccardSimilarity(tokens1, tokens2);
        return (int) (jaccard * 30);
    }

    private Set<String> tokenize(String text) {
        if (text == null) return Collections.emptySet();
        return Arrays.stream(text.toLowerCase().split("[\\s\\W]+"))
                .filter(t -> t.length() > 2)
                .collect(Collectors.toSet());
    }

    private double jaccardSimilarity(Set<String> a, Set<String> b) {
        if (a.isEmpty() && b.isEmpty()) return 0;
        Set<String> intersection = new HashSet<>(a);
        intersection.retainAll(b);
        Set<String> union = new HashSet<>(a);
        union.addAll(b);
        return (double) intersection.size() / union.size();
    }

    private int levenshtein(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;
        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)
                        ? dp[i - 1][j - 1]
                        : 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[a.length()][b.length()];
    }
}
