package org.iaeste.szakal2.models.dto.journey;

import lombok.Data;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;

@Data
@Getter
public class Top10DTO {

    private Map<String, Integer> usersWithCount = new HashMap<>();

    public void addUser(String fullName, int count) {
        usersWithCount.put(fullName, count);
    }

}
