package org.iaeste.szakal2.models.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.iaeste.szakal2.exceptions.SzakalException;

@Data
@AllArgsConstructor
public class SzakalSort {

    private SortDirection sortDirection;
    private String columnName;

    public static SzakalSort fromString(String sortString){
        try {
            String[] parts = sortString.split(",");
            String columnName = parts[0];
            String sortDirection = parts[1];
            return new SzakalSort(SortDirection.valueOf(sortDirection), columnName);
        } catch (ArrayIndexOutOfBoundsException | IllegalArgumentException e){
            throw new SzakalException(STR."Failed to serialize sort string \{sortString}");
        }
    }

    public enum SortDirection {
        ASC,DESC
    }
}
