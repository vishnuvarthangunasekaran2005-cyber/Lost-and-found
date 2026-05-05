// backend/src/main/java/com/lostandfound/dto/response/AuthResponse.java
package com.lostandfound.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String id;
    private String name;
    private String email;
    private Set<String> roles;
}
