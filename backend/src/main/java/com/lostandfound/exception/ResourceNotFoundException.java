// backend/src/main/java/com/lostandfound/exception/ResourceNotFoundException.java
package com.lostandfound.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
