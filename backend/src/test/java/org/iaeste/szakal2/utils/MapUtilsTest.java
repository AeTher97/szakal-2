package org.iaeste.szakal2.utils;

import org.junit.jupiter.api.Test;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class MapUtilsTest {

    @Test
    void shouldSortCorrectly() {
        Map<String, Integer> map = new LinkedHashMap<>();
        map.put("Jan", 60);
        map.put("Michał", 2);
        map.put("Ewa", 7);
        map.put("Patryk", 1);
        map.put("Maria", 8);
        map.put("Róża", 2);
        map.put("Ola", 6);
        map.put("Jakub", 1);
        map.put("Magdalena", 3);
        map.put("Witold", 4);
        map.put("Monika", 5);

        map = MapUtils.sortByValue(map);

        assertThat(map.keySet().stream().toList().get(0)).isEqualTo("Jan");
        assertThat(map.keySet().stream().toList().get(1)).isEqualTo("Maria");
        assertThat(map.keySet().stream().toList().get(2)).isEqualTo("Ewa");
        assertThat(map.keySet().stream().toList().get(3)).isEqualTo("Ola");
        assertThat(map.keySet().stream().toList().get(4)).isEqualTo("Monika");
    }
}