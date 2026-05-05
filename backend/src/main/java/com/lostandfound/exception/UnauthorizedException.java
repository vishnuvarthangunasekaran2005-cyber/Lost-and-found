// backend/src/main/java/com/lostandfound/exception/UnauthorizedException.java
package com.lostandfound.exception;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
