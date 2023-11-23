package org.iaeste.szakal2.controllers;

import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;
import org.iaeste.szakal2.models.dto.role.RoleCreationDto;
import org.iaeste.szakal2.models.dto.role.RoleUpdateDTO;
import org.iaeste.szakal2.models.entities.Role;
import org.iaeste.szakal2.services.RoleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/roles")
@Log4j2
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public Role createRole(@RequestBody @Valid RoleCreationDto roleCreationDto) {
        return roleService.createRole(roleCreationDto);
    }

    @PutMapping("/{id}")
    public Role updateRole(@PathVariable("id") UUID id, @RequestBody @Valid RoleUpdateDTO roleUpdateDTO) {
        return roleService.updateRole(id, roleUpdateDTO);
    }

    @GetMapping
    public List<Role> getRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/{id}")
    public Role getRole(@PathVariable("id") UUID id) {
        return roleService.getRoleById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable("id") UUID id) {
        roleService.deleteRole(id);
    }
}
